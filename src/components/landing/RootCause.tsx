"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const patterns = [
  { icon: "🚀", name: "Energy Without Direction", desc: "High openness and extraversion without the structure to channel it" },
  { icon: "🪞", name: "Perfectionism Paralysis", desc: "High conscientiousness creating analysis paralysis and avoidance" },
  { icon: "🔥", name: "Burnout Risk", desc: "Over-extending across commitments with no energy recovery system" },
];

export function RootCause() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-4">
          What if you could see the root cause?
        </h2>
        <p className="text-warm-gray text-center max-w-[65ch] mx-auto leading-relaxed mb-10">
          Most academic interventions treat symptoms — extra tutoring, stricter schedules, more practice exams. But when the real issue is a personality trait driving the behaviour, those interventions miss the mark. Our assessment finds the root cause by connecting who your student is with how they learn.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patterns.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 * i }} viewport={{ once: true }}>
              <Card className="!p-5 h-full">
                <span className="text-2xl">{p.icon}</span>
                <p className="font-semibold text-espresso mt-2">{p.name}</p>
                <p className="text-sm text-warm-gray mt-1.5 leading-relaxed">{p.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
