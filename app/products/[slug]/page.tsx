import { notFound } from "next/navigation";
import ProductDetail from "./productDetails";

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

async function getProduct(slug: string) {
  const url = `${STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=*`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return notFound();

  const data = await res.json();
  const p = data[0];
  if (!p) return notFound();

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    short_desc: p.short_desc,
    mainImage: p.mainImage?.url,
    galleryImages: p.galleryImages || [],
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  return <ProductDetail product={product} />;
}
