"use client";

import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

export function Guarantee() {
  return (
    <section className="py-12">
      <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
        <div className="bg-warm-gray/[0.04] border border-warm-gray/10 rounded-2xl p-8">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">
            Our Promise
          </p>
          <h3 className="font-display text-xl md:text-2xl font-bold text-espresso mb-4">
            100% Money-Back Guarantee
          </h3>
          <p className="text-warm-gray leading-relaxed">
            If the full report does not give you at least one insight about your student that you did not already know, we will refund your $49 in full. No questions asked, no time limit. We are that confident in the depth of this assessment.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
