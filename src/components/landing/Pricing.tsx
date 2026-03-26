"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const freeFeatures = ["Personality archetype label", "Radar chart visualisation", "3 key personality insights"];

const fullFeatures = ["Everything in Free, plus:", "Complete personality deep dive (6 dimensions)", "Root cause analysis", "Personalised action plan", "Study prescription with weekly rhythm", "Guide for teachers, parents & tutors", "Downloadable PDF report"];

export function Pricing() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Card className="!p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray">Free Preview</p>
            <p className="font-display text-3xl font-bold text-espresso mt-2">$0</p>
            <ul className="mt-5 space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-warm-gray">
                  <span className="text-warm-gray/40 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/"><Button variant="secondary" className="w-full justify-center">Try Free Preview</Button></Link>
            </div>
          </Card>
          <Card className="!p-6 ring-2 ring-espresso/10">
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray">Full Report</p>
            <p className="font-display text-3xl font-bold text-espresso mt-2">$49</p>
            <ul className="mt-5 space-y-2.5">
              {fullFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-espresso">
                  <span className="text-espresso/40 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/"><Button variant="primary" icon className="w-full justify-center">Get the Full Report</Button></Link>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}
