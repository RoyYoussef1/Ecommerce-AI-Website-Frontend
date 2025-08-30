import { CartProvider } from "../components/CartContext";
import CartNotification from "../components/CartNotification";
import Header from "../components/Header";
import "../styles/globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
<html lang="en">
      <body className="bg-gray-50">
        <CartProvider>
          <CartNotification />
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
