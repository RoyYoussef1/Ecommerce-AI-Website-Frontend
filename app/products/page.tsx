import Link from "next/link";
import { HiArrowLeft, HiArrowRight, HiStar } from "react-icons/hi2";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function generateMetadata() {
  return {
    title: "Products — NOVA",
    description: "Browse our curated collection",
  };
}

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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          No products found
        </h2>
        <p className="text-slate-400">Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="text-center mb-12 animate-fade-up">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
          The <span className="text-gradient">Collection</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Curated products across fashion, electronics, and more — or ask the
          AI assistant to find your perfect match.
        </p>
      </div>

      <div className="stagger space-y-5">
        {products.map((p: any) => {
          const imgUrl = p.mainImage?.url ? `${STRAPI_URL}${p.mainImage.url}` : null;

          return (
            <div
              key={p.id}
              className="glass-card flex flex-col md:flex-row overflow-hidden !rounded-3xl"
            >
              <Link
                href={`/products/${p.slug}`}
                className="md:w-1/4 flex items-center justify-center bg-white/[0.03] p-6"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={p.title}
                    className="h-52 w-full object-contain transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="h-52 w-full flex items-center justify-center text-slate-500">
                    No Image
                  </div>
                )}
              </Link>

              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <Link href={`/products/${p.slug}`}>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-white hover:text-indigo-300 transition">
                    {p.title}
                  </h2>
                </Link>
                {p.short_desc && (
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed hidden md:block">
                    {p.short_desc}
                  </p>
                )}
                <div className="flex items-center gap-1.5 mt-3">
                  <span className="flex text-amber-400">
                    <HiStar /><HiStar /><HiStar /><HiStar />
                    <HiStar className="text-slate-600" />
                  </span>
                  <span className="text-xs text-slate-500">289 reviews</span>
                </div>
              </div>

              <div className="md:w-1/4 border-t md:border-t-0 md:border-l border-white/[0.06] p-6 md:p-8 flex flex-col justify-center gap-4 text-center">
                <div>
                  <span className="font-display text-3xl font-bold text-gradient">
                    ${p.price}
                  </span>
                  <p className="text-sm text-slate-500 line-through">
                    ${(p.price * 1.25).toFixed(2)}
                  </p>
                  <p className="text-xs text-cyan-300 mt-1">Free Shipping</p>
                </div>

                <Link
                  href={`/products/${p.slug}`}
                  className="btn-neon w-full py-2.5 text-sm"
                >
                  View Product
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-10">
        <Link
          href={`/products?page=${page - 1}`}
          className={`btn-ghost px-6 py-2.5 text-sm ${
            page <= 1 ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <HiArrowLeft size={16} />
          Previous
        </Link>

        <span className="text-sm text-slate-500">Page {page}</span>

        <Link
          href={`/products?page=${page + 1}`}
          className={`btn-ghost px-6 py-2.5 text-sm ${
            products.length < pageSize ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Next
          <HiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
