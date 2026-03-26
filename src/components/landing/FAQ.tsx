"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const faqs = [
  { q: "Is this scientifically valid?", a: "Yes. The HEXACO-PI-R is a peer-reviewed personality framework published in Assessment, Journal of Personality, and other academic journals. It has been validated across cultures and age groups." },
  { q: "How long does the assessment take?", a: "The complete assessment is 120 questions and takes about 20 minutes. A personality-only version (60 questions, ~10 minutes) is also available." },
  { q: "Is my child's data safe?", a: "All responses are processed in-browser. No data is sent to external servers. Reports are generated locally and can be downloaded as PDF." },
  { q: "Who created this?", a: "Built by Eyes of AI, combining validated psychometric instruments with modern data analysis to produce personalised, actionable learning profiles." },
  { q: "Can I see a sample before paying?", a: "Yes. Every assessment includes a free preview with your student's personality archetype, radar chart, and 3 key insights. You only pay if you want the full report." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-warm-gray/10 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="w-full text-left py-4 flex items-center justify-between gap-4">
        <span className="font-semibold text-espresso">{q}</span>
        <span className="text-warm-gray text-xl shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }} className="pb-4">
          <p className="text-sm text-warm-gray leading-relaxed">{a}</p>
        </motion.div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp} className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">Frequently asked questions</h2>
        <div>
          {faqs.map((faq) => (<FAQItem key={faq.q} q={faq.q} a={faq.a} />))}
        </div>
      </motion.div>
    </section>
  );
}
