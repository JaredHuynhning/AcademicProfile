"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide navbar on report page (it has its own StickyNav)
  if (pathname === "/report") return null;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-6 px-4 pointer-events-none no-print">
        <div className="pointer-events-auto bg-cream/85 backdrop-blur-xl border border-warm-gray/[0.08] rounded-full px-6 py-3 flex items-center gap-6 shadow-[0_4px_24px_rgba(139,115,85,0.06)] transition-shadow duration-500">
          <Link href="/" className="font-display text-lg font-bold tracking-tight">
            AcademicProfile
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm text-warm-gray">
            <Link href="/" className="hover:text-espresso transition-colors">Start</Link>
            <Link href="/reports" className="hover:text-espresso transition-colors">Reports</Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
