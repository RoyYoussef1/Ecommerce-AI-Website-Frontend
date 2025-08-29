"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-[1920px] px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-indigo-700">
          <img src="/brandLogo-updated.png" alt="Brand Logo" className="w-24" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 md:gap-20 text-gray-700 font-medium">
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
            className="hover:text-indigo-600 transition-colors"
          >
            Cart
          </Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-6 text-indigo-600">
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaFacebookF size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            className="hover:text-indigo-500 transition"
          >
            <FaTiktok size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}
