import { CartProvider } from "../components/CartContext";
import CartNotification from "../components/CartNotification";
import Header from "../components/Header";
import "../styles/globals.css";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "NOVA — AI-Powered Shopping",
  description: "Shop smarter with an AI-powered assistant",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <div className="ambient-bg" />
        <div className="ambient-grid" />
        <CartProvider>
          <CartNotification />
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
