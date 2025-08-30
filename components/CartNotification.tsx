"use client";

import { useCart } from "./CartContext";

export default function CartNotification() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-green-600 text-white py-3 text-center font-medium animate-slideDown">
      {notification}
    </div>
  );
}
