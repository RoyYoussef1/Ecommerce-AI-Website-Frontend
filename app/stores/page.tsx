import Link from "next/link";
import Image from "next/image";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

async function getStores() {
  try {
    const res = await fetch(`${STRAPI_URL}/api/stores?populate=*`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Failed to fetch stores:", res.status);
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("❌ Error fetching stores:", err);
    return [];
  }
}

export default async function StorePage() {
  const stores = await getStores();

  if (stores.length === 0) {
    return <p className="p-6 text-red-600">No stores found.</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-16 px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-16 text-indigo-800 tracking-tight">
        🏬 Our Stores
      </h1>

      <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3 max-w-[1600px] mx-auto">
        {stores.map((store: any, idx: number) => {
          const logoUrl = store.logo
            ? `${STRAPI_URL}${
                store.logo.formats?.medium?.url || store.logo.url
              }`
            : null;

          const description =
            store.description?.[0]?.children?.[0]?.text || "No description";

          return (
            <div
              key={store.id}
              className="group bg-white shadow-md hover:shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col transform transition-all duration-500 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "forwards" }}
            >
              <div className="relative w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-50 p-6">
                {logoUrl ? (
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={logoUrl}
                      width={100}
                      height={100}
                      alt={store.name}
                      className="object-contain w-24 h-24"
                    />
                  </div>
                ) : (
                  <div className="text-gray-500">No Logo</div>
                )}
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-700 transition-colors">
                  {store.name}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-5">
                  {description}
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {store.types?.map((t: any) => (
                    <span
                      key={t.id}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 shadow-sm hover:bg-indigo-200 transition"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>

                {store.websiteLink && (
                  <Link
                    href={store.websiteLink}
                    target="_blank"
                    className="mt-auto inline-block text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Visit Website 🚀
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
