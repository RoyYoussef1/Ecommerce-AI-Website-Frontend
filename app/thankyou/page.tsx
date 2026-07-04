"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiCheckCircle, HiSparkles } from "react-icons/hi2";

export default function ThankYouPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-400">No recent order found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 md:py-16 text-center">
      <div className="animate-fade-up">
        <span className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-400/30">
          <HiCheckCircle className="text-emerald-400" size={44} />
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
          Order <span className="text-gradient">Confirmed</span>
        </h1>
        <p className="text-slate-400 mb-10">
          Thank you, {order.form.name.split(" ")[0]}! We&apos;ve received your
          order and will ship it soon.
        </p>
      </div>

      <div
        className="glass-card p-6 md:p-8 text-left !rounded-3xl animate-fade-up"
        style={{ animationDelay: "0.1s" }}
      >
        <h2 className="font-display text-lg font-semibold text-white mb-5">
          Order Summary
        </h2>

        <div className="space-y-1.5 text-sm text-slate-300 mb-6">
          <p>
            <span className="text-slate-500">Name:</span> {order.form.name}
          </p>
          <p>
            <span className="text-slate-500">Email:</span> {order.form.email}
          </p>
          <p>
            <span className="text-slate-500">Address:</span>{" "}
            {order.form.address}
          </p>
        </div>

        <ul className="space-y-4 border-t border-white/10 pt-5">
          {order.cart.map((item: any) => (
            <li key={item.id} className="flex items-center gap-3">
              {item.image && (
                <div className="h-14 w-14 shrink-0 rounded-lg bg-white/[0.04] border border-white/10 p-1.5">
                  <img
                    src={`http://localhost:1337${item.image}`}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <span className="flex-1 text-sm text-white truncate">
                {item.title}{" "}
                <span className="text-slate-500">×{item.quantity}</span>
              </span>
              <span className="text-sm font-semibold text-slate-200">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="text-slate-400">Total</span>
          <span className="font-display text-2xl font-bold text-gradient">
            ${order.subtotal.toFixed(2)}
          </span>
        </div>
      </div>

      <div
        className="pt-10 animate-fade-up"
        style={{ animationDelay: "0.2s" }}
      >
        <Link href="/chat" className="btn-neon px-8 py-3.5 text-sm">
          <HiSparkles size={16} />
          Back to the AI Assistant
        </Link>
      </div>
    </div>
  );
}
