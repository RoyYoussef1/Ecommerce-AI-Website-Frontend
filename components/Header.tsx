"use client";

import Link from "next/link";
import { BiShoppingBag } from "react-icons/bi";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { useCart } from "./CartContext";

type CartItem = {
  id: string;
  name: string;
  quantity: number;
};

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-[1920px] px-8 py-2 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-indigo-700">
          <img src="/brandLogo-updated.png" alt="Brand Logo" className="w-24" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 md:gap-20 text-gray-700 font-medium text-lg">
          <Link
            href="/chat"
            className="hover:text-indigo-600 transition-colors"
          >
            ChatBot
          </Link>
          <Link
            href="/products"
            className="hover:text-indigo-600 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/stores"
            className="hover:text-indigo-600 transition-colors"
          >
            Stores
          </Link>
          <Link
            href="/cart"
            className="relative hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <BiShoppingBag size={26} className="text-indigo-700" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
            <span className="hidden md:inline">Cart</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-8 text-indigo-600">
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaFacebookF size={22} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaInstagram size={22} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaTiktok size={22} />
          </a>
        </div>
      </div>
    </header>
  );
}
