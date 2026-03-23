"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "@phosphor-icons/react";

interface TOCItem {
  id: string;
  title: string;
}

interface FloatingTOCProps {
  items: TOCItem[];
}

export function FloatingTOC({ items }: FloatingTOCProps) {
  const [open, setOpen] = useState(false);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setOpen(false);
  }

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-cream/95 backdrop-blur-xl border border-warm-gray/15 rounded-2xl shadow-lg overflow-hidden"
          >
            <p className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-[0.2em] text-warm-gray font-medium">
              Contents
            </p>
            <ul className="pb-2 max-h-[60vh] overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="w-full text-left px-4 py-1.5 text-sm text-espresso hover:bg-warm-gray/[0.06] transition-colors duration-150 whitespace-nowrap"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close table of contents" : "Open table of contents"}
        className="w-12 h-12 rounded-full bg-espresso text-cream flex items-center justify-center shadow-lg hover:bg-espresso/90 transition-colors duration-200"
      >
        {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
      </button>
    </div>
  );
}
