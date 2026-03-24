"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface ReportSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

export function ReportSection({
  id,
  title,
  children,
  isFirst = false,
}: ReportSectionProps) {
  return (
    <section id={id} className={`py-14 ${!isFirst ? "border-t border-warm-gray/10" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h2 className="font-display text-2xl font-bold text-espresso mb-8">{title}</h2>
        <div className="max-w-[65ch]">{children}</div>
      </motion.div>
    </section>
  );
}
