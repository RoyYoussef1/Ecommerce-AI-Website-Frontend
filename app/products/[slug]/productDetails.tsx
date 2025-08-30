"use client";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import Rater from "react-rater";
import "react-rater/lib/react-rater.css";

export default function ProductDetail({
  product,
  recommended,
}: {
  product: any;
  recommended: any[];
}) {
  const [activeImage, setActiveImage] = useState(product.mainImage);

  const plusMinusButton =
    "flex h-8 w-8 cursor-pointer items-center justify-center border duration-100 hover:bg-neutral-100 focus:ring-2 focus:ring-gray-500 active:ring-2 active:ring-gray-500";

  return (
    <div>
      <section className="container mx-auto max-w-[1200px] border-b py-5 lg:grid lg:grid-cols-2 lg:py-10 gap-6">
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
            {[
              product.mainImage,
              ...(product.galleryImages?.map((g: any) => g.url) || []),
            ]
              .filter(Boolean)
              .map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={`http://localhost:1337${img}`}
                  alt="thumbnail"
                  onClick={() => setActiveImage(img)}
                  className={`h-20 w-20 object-cover rounded-md cursor-pointer border ${
                    activeImage === img
                      ? "border-indigo-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
          </div>
        </div>

        <div className="px-5">
          <h2 className="pt-3 text-2xl font-bold">{product.title}</h2>

          <div className="mt-1 flex items-center">
            <Rater total={5} interactive={false} rating={4} />
            <p className="ml-3 text-sm text-gray-400">(120)</p>
          </div>

          <p className="mt-5 font-bold">
            Availability: <span className="text-green-600">In Stock</span>
          </p>

          <p className="mt-4 text-4xl font-bold text-violet-900">
            ${product.price}
            <span className="text-xs text-gray-400 line-through ml-2">
              ${product.price * 1.25}
            </span>
          </p>

          {product.short_desc && (
            <p className="pt-5 text-sm text-gray-500">{product.short_desc}</p>
          )}

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

          <div className="mt-7 flex gap-6">
            <button className="flex-1 flex h-12 items-center justify-center bg-violet-900 text-white hover:bg-blue-800 cursor-pointer">
              <BiShoppingBag className="mr-2" /> Add to cart
            </button>
            <button className="flex-1 flex h-12 items-center justify-center bg-amber-400 hover:bg-yellow-300 cursor-pointer">
              <AiOutlineHeart className="mr-2" /> Wishlist
            </button>
          </div>
        </div>
      </section>
      {recommended.length > 0 && (
        <section className="container mx-auto max-w-[1200px] py-8 md:py-12 px-4">
          <h3 className="text-2xl md:text-3xl font-extrabold mb-10 text-center text-indigo-700">
            You May Also Like ✨
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-8 gap-6">
            {recommended.map((item) => (
              <Link
                href={`/products/${item.slug}`}
                key={item.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
              >
                <div className="relative w-full h-48 flex items-center justify-center">
                  <img
                    src={`http://localhost:1337${item.mainImage}`}
                    alt={item.title}
                    className="h-full object-contain transform group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-semibold text-lg text-gray-800 truncate">
                    {item.title}
                  </h4>
                  <p className="text-violet-900 font-bold text-xl mt-2">
                    ${item.price}
                    <span className="text-sm text-gray-400 line-through ml-2">
                      ${(item.price * 1.2).toFixed(0)}
                    </span>
                  </p>
                  <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
                    View Product
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
