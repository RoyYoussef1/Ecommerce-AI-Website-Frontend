"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiLockClosed } from "react-icons/hi2";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const router = useRouter();

  type CartItem = {
    id: string | number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  };

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("lastOrder", JSON.stringify({ form, cart, subtotal }));
    clearCart();
    router.push("/thankyou");
  }

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-6">
        <h2 className="font-display text-2xl font-bold text-white mb-4">
          Your cart is empty
        </h2>
        <Link href="/products" className="btn-neon px-6 py-3 text-sm">
          Browse Products
        </Link>
      </div>
    );
  }

  const inputStyle =
    "w-full rounded-xl glass px-4 py-3.5 text-[15px] text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400/60 transition-colors";

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10 animate-fade-up">
        <span className="text-gradient">Checkout</span>
      </h1>

      <div className="grid md:grid-cols-5 gap-8">
        <form
          onSubmit={handleSubmit}
          className="md:col-span-3 glass-card p-6 md:p-8 space-y-5 !rounded-3xl animate-fade-up"
        >
          <h2 className="font-display text-lg font-semibold text-white">
            Shipping Details
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className={inputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className={inputStyle}
          />
          <textarea
            name="address"
            placeholder="Shipping Address"
            value={form.address}
            onChange={handleChange}
            required
            rows={4}
            className={inputStyle}
          />
          <button type="submit" className="btn-neon w-full py-4 text-base">
            <HiLockClosed size={18} />
            Place Order — ${subtotal.toFixed(2)}
          </button>
          <p className="text-center text-xs text-slate-500">
            Secure checkout · Free shipping on all orders
          </p>
        </form>

        <div
          className="md:col-span-2 glass-card p-6 md:p-8 !rounded-3xl h-fit animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="font-display text-lg font-semibold text-white mb-5">
            Order Summary
          </h2>
          <ul className="space-y-4">
            {cart.map((item: CartItem) => (
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-slate-500">×{item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-slate-200">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-white/10 pt-4 flex justify-between items-center">
            <span className="text-slate-400">Total</span>
            <span className="font-display text-2xl font-bold text-gradient">
              ${subtotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
