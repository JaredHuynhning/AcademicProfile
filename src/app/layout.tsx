import { Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/Satoshi-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata = {
  title: "Academic Profile — Discover How You Learn",
  description: "Student personality and learning assessment for grades 7-12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${satoshi.variable}`}>
      <body className="bg-cream text-espresso font-body antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
