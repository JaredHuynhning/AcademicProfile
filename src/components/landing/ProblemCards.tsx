"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const problems = [
  { icon: "🚀", frustration: "\"They're smart but won't study\"", reframe: "Their personality craves novelty — routine study methods bore them" },
  { icon: "📚", frustration: "\"Tutoring isn't helping\"", reframe: "The study method doesn't match their learning profile" },
  { icon: "😰", frustration: "\"They freeze during exams\"", reframe: "High emotionality drives test anxiety — it's not laziness" },
];

export function ProblemCards() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          The problem with grades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <motion.div key={p.icon} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }} viewport={{ once: true }}>
              <Card className="!p-6 h-full">
                <span className="text-2xl">{p.icon}</span>
                <p className="font-semibold text-espresso mt-3">{p.frustration}</p>
                <p className="text-sm text-warm-gray mt-2 leading-relaxed">{p.reframe}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
