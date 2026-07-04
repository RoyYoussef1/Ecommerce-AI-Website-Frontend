"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BiShoppingBag, BiMenu, BiX } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";
import { useCart } from "./CartContext";

const NAV_LINKS = [
  { href: "/chat", label: "AI Assistant" },
  { href: "/products", label: "Products" },
  { href: "/stores", label: "Stores" },
];

export default function Header() {
  const { cart } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalItems = cart.reduce(
    (sum: number, item: { quantity: number }) => sum + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="glass-strong mx-auto max-w-6xl rounded-2xl px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 group-hover:shadow-indigo-500/70 transition-shadow">
            <HiSparkles className="text-white" size={18} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            NOVA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-indigo-500/20 text-indigo-200 shadow-inner"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              pathname.startsWith("/cart")
                ? "bg-indigo-500/20 text-indigo-200"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <BiShoppingBag size={20} />
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 px-1 text-[11px] font-bold text-white shadow-lg shadow-cyan-500/40">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <BiX size={24} /> : <BiMenu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="glass-strong md:hidden mx-auto max-w-6xl mt-2 rounded-2xl p-3 flex flex-col gap-1 animate-slide-down">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition ${
                pathname.startsWith(link.href)
                  ? "bg-indigo-500/20 text-indigo-200"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
