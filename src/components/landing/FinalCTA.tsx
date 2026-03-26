"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function FinalCTA() {
  return (
    <section className="py-24 text-center">
      <motion.div {...fadeUp} className="max-w-[640px] mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-espresso">
          Ready to understand your student?
        </h2>
        <p className="text-warm-gray mt-3 text-lg leading-relaxed">
          It takes 20 minutes and could change how they learn forever.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" icon>
              Start the Assessment
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
