"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/", label: "Start Assessment" },
  { href: "/reports", label: "Reports" },
];

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 bg-cream/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 md:hidden"
        >
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href={link.href}
                onClick={onClose}
                className="font-display text-3xl font-bold text-espresso hover:text-warm-gray transition-colors"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
