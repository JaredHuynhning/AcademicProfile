"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const DIM_COLORS: Record<string, string> = { H: "#a67c52", E: "#8b5a5a", X: "#d4a574", A: "#7a8a5e", C: "#6b7a8f", O: "#9b6d9c" };

const dimensions = [
  { key: "H", label: "Honesty-Humility", desc: "How they handle rules, authority, and ethical decisions" },
  { key: "E", label: "Emotionality", desc: "Their stress response, anxiety patterns, and resilience" },
  { key: "X", label: "Extraversion", desc: "Social energy, classroom participation, and group dynamics" },
  { key: "A", label: "Agreeableness", desc: "Conflict style, teamwork, and response to feedback" },
  { key: "C", label: "Conscientiousness", desc: "Organisation, self-discipline, and study habits" },
  { key: "O", label: "Openness", desc: "Curiosity, creativity, and adaptability to new subjects" },
];

export function FeatureGrid() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-2">
          What you&apos;ll discover
        </h2>
        <p className="text-warm-gray text-center mb-10">Your student&apos;s complete learning DNA</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dimensions.map((d, i) => (
            <motion.div key={d.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.07 * i }} viewport={{ once: true }}>
              <Card className="!p-5 h-full">
                <p className="font-display text-3xl font-bold" style={{ color: DIM_COLORS[d.key] }}>{d.key}</p>
                <p className="font-semibold text-espresso text-sm mt-2">{d.label}</p>
                <p className="text-xs text-warm-gray mt-1 leading-relaxed">{d.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
