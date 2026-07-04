"use client";

import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ProductCard({ product }: { product: any }) {
  const imgUrl =
    product.mainImage?.data?.attributes?.url &&
    `${STRAPI_URL}${product.mainImage.data.attributes.url}`;

  return (
    <div className="glass-card relative overflow-hidden group">
      <div className="relative w-full h-72 bg-white/[0.03] p-4">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.title}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
        <button className="absolute top-4 right-4 glass p-2 rounded-full text-slate-300 hover:text-rose-400 transition">
          <AiOutlineHeart size={20} />
        </button>
      </div>

      <div className="p-5 flex flex-col">
        <h2 className="font-display text-lg font-bold text-white">
          {product.title}
        </h2>
        {product.short_desc && (
          <p className="text-slate-400 text-sm line-clamp-2 mb-4">
            {product.short_desc}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-xl text-gradient">
            ${product.price}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="btn-neon px-4 py-2 text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
