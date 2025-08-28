"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    const userMsg = { role: "user", content: input };
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, history }),
    });

    const data = await res.json();
    const botMsg = { role: "assistant", content: data.message, products: data.products };
    setMessages(prev => [...prev, botMsg]);
  }

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            <p>{m.content}</p>
            {m.products?.length > 0 && (
              <div className="products">
                {m.products.map((p) => (
                  <div key={p.uid} className="product-card">
                    <h4>{p.title || p.uid}</h4>
                    <p>Similarity: {p.similarity.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-bar">
        <input value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
