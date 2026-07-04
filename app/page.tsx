import Link from "next/link";
import Image from "next/image";
import {
  HiSparkles,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShoppingBag,
  HiOutlineBuildingStorefront,
  HiOutlineBolt,
  HiArrowRight,
} from "react-icons/hi2";

export async function generateMetadata() {
  return {
    title: "NOVA — AI-Powered Shopping",
    description: "Shop smarter with an AI-powered assistant",
  };
}

const FEATURES = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: "AI Assistant",
    desc: "Describe what you want in plain language — budgets, styles, brands — and get instant matches.",
  },
  {
    icon: HiOutlineShoppingBag,
    title: "Curated Products",
    desc: "A hand-picked collection across fashion, electronics, and more at fair prices.",
  },
  {
    icon: HiOutlineBuildingStorefront,
    title: "Partner Stores",
    desc: "Discover our partner stores and experience products up close near you.",
  },
  {
    icon: HiOutlineBolt,
    title: "Instant Checkout",
    desc: "Add to cart from chat and check out in seconds. No friction, no fuss.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 text-center">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-72 w-72 rounded-full bg-indigo-600/30 blur-[120px] animate-pulse-glow" />

        <div className="relative animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-indigo-200 mb-8">
            <HiSparkles className="text-cyan-300" />
            Powered by AI — shopping, reimagined
          </span>

          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
            Shop at the speed
            <br />
            of <span className="text-gradient">thought</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed mb-10">
            Tell our AI assistant what you need — “cheapest iPhone”, “a t-shirt
            between $10 and $15” — and watch the perfect products appear.
            Browse, compare, and check out without lifting more than a finger.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/chat" className="btn-neon px-8 py-3.5 text-base">
              <HiSparkles size={18} />
              Try the AI Assistant
            </Link>
            <Link href="/products" className="btn-ghost px-8 py-3.5 text-base">
              Browse Products
              <HiArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Floating chat preview */}
        <div className="relative mx-auto mt-16 max-w-lg animate-float">
          <div className="glass-card p-5 text-left">
            <div className="flex justify-end mb-3">
              <span className="rounded-2xl rounded-br-sm bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-2 text-sm text-white shadow-lg shadow-indigo-500/30">
                get me the cheapest iphones
              </span>
            </div>
            <div className="flex justify-start">
              <span className="rounded-2xl rounded-bl-sm glass px-4 py-2 text-sm text-slate-200">
                Found 3 iPhones sorted by price — cheapest first ✦
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-center text-white mb-3">
          Everything you need
        </h2>
        <p className="text-center text-slate-400 mb-12">
          A complete shopping experience, upgraded with intelligence.
        </p>

        <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="glass-card p-6">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/20">
                <feature.icon className="text-indigo-300" size={22} />
              </span>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore cards */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <h2 className="font-display text-2xl md:text-4xl font-bold text-center text-white mb-12">
          Start exploring
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              href: "/products",
              img: "/allproducts.webp",
              title: "Discover Products",
              desc: "Explore the latest drops with a seamless, tailored experience.",
              cta: "Browse Products",
            },
            {
              href: "/stores",
              img: "/stores.jpg",
              title: "Find Our Stores",
              desc: "Experience our products up close at partner locations.",
              cta: "Explore Stores",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group relative h-80 rounded-3xl overflow-hidden border border-white/10 hover:border-indigo-400/40 transition-colors duration-500"
            >
              <Image
                src={card.img}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-[#05060f]/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-300 mb-4 max-w-sm">
                  {card.desc}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 group-hover:text-cyan-300 group-hover:gap-3 transition-all">
                  {card.cta}
                  <HiArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
