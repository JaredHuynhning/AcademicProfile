"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Brain, ChartBar } from "@phosphor-icons/react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";
import type { QuizMode } from "@/lib/types";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const assessmentModes: { icon: typeof Brain; title: string; desc: string; color: string; domain: string; mode: QuizMode; time: string }[] = [
  { icon: Brain, title: "Personality Profile", desc: "6 dimensions of who you are", color: "#8b5cf6", domain: "HEXACO-PI-R", mode: "personality", time: "~10 min" },
  { icon: GraduationCap, title: "Learning Assessment", desc: "Grit, focus, energy & study style", color: "#22c55e", domain: "Grit-S, ASRS, SVS + Study Approaches", mode: "learning", time: "~10 min" },
  { icon: ChartBar, title: "Complete Assessment", desc: "Full personality + learning profile", color: "#f43f5e", domain: "All 120 questions, cross-referenced", mode: "complete", time: "~20 min" },
];

export default function HomePage() {
  const router = useRouter();
  const { setName, setMode, name } = useQuizStore();
  const { reports, loadReport } = useReportsStore();
  const [inputName, setInputName] = useState(name);

  const handleStart = (mode: QuizMode = "complete") => {
    if (!inputName.trim()) return;
    setName(inputName.trim());
    setMode(mode);
    router.push("/test");
  };

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 px-4 max-w-5xl mx-auto">
      {/* Hero Card */}
      <motion.div {...fadeUp}>
        <Card outerClassName="mb-8" className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge>20-Minute Assessment</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3 leading-[1.1]">
                Your Learning Profile
              </h1>
              <p className="text-warm-gray mt-3 max-w-md leading-relaxed">
                120 questions. Personalised report covering your personality,
                learning style, and academic strengths.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-w-[260px]">
              <input
                type="text"
                placeholder="Enter your first name..."
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full bg-parchment rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-warm-gray/50 outline-none focus:ring-2 focus:ring-espresso/10 transition-shadow"
              />
              <Button onClick={handleStart} icon className="justify-center">
                Begin Assessment
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Assessment Modes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessmentModes.map((area, i) => (
          <motion.div key={area.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 * (i + 1) }}>
            <button onClick={() => handleStart(area.mode)} className="w-full text-left">
              <Card
                className="p-5 cursor-pointer hover:shadow-lg transition-shadow"
                outerClassName="hover:scale-[1.01] transition-transform duration-500"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${area.color}15`, color: area.color }}
                  >
                    <area.icon size={22} weight="duotone" />
                  </div>
                  <Badge color={area.color}>{area.time}</Badge>
                </div>
                <h3 className="font-semibold text-espresso">{area.title}</h3>
                <p className="text-sm text-warm-gray mt-1">{area.desc}</p>
                <p className="text-[10px] text-warm-gray/60 mt-2 uppercase tracking-wider">{area.domain}</p>
              </Card>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Saved Reports */}
      {reports.length > 0 && (
        <motion.section {...fadeUp} className="mt-12">
          <Badge className="mb-3">Previous Results</Badge>
          <h2 className="font-display text-2xl font-bold mb-4">Saved Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.slice(0, 4).map((r) => (
              <button
                key={r.id}
                onClick={() => { loadReport(r); router.push("/report"); }}
                className="w-full text-left"
              >
                <Card
                  className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                  outerClassName="hover:scale-[1.01] transition-transform duration-500"
                >
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-warm-gray" suppressHydrationWarning>{new Date(r.date).toLocaleDateString()}</p>
                </Card>
              </button>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  );
}
