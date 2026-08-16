import localFont from "next/font/local";

export const almarai = localFont({
  src: [
    { path: "./Almarai-Light.ttf", weight: "300", style: "normal" },
    { path: "./Almarai-Regular.ttf", weight: "400", style: "normal" },
    { path: "./Almarai-Bold.ttf", weight: "700", style: "normal" },
    { path: "./Almarai-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
