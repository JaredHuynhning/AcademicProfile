"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function Hero() {
  return (
    <section className="py-24 md:py-32 text-center">
      <motion.div {...fadeUp} className="max-w-[640px] mx-auto">
        <Badge>Academic Profile Assessment</Badge>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-4 leading-[1.1] text-espresso">
          Grades don&apos;t tell the full story
        </h1>
        <p className="text-warm-gray mt-4 text-lg leading-relaxed">
          Discover the personality traits and learning patterns behind your
          student&apos;s academic performance — backed by peer-reviewed psychology.
        </p>
        <div className="mt-8">
          <Link href="/">
            <Button variant="primary" icon>
              Get Your Student&apos;s Profile
            </Button>
          </Link>
        </div>
        <p className="text-xs text-warm-gray/60 mt-3">
          Free preview available · Full report $49
        </p>
      </motion.div>
    </section>
  );
}
