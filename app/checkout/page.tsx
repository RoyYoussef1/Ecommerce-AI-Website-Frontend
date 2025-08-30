"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const router = useRouter();

  type CartItem = { id: string | number; title: string; price: number; quantity: number; image?: string; };
  const subtotal = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem(
      "lastOrder",
      JSON.stringify({ form, cart, subtotal })
    );
    clearCart();
    router.push("/thankyou");
  }

  if (cart.length === 0) {
    return <p className="p-6 text-center text-gray-600">Your cart is empty 🛒</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 shadow rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-3"
        />
        <textarea
          name="address"
          placeholder="Shipping Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full border rounded p-3"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Place Order
        </button>
      </form>

      <div className="bg-gray-50 p-6 shadow rounded-lg">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <ul className="space-y-3">
          {cart.map((item: CartItem) => (
            <li key={item.id} className="flex justify-between">
              {item.image && (
                <img
                  src={`http://localhost:1337${item.image}`}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <span>
                {item.title} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-lg font-semibold">
          Total: <span className="text-indigo-700">${subtotal.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}
