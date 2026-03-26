"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function Credibility() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp} className="max-w-[65ch] mx-auto text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso mb-4">
          Built on science, not guesswork
        </h2>
        <p className="text-warm-gray leading-relaxed">
          The HEXACO Personality Inventory (HEXACO-PI-R) is a peer-reviewed assessment framework developed by psychologists Kibeom Lee and Michael Ashton. It&apos;s used by researchers and universities worldwide to measure six fundamental personality dimensions.
        </p>
        <p className="text-warm-gray/60 text-sm italic mt-4">
          Lee, K., &amp; Ashton, M. C. (2018). Psychometric properties of the HEXACO-100. Assessment, 25(5), 543–556.
        </p>
        <p className="text-warm-gray text-sm mt-4 leading-relaxed">
          Combined with validated academic assessment instruments including the Grit Scale (Duckworth, 2007), ASRS attention screening, and Study Process Questionnaire.
        </p>
      </motion.div>
    </section>
  );
}
