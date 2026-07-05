"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "../../components/CartContext";
import Link from "next/link";
import {
  HiSparkles,
  HiPaperAirplane,
  HiOutlineShoppingBag,
  HiPaperClip,
  HiXMark,
} from "react-icons/hi2";

const SUGGESTIONS = [
  "Get me the cheapest iPhones",
  "A t-shirt between $10 and $15",
  "Most expensive headphones",
  "Something to wear under $35",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingLabel, setThinkingLabel] = useState("");
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { addToCart } = useCart();
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("Image is too large. Maximum size is 5MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAttachedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function removeAttachedImage() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setAttachedImage(null);
    setPreviewUrl(null);
  }

  function updateAssistant(index: number, updater: (m: any) => any) {
    setMessages((prev) => prev.map((m, i) => (i === index ? updater(m) : m)));
  }

  async function sendImageMessage(content: string, image: File, imageUrl: string) {
    const userMsg = { role: "user", content, image: imageUrl };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setThinkingLabel("Analyzing image...");

    const assistantIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", products: [] },
    ]);

    setAttachedImage(null);
    setPreviewUrl(null);
    setInput("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      if (content) formData.append("prompt", content);

      const res = await fetch("/api/imageSearch", {
        method: "POST",
        body: formData,
      });

      if (!res.ok || !res.body) {
        let message = "Sorry, something went wrong uploading your image.";
        try {
          const err = await res.json();
          if (err?.error) message = err.error;
        } catch {}
        setIsThinking(false);
        updateAssistant(assistantIndex, (m) => ({ ...m, content: message }));
        return;
      }

      // Parse the SSE stream from the fetch response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() || "";

        for (const block of blocks) {
          let event = "message";
          let data = "";
          for (const line of block.split("\n")) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data += line.slice(5).trim();
          }
          if (!data) continue;

          try {
            const parsed = JSON.parse(data);

            if (event === "status") {
              setThinkingLabel(parsed.status || "");
            } else if (event === "token") {
              setIsThinking(false);
              updateAssistant(assistantIndex, (m) => ({
                ...m,
                content: m.content + parsed.token,
              }));
            } else if (event === "products") {
              updateAssistant(assistantIndex, (m) => ({
                ...m,
                products: parsed,
              }));
            } else if (event === "done") {
              setIsThinking(false);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error("Image search failed:", err);
      updateAssistant(assistantIndex, (m) => ({
        ...m,
        content:
          m.content ||
          "Sorry, something went wrong while analyzing your image. Please try again.",
      }));
    } finally {
      setIsThinking(false);
      setThinkingLabel("");
    }
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();

    if (attachedImage && previewUrl) {
      await sendImageMessage(content, attachedImage, previewUrl);
      return;
    }

    if (!content) return;

    const userMsg = { role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    const assistantIndex = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "", products: [] },
    ]);

    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const eventSource = new EventSource(
      "/api/chat/stream?" +
        new URLSearchParams({
          prompt: content,
          history: JSON.stringify(history),
        })
    );

    eventSource.addEventListener("token", (e: any) => {
      const { token } = JSON.parse(e.data);
      setIsThinking(false);
      setMessages((prev) =>
        prev.map((m, i) =>
          i === assistantIndex ? { ...m, content: m.content + token } : m
        )
      );
    });

    eventSource.addEventListener("products", (e: any) => {
      const products = JSON.parse(e.data);
      setMessages((prev) =>
        prev.map((m, i) => (i === assistantIndex ? { ...m, products } : m))
      );
    });

    eventSource.addEventListener("cart", (e: any) => {
      const { added } = JSON.parse(e.data);
      if (added) {
        addToCart({
          id: added.id,
          title: added.title,
          price: added.price,
          image: added.image?.url || added.image,
          quantity: 1,
        });
      }
    });

    eventSource.addEventListener("navigate", (e: any) => {
      const { url } = JSON.parse(e.data);
      window.location.href = url;
    });

    eventSource.addEventListener("done", () => {
      setIsThinking(false);
      eventSource.close();
    });

    setInput("");
  }

  const isEmpty = messages.length === 0;
  const canSend = Boolean(input.trim() || attachedImage);

  return (
    <div className="mx-auto flex h-[calc(100dvh-92px)] max-w-4xl flex-col px-4 pt-4 pb-4">
      {/* Messages / Welcome */}
      <div className="flex-1 overflow-y-auto rounded-3xl">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center px-6 animate-fade-up">
            <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/40 animate-float">
              <HiSparkles className="text-white" size={30} />
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              What are you <span className="text-gradient">looking for</span>?
            </h1>
            <p className="text-slate-400 max-w-md mb-10">
              Ask me anything — I can find products by type, brand, budget, or
              price range, and add them straight to your cart. You can also
              attach a photo of a product to find similar items.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="glass rounded-2xl px-4 py-3 text-sm text-slate-300 text-left hover:text-white hover:border-indigo-400/40 transition-all duration-300 cursor-pointer"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-2 md:p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex animate-fade-up ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed ${
                    m.role === "user"
                      ? "rounded-3xl rounded-br-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "rounded-3xl rounded-bl-md glass-strong text-slate-200"
                  }`}
                >
                  {m.image && (
                    <img
                      src={m.image}
                      alt="Uploaded product"
                      className="mb-2 max-h-48 rounded-2xl object-contain"
                    />
                  )}

                  {m.content ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    m.role === "assistant" &&
                    isThinking &&
                    i === messages.length - 1 && (
                      <span className="flex items-center gap-2 py-1">
                        <span className="flex items-center gap-1.5">
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                          <span className="typing-dot" />
                        </span>
                        {thinkingLabel && (
                          <span className="text-xs text-slate-400">
                            {thinkingLabel}
                          </span>
                        )}
                      </span>
                    )
                  )}

                  {m.products?.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {m.products.map((p: any) => (
                        <div
                          key={p.id}
                          className="glass-card overflow-hidden !rounded-2xl"
                        >
                          <Link href={`/products/${p.slug}`}>
                            <div className="relative h-40 bg-white/[0.03] p-3">
                              <img
                                src={`http://localhost:1337${p.image.url}`}
                                alt={p.title}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </Link>
                          <div className="p-3.5">
                            <Link href={`/products/${p.slug}`}>
                              <h4 className="text-sm font-semibold text-white line-clamp-1 hover:text-indigo-300 transition">
                                {p.title}
                              </h4>
                            </Link>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="font-display text-base font-bold text-gradient">
                                ${Number(p.price).toFixed(2)}
                              </span>
                              {typeof p.similarity === "number" && (
                                <span className="text-[10px] text-slate-500">
                                  {(p.similarity * 100).toFixed(0)}% match
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                addToCart({
                                  id: p.id,
                                  title: p.title,
                                  price: p.price,
                                  image: p.image.url,
                                  quantity: 1,
                                })
                              }
                              className="btn-neon mt-3 w-full py-2 text-xs"
                            >
                              <HiOutlineShoppingBag size={14} />
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="glass-strong mt-4 rounded-2xl p-2">
        {previewUrl && (
          <div className="flex items-center gap-3 px-3 pt-2 pb-1">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Attached preview"
                className="h-16 w-16 rounded-xl object-cover border border-white/10"
              />
              <button
                onClick={removeAttachedImage}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-red-500 transition"
                aria-label="Remove attached image"
              >
                <HiXMark size={12} />
              </button>
            </div>
            <span className="text-xs text-slate-400">
              Image attached — I&apos;ll find similar products
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Attach an image"
            title="Attach an image"
          >
            <HiPaperClip size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSend && sendMessage()}
            placeholder={
              attachedImage
                ? "Add a note about the image (optional)…"
                : "Ask for anything… e.g. “cheapest iPhones”"
            }
            className="flex-1 bg-transparent px-4 py-3 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!canSend}
            className="btn-neon h-11 w-11 !rounded-xl disabled:opacity-40 disabled:pointer-events-none"
            aria-label="Send message"
          >
            <HiPaperAirplane size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
