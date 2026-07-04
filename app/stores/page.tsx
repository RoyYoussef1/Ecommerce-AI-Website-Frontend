import Link from "next/link";
import Image from "next/image";
import { HiArrowUpRight } from "react-icons/hi2";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

export async function generateMetadata() {
  return {
    title: "Stores — NOVA",
    description: "Find our partner stores",
  };
}

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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-6">
        <h2 className="font-display text-2xl font-bold text-white mb-2">
          No stores found
        </h2>
        <p className="text-slate-400">Please check back soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
      <div className="text-center mb-14 animate-fade-up">
        <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-3">
          Our <span className="text-gradient">Stores</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Visit our partner locations and experience the products in person.
        </p>
      </div>

      <div className="stagger grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store: any) => {
          const logoUrl = store.logo
            ? `${STRAPI_URL}${store.logo.formats?.medium?.url || store.logo.url}`
            : null;

          const description =
            store.description?.[0]?.children?.[0]?.text || "No description";

          return (
            <div key={store.id} className="glass-card flex flex-col overflow-hidden">
              <div className="flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8">
                {logoUrl ? (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl shadow-indigo-500/20">
                    <Image
                      src={logoUrl}
                      width={90}
                      height={90}
                      alt={store.name}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full glass text-slate-500 text-sm">
                    No Logo
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow p-7">
                <h2 className="font-display text-xl font-bold text-white mb-3">
                  {store.name}
                </h2>

                <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-4">
                  {description}
                </p>

                {store.types?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {store.types.map((t: any) => (
                      <span
                        key={t.id}
                        className="rounded-full glass px-3 py-1 text-xs font-medium text-indigo-200"
                      >
                        #{t.name}
                      </span>
                    ))}
                  </div>
                )}

                {store.websiteLink && (
                  <Link
                    href={store.websiteLink}
                    target="_blank"
                    className="btn-neon mt-auto w-full py-2.5 text-sm"
                  >
                    Visit Store
                    <HiArrowUpRight size={14} />
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
