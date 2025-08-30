"use client";
import Link from "next/link";
import { BiTrash } from "react-icons/bi";
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
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty 🛒</h2>
        <Link
          href="/products"
          className="px-6 py-3 bg-violet-900 text-white rounded-md hover:bg-violet-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {cart.map((item: CartItem) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex items-center gap-4">
              {item.image ? (
                <img
                  src={`http://localhost:1337${item.image}`}
                  alt={item.title}
                  className="h-20 w-20 object-contain border rounded-md"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center border rounded-md text-gray-400">
                  No Image
                </div>
              )}
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-gray-500">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                −
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-violet-900">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => removeFromCart(item.id)}
              >
                <BiTrash size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-between items-center border-t pt-6">
        <h2 className="text-xl font-bold">
          Total: <span className="text-violet-900">${totalPrice.toFixed(2)}</span>
        </h2>
        <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">
          Checkout
        </button>
      </div>
    </div>
  );
}
