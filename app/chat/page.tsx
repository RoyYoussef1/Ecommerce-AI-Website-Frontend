"use client"; 

import Link from "next/link";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, history }),
    });

    const data = await res.json();
    const botMsg = {
      role: "assistant",
      content: data.message,
      products: data.products,
    };
    setMessages((prev) => [...prev, botMsg]);
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 relative overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 animate-fadeIn">
              What’s on the agenda today?
            </h1>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-3xl px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md transition transform hover:scale-[1.01] ${
                m.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                  : "bg-white/70 border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>

              {m.products?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {m.products.map((p: any, idx: number) => (
                    <Link
                      key={p.slug || p.uid || idx}
                      href={`/products/${p.slug}`}
                      className="block p-4 rounded-xl shadow-md bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg hover:bg-gray-200 transition"
                    >
                      <img
                        src={`http://localhost:1337${p.image.url}`}
                        alt={p.title}
                        className="w-full h-60 object-cover rounded-md mb-2"
                      />
                      <h4 className="font-semibold text-sm text-gray-800">
                        {p.title || p.uid}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Similarity: {p.similarity?.toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-md flex items-center gap-3 shadow-lg">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
