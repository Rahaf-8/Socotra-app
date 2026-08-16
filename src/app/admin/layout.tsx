import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { almarai } from "@/fonts/almarai";

import "../globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], display: "swap" });
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: ["500", "600"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Administrator", template: "%s | Tour Socotra Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" dir="ltr" className={`${manrope.variable} ${cormorant.variable} ${almarai.variable} h-full antialiased`}><body className="min-h-full bg-soft-sand">{children}</body></html>;
}
