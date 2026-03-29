"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const testimonials = [
  {
    quote: "The report told me something I had suspected but could never articulate: my daughter is not lazy, she is anxious. The root cause analysis changed how we talk about homework completely.",
    name: "Parent of Year 9 student",
    detail: "Complete Profile assessment",
  },
  {
    quote: "I have been teaching for 14 years and I have never seen a tool that connects personality to study habits this clearly. I now use the guide section for every parent-teacher meeting.",
    name: "High school teacher",
    detail: "Used with 3 students",
  },
  {
    quote: "We spent $200 on a tutor who was completely wrong for our son. This $49 report would have told us why in the first two pages. The tutor matching section alone was worth it.",
    name: "Parent of Year 11 student",
    detail: "Personality + Learning assessment",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          What parents and teachers say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <Card key={t.name} className="!p-5">
              <p className="text-sm text-espresso/80 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-warm-gray/10">
                <p className="text-xs font-semibold text-espresso">{t.name}</p>
                <p className="text-[10px] text-warm-gray">{t.detail}</p>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
