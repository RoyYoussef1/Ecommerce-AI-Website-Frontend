"use client";

import { notFound } from "next/navigation";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import { useState } from "react";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

// --- Fetch product from Strapi ---
async function getProduct(slug: string) {
  const url = `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}`;
  console.log("🟡 Fetching from:", url);

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const data = await res.json();
  console.log("📦 Strapi response:", data);

  const p = data[0];

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    short_desc: p.short_desc,
    mainImage: p.mainImage.url,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("🚀 Entered ProductPage with slug:", slug);

  const product = await getProduct(slug);
  console.log("🔵 Fetched product:", product);

  if (!product) {
    console.log("⚠️ No product found for slug:", slug);
    return notFound();
  }

  // Pass product down to client component
  return <ProductDetail product={product} />;
}

// --- Client Component for UI ---
function ProductDetail({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(
    product.mainImage
  );

  const plusMinusButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center border duration-100 hover:bg-neutral-100 focus:ring-2 focus:ring-gray-500 active:ring-2 active:ring-gray-500";

  return (
    <section className="container flex-grow mx-auto max-w-[1200px] border-b py-5 lg:grid lg:grid-cols-2 lg:py-10 gap-6">
      <div className="flex flex-col items-center">
        <div className="w-full h-[500px] rounded-lg flex items-center justify-center mb-4">
          {activeImage ? (
            <img
              src={`http://localhost:1337${activeImage}`}
              alt={product.title}
              className="h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-gray-500">No Image</span>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto">
          {[product.mainImage, ...(product.galleryImages?.map((g: any) => g.url) || [])]
            .filter(Boolean)
            .map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 object-cover rounded-md cursor-pointer border ${
                  activeImage === img ? "border-indigo-500" : "border-gray-300"
                }`}
              />
            ))}
        </div>
      </div>

      {/* Product info */}
      <div className="mx-auto px-5 lg:px-5">
        <h2 className="pt-3 text-2xl font-bold lg:pt-0">{product.title}</h2>

        <div className="mt-1 flex items-center">
          <span style={{ fontSize: "20px" }}>
            <Rater total={5} interactive={false} rating={4} />
          </span>
          <p className="ml-3 text-sm text-gray-400">(120)</p>
        </div>

        <p className="mt-5 font-bold">
          Availability: <span className="text-green-600">In Stock</span>
        </p>

        <p className="mt-4 text-4xl font-bold text-violet-900">
          ${product.price}
          <span className="text-xs text-gray-400 line-through ml-2">${product.price * 1.25}</span>
        </p>

        {product.short_desc && (
          <p className="pt-5 text-sm leading-5 text-gray-500">
            {product.short_desc}
          </p>
        )}

        {/* Quantity */}
        <div className="mt-6">
          <p className="pb-2 text-xs text-gray-500">Quantity</p>
          <div className="flex">
            <button className={plusMinusButton}>−</button>
            <div className="flex h-8 w-8 items-center justify-center border-t border-b">
              1
            </div>
            <button className={plusMinusButton}>+</button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-row items-center gap-6">
          <button className="flex h-12 w-1/3 items-center justify-center bg-violet-900 text-white hover:bg-blue-800 cursor-pointer">
            <BiShoppingBag className="mx-2" /> Add to cart
          </button>
          <button className="flex h-12 w-1/3 items-center justify-center bg-amber-400 hover:bg-yellow-300 cursor-pointer">
            <AiOutlineHeart className="mx-2" /> Wishlist
          </button>
        </div>
      </div>
    </section>
  );
}
