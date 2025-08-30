"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
    }
  }, []);

  if (!order) {
    return <p className="p-6 text-center text-gray-600">No recent order found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🎉 Thank You for Your Order!
      </h1>
      <p className="text-lg mb-8">We’ve received your order and will ship it soon.</p>

      <div className="bg-white shadow rounded-lg p-6 text-left">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p>
          <strong>Name:</strong> {order.form.name}
        </p>
        <p>
          <strong>Email:</strong> {order.form.email}
        </p>
        <p>
          <strong>Address:</strong> {order.form.address}
        </p>

        <ul className="mt-4 space-y-2">
          {order.cart.map((item: any) => (
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
          Total: <span className="text-indigo-700">${order.subtotal.toFixed(2)}</span>
        </p>
      </div>
      <div className="pt-8 pb-4">
        <Link
          href="/chat"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Back to Chat
        </Link>
      </div>
    </div>
  );
}
