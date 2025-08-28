import { notFound } from "next/navigation";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

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
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // 👈 fix: await params
  console.log("🚀 Entered ProductPage with slug:", slug);

  const product = await getProduct(slug);
  console.log("🔵 Fetched product:", product);

  if (!product) {
    console.log("⚠️ No product found for slug:", slug);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h1>
        {product.short_desc && (
          <p className="text-gray-600 mb-6">{product.short_desc}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-indigo-600">
            ${product.price}
          </span>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
