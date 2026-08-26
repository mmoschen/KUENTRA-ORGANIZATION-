import type { Metadata, Viewport } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const displayFont = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://kuentra.com.ar"),
  title: { default: "Kuentra | Servicios digitales más simples", template: "%s | Kuentra" },
  description: "Accedé a ChatGPT, Gemini, CapCut, Canva y más servicios digitales con activación rápida y soporte real en Argentina.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Kuentra | Tus servicios digitales, más simples",
    description: "Herramientas digitales para estudiar, crear y trabajar. En un solo lugar.",
    url: "/",
    siteName: "Kuentra",
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Kuentra | Servicios digitales", description: "Todo lo que usás. En un solo lugar." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071B2E" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className="scroll-smooth"><body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body></html>;
}
