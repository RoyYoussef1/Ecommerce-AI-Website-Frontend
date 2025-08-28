import Link from "next/link";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

async function getProducts() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch products:", res.status);
      return [];
    }

    const data = await res.json();
    console.log("📦 Strapi response:", JSON.stringify(data, null, 2));

    // If Strapi returns an array directly
    if (Array.isArray(data)) return data;

    // If Strapi wraps in { data: [...] }
    return data.data || [];
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  if (products.length === 0) {
    return <p className="p-6 text-red-600">No products found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">
        Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white rounded-xl shadow-lg p-6">
            <img
              src={`http://localhost:1337${p.mainImage.url}`}
              alt={p.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {p.title}
            </h2>
            {p.short_desc && (
              <p className="text-gray-600 mb-4">{p.short_desc}</p>
            )}
            <p className="text-indigo-600 font-bold mb-4">${p.price}</p>
            <Link
              href={`/products/${p.slug}`}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
