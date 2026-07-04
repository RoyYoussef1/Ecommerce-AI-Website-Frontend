"use client";
import Link from "next/link";
import { BiTrash } from "react-icons/bi";
import { HiOutlineShoppingBag, HiArrowRight } from "react-icons/hi2";
import { useCart } from "../../components/CartContext";

type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-6 animate-fade-up">
        <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl glass">
          <HiOutlineShoppingBag className="text-slate-400" size={30} />
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3">
          Your cart is empty
        </h2>
        <p className="text-slate-400 mb-8 max-w-sm">
          Browse the collection or ask the AI assistant to find something
          perfect for you.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/products" className="btn-neon px-6 py-3 text-sm">
            Browse Products
          </Link>
          <Link href="/chat" className="btn-ghost px-6 py-3 text-sm">
            Ask the AI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-10 animate-fade-up">
        Your <span className="text-gradient">Cart</span>
      </h1>

      <div className="stagger space-y-4">
        {cart.map((item: CartItem) => (
          <div
            key={item.id}
            className="glass-card flex flex-col sm:flex-row sm:items-center gap-4 p-5 !rounded-2xl"
          >
            <div className="flex items-center gap-4 flex-1">
              {item.image ? (
                <div className="h-20 w-20 shrink-0 rounded-xl bg-white/[0.04] border border-white/10 p-2">
                  <img
                    src={`http://localhost:1337${item.image}`}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-20 w-20 shrink-0 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-500">
                  No Image
                </div>
              )}
              <div>
                <h2 className="font-semibold text-white">{item.title}</h2>
                <p className="text-sm text-slate-400">
                  ${Number(item.price).toFixed(2)} each
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6">
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass text-slate-300 hover:text-white hover:border-indigo-400/40 transition cursor-pointer"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-white">
                  {item.quantity}
                </span>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg glass text-slate-300 hover:text-white hover:border-indigo-400/40 transition cursor-pointer"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <span className="font-display font-bold text-lg text-gradient w-24 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.title}`}
              >
                <BiTrash size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-strong mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">Total</p>
          <p className="font-display text-3xl font-bold text-gradient">
            ${totalPrice.toFixed(2)}
          </p>
        </div>
        <Link href="/checkout" className="btn-neon px-8 py-3.5 text-sm">
          Proceed to Checkout
          <HiArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
