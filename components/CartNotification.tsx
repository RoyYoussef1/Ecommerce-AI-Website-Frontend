"use client";

import { HiCheckCircle } from "react-icons/hi2";
import { useCart } from "./CartContext";

export default function CartNotification() {
  const { notification } = useCart();

  if (!notification) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
      <div className="glass-strong flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium text-white shadow-2xl shadow-emerald-500/10 border-emerald-400/30">
        <HiCheckCircle className="text-emerald-400 shrink-0" size={20} />
        {notification}
      </div>
    </div>
  );
}
