// app/products/ProductCard.tsx (Client Component)
"use client";

import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export default function ProductCard({ product }: { product: any }) {
  const imgUrl =
    product.mainImage?.data?.attributes?.url &&
    `${STRAPI_URL}${product.mainImage.data.attributes.url}`;

  return (
    <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group">
      <div className="relative w-full h-80">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow">
          <AiOutlineHeart size={22} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6 flex flex-col">
        <h2 className="text-lg font-bold">{product.title}</h2>
        {product.short_desc && (
          <p className="text-gray-500 text-sm line-clamp-2 mb-4">
            {product.short_desc}
          </p>
        )}
        <div className="flex justify-between">
          <span className="text-indigo-700 font-bold text-xl">
            ${product.price}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
