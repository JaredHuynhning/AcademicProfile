"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { useReportsStore } from "@/lib/stores/reports-store";

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(8px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] },
  viewport: { once: true, margin: "-50px" },
};

const shake = {
  x: [0, -8, 8, -6, 6, -3, 3, 0],
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const router = useRouter();
  const { setName, setEmail, setDob, setMode, name, email, dob } = useQuizStore();
  const { reports, loadReport } = useReportsStore();
  const [inputName, setInputName] = useState(name);
  const [inputEmail, setInputEmail] = useState(email);
  const [inputDob, setInputDob] = useState(dob);
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; dob?: boolean }>({});
  const [shakeKey, setShakeKey] = useState(0);
  const validate = () => {
    const nameEmpty = !inputName.trim();
    const emailInvalid = !inputEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputEmail.trim());
    const dobEmpty = !inputDob;
    setErrors({ name: nameEmpty, email: emailInvalid, dob: dobEmpty });
    if (nameEmpty || emailInvalid || dobEmpty) {
      setShakeKey((k) => k + 1);
      return false;
    }
    return true;
  };

  const handleBegin = () => {
    if (!validate()) return;
    setName(inputName.trim());
    setEmail(inputEmail.trim());
    setDob(inputDob);
    setMode("complete");
    router.push("/test");
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-parchment rounded-2xl px-4 py-3 text-sm text-espresso placeholder:text-warm-gray/50 outline-none transition-all duration-200 ${
      hasError
        ? "ring-2 ring-red-400/60 placeholder:text-red-400/70"
        : "focus:ring-2 focus:ring-espresso/10"
    }`;

  return (
    <main className="min-h-[100dvh] pt-28 pb-20 px-4 max-w-5xl mx-auto">
      {/* Hero Card */}
      <motion.div {...fadeUp}>
        <Card outerClassName="mb-8" className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Badge>Student Assessment</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-3 leading-[1.1]">
                Your Learning Profile
              </h1>
              <p className="text-warm-gray mt-3 max-w-md leading-relaxed">
                Personalised report covering your personality,
                learning style, and academic strengths.
              </p>
            </div>
            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 ? shake : {}}
              className="flex flex-col gap-3 min-w-[280px]"
            >
              <input
                type="text"
                placeholder="Full name..."
                value={inputName}
                onChange={(e) => { setInputName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: false })); }}
                className={inputClass(errors.name)}
              />
              <input
                type="email"
                placeholder="Email address..."
                value={inputEmail}
                onChange={(e) => { setInputEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: false })); }}
                className={inputClass(errors.email)}
              />
              <input
                type="date"
                placeholder="Date of birth"
                value={inputDob}
                onChange={(e) => { setInputDob(e.target.value); if (errors.dob) setErrors((p) => ({ ...p, dob: false })); }}
                className={inputClass(errors.dob)}
              />
              {(errors.name || errors.email || errors.dob) && (
                <p className="text-xs text-red-400 -mt-1">Please fill in all fields to continue</p>
              )}
              <Button onClick={handleBegin} icon className="justify-center">
                Begin Assessment
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>

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
