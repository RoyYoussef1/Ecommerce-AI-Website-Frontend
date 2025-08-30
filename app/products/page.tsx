import Link from "next/link";
import { AiOutlineHeart } from "react-icons/ai";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

async function getProducts(page: number = 1, pageSize: number = 6) {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/products?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { products: [] };
    const data = await res.json();
    return {
      products: Array.isArray(data) ? data : data.data || [],
    };
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return { products: [] };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 6;

  const { products } = await getProducts(page, pageSize);

  if (!products || products.length === 0) {
    return <p className="p-6 text-red-600">No products found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="bg-gradient-to-br from-indigo-700 to-purple-700 text-white rounded-xl shadow-md mb-10 p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to Our Shopping Page!</h1>
        <p className="text-lg">Select from a wide variety of amazing products 🎉</p>
      </div>

      <div className="space-y-8">
        {products.map((p: any) => {
          const imgUrl = p.mainImage?.url ? `${STRAPI_URL}${p.mainImage.url}` : null;

          return (
            <div
              key={p.id}
              className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="md:w-1/5 flex items-center justify-center md:border-r border-r-0 border-b md:border-b-0">
                {imgUrl ? (
                  <img src={imgUrl} alt={p.title} className="object-contain h-80 w-full" />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 p-5">
                <h2 className="text-xl font-bold text-gray-800">{p.title}</h2>
                {p.short_desc && (
                  <p className="text-gray-600 mt-2 md:block hidden">{p.short_desc}</p>
                )}
                <div className="flex items-center mt-1.5 md:mt-3">
                  <span className="text-green-600 font-semibold">★ ★ ★ ★ ☆</span>
                  <span className="ml-2 text-sm text-gray-500">289 reviews</span>
                </div>
              </div>
              <div className="md:w-1/4 border-t md:border-t-0 md:border-l flex flex-col justify-center p-5 space-y-3 md:text-center">
                <div className="pb-2">
                  <span className="text-indigo-700 font-extrabold text-xl">${p.price}</span>
                  <p className="text-sm text-gray-500 line-through">${p.price * 1.25}</p>
                  <p className="text-green-600 text-sm">Free Shipping</p>
                </div>

                <Link
                  href={`/products/${p.slug}`}
                  className="block w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition text-center"
                >
                  Buy Now
                </Link>
                <button className="flex items-center justify-center gap-2 w-full border border-indigo-600 text-indigo-600 py-2 rounded-md hover:bg-indigo-50 transition">
                  <AiOutlineHeart size={18} />
                  Add to Wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <Link
          href={`/products?page=${page - 1}`}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${
            page <= 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Previous
        </Link>

        <Link
          href={`/products?page=${page + 1}`}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${
            products.length < pageSize ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}
