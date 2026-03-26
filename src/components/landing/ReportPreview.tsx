"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const tabs = [
  { id: "cover", label: "Profile Cover", desc: "Personality archetype, radar chart, and dimension scores at a glance" },
  { id: "action", label: "Action Plan", desc: "\"What To Do Monday\" — numbered priorities, study prescription, and weekly rhythm" },
  { id: "personality", label: "Personality Deep Dive", desc: "Strengths, growth areas, and practical insights for each dimension" },
  { id: "guide", label: "Guide for Parents", desc: "Conversation starters, home study tips, and warning signs to watch for" },
];

export function ReportPreview() {
  const [active, setActive] = useState("cover");
  const current = tabs.find((t) => t.id === active) || tabs[0];

  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso text-center mb-10">
          See what&apos;s inside
        </h2>
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActive(tab.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active === tab.id ? "bg-espresso text-cream" : "bg-warm-gray/5 text-warm-gray hover:bg-warm-gray/10"}`}>
              {tab.label}
            </button>
          ))}
        </div>
        <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto">
          <div className="bg-warm-gray/5 rounded-2xl border border-warm-gray/10 overflow-hidden">
            <div className="h-[240px] md:h-[320px] flex items-center justify-center bg-warm-gray/[0.03]">
              <div className="text-center px-6">
                <p className="text-warm-gray/40 text-sm">Preview</p>
                <p className="text-warm-gray/60 text-lg font-semibold mt-1">{current.label}</p>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-warm-gray leading-relaxed">{current.desc}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
