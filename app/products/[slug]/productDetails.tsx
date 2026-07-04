"use client";
import Link from "next/link";
import { useState } from "react";
import { HiOutlineShoppingBag, HiStar, HiCheckCircle } from "react-icons/hi2";
import { useCart } from "../../../components/CartContext";

export default function ProductDetail({
  product,
  recommended,
}: {
  product: any;
  recommended: any[];
}) {
  const [activeImage, setActiveImage] = useState(product.mainImage);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const qtyButton =
    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl glass text-slate-300 hover:text-white hover:border-indigo-400/40 transition-all duration-300";

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      slug: product.slug,
      image: product.mainImage,
      quantity,
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      <section className="grid lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <div className="animate-fade-up">
          <div className="glass-card !rounded-3xl h-[420px] md:h-[500px] flex items-center justify-center p-8 mb-4">
            {activeImage ? (
              <img
                src={`http://localhost:1337${activeImage}`}
                alt={product.title}
                className="h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <span className="text-slate-500">No Image</span>
            )}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[
              product.mainImage,
              ...(product.galleryImages?.map((g: any) => g.url) || []),
            ]
              .filter(Boolean)
              .map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer bg-white/[0.03] p-1.5 ${
                    activeImage === img
                      ? "border-indigo-400 shadow-lg shadow-indigo-500/25"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <img
                    src={`http://localhost:1337${img}`}
                    alt="thumbnail"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Info */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex text-amber-400">
              <HiStar /><HiStar /><HiStar /><HiStar />
              <HiStar className="text-slate-600" />
            </span>
            <span className="text-sm text-slate-500">(120 reviews)</span>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
            <HiCheckCircle className="text-emerald-400" size={18} />
            In Stock — ships within 24h
          </p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-5xl font-bold text-gradient">
              ${product.price}
            </span>
            <span className="text-lg text-slate-500 line-through">
              ${(product.price * 1.25).toFixed(2)}
            </span>
          </div>

          {product.short_desc && (
            <p className="mt-6 text-slate-400 leading-relaxed">
              {product.short_desc}
            </p>
          )}

          <div className="mt-8">
            <p className="pb-3 text-xs uppercase tracking-widest text-slate-500">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <button
                className={qtyButton}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-10 text-center font-display text-lg font-semibold text-white">
                {quantity}
              </span>
              <button
                className={qtyButton}
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="btn-neon mt-8 w-full py-4 text-base"
          >
            <HiOutlineShoppingBag size={20} />
            Add to Cart — ${(product.price * quantity).toFixed(2)}
          </button>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="mt-20 md:mt-28">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center text-white mb-10">
            You may also <span className="text-gradient">like</span>
          </h3>
          <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommended.map((item) => (
              <Link
                href={`/products/${item.slug}`}
                key={item.id}
                className="glass-card overflow-hidden group"
              >
                <div className="h-48 flex items-center justify-center bg-white/[0.03] p-5">
                  <img
                    src={`http://localhost:1337${item.mainImage}`}
                    alt={item.title}
                    className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 text-center">
                  <h4 className="font-semibold text-white truncate group-hover:text-indigo-300 transition">
                    {item.title}
                  </h4>
                  <p className="font-display text-xl font-bold text-gradient mt-2">
                    ${item.price}
                  </p>
                  <span className="btn-ghost mt-4 w-full py-2 text-xs inline-flex">
                    View Product
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
