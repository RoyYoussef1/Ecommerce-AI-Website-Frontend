import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-indigo-50">
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/homebanner.png" 
          alt="Shopping Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-3xl px-6 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-lg">
            Welcome to Our Store ✨
          </h1>
          <p className="text-lg md:text-xl mb-4 md:mb-8 leading-relaxed text-gray-100">
            Discover stylish outfits, explore our partner stores, and shop
            smarter with the help of our AI-powered chatbot 🚀
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/chat"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold rounded-full shadow-lg transition"
            >
              Try the Chatbot
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 px-6 bg-white">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-10">
          What We Offer
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              🤖 Smart ChatBot
            </h3>
            <p className="text-gray-600">
              Get instant answers & recommendations to shop with ease.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              🛍️ Quality Products
            </h3>
            <p className="text-gray-600">
              Browse a curated collection of products at great prices.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              🏬 Nearby Stores
            </h3>
            <p className="text-gray-600">
              Find our stores near you & enjoy a personalized experience.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">
              🛒 Easy Cart
            </h3>
            <p className="text-gray-600">
              Add items to your cart and checkout in just a few clicks.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 px-6 bg-gradient-to-br from-indigo-700 to-purple-700 text-white">
        <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-8 md:mb-12 tracking-tight">
          Ready to Start Exploring?
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 md:gap-10 gap-7">
          <div className="relative group bg-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
            <div className="relative h-72 w-full">
              <Image
                src="/allproducts.webp"
                alt="Products"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-3xl font-bold mb-3">Discover Products</h3>
                <p className="mb-6 text-white/90 text-sm font-medium md:text-base max-w-sm">
                  Explore our latest products and enjoy a seamless shopping
                  experience tailored just for you.
                </p>
                <Link
                  href="/products"
                  className="px-6 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-100 transition"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>

          <div className="relative group bg-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500">
            <div className="relative h-72 w-full">
              <Image
                src="/stores.jpg"
                alt="Stores"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <h3 className="text-3xl font-bold mb-3">Find Our Stores</h3>
                <p className="mb-6 text-white/90 text-sm font-medium md:text-base max-w-sm">
                  Discover our partner stores and experience our products up
                  close in your favorite locations.
                </p>
                <Link
                  href="/stores"
                  className="px-6 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-100 transition"
                >
                  Explore Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
