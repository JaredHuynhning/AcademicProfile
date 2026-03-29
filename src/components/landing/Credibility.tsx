"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const dimensions = [
  { letter: "H", name: "Honesty-Humility", color: "#14b8a6", parent: "How fair and sincere your child is. Do they play by the rules? Do they value integrity over shortcuts?" },
  { letter: "E", name: "Emotionality", color: "#f43f5e", parent: "How deeply they feel things. High emotionality means they may need more reassurance before exams. Low means they handle pressure independently." },
  { letter: "X", name: "Extraversion", color: "#f97316", parent: "How they recharge. Extraverts thrive in group study; introverts need quiet focus time. Neither is better for grades." },
  { letter: "A", name: "Agreeableness", color: "#22c55e", parent: "How they handle conflict and collaboration. Agreeable students are great team players but may struggle to speak up when they need help." },
  { letter: "C", name: "Conscientiousness", color: "#3b82f6", parent: "How organised and disciplined they are. The strongest single predictor of academic performance across all research." },
  { letter: "O", name: "Openness", color: "#8b5cf6", parent: "How curious and creative they are. High openness students love exploring ideas but may resist routine revision." },
];

export function Credibility() {
  return (
    <section className="py-16">
      <motion.div {...fadeUp}>
        <div className="max-w-[65ch] mx-auto text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-warm-gray mb-3">
            Research-Backed
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-espresso mb-4">
            Built on science, not guesswork
          </h2>
          <p className="text-warm-gray leading-relaxed">
            This assessment uses the HEXACO Personality Inventory — the next generation of personality science. Developed by psychologists Kibeom Lee and Michael Ashton, it measures six dimensions that together explain why your child learns, studies, and responds to school the way they do.
          </p>
          <p className="text-warm-gray/70 text-sm mt-3 leading-relaxed">
            Combined with validated instruments including the Grit Scale, Study Process Questionnaire, and academic motivation assessments. Built by educators who understand how personality connects to academic performance.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="font-display text-lg font-bold text-espresso text-center mb-6">
            The six dimensions we measure
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dimensions.map((d) => (
              <Card key={d.letter} className="!p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: d.color }}
                  >
                    {d.letter}
                  </span>
                  <p className="text-sm font-semibold text-espresso">{d.name}</p>
                </div>
                <p className="text-xs text-warm-gray leading-relaxed">{d.parent}</p>
              </Card>
            ))}
          </div>
        </div>

        <p className="text-warm-gray/50 text-xs italic mt-8 text-center max-w-[65ch] mx-auto">
          Lee, K., &amp; Ashton, M. C. (2018). Psychometric properties of the HEXACO-100. Assessment, 25(5), 543-556.
        </p>
      </motion.div>
    </section>
  );
}
