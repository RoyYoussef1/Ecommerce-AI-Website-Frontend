"use client";

import { useState } from "react";
import { useCart } from "../../components/CartContext";
import Link from "next/link";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const { addToCart } = useCart();

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

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
          prompt: input,
          history: JSON.stringify(history),
        })
    );

    eventSource.addEventListener("token", (e: any) => {
      const { token } = JSON.parse(e.data);
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

    eventSource.addEventListener("done", () => {
      eventSource.close();
    });

    setInput("");
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl px-5 py-3 rounded-2xl shadow-md ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>

              {m.products?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {m.products.map((p: any) => (
                    <Link key={p.id} href={`/products/${p.slug}`}>
                      <div
                        className="p-4 rounded-xl shadow-md bg-gray-50 hover:shadow-lg transition"
                      >
                        <img
                        src={`http://localhost:1337${p.image.url}`}
                        alt={p.title}
                        className="w-full h-48 object-contain rounded-md mb-2"
                      />
                      <h4 className="font-semibold text-sm">{p.title}</h4>

                      {typeof p.similarity === "number" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Similarity: {(p.similarity * 100).toFixed(2)}%
                        </p>
                      )}

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
                        className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-md"
                      >
                        Add To Cart
                      </button>
                    </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
}
