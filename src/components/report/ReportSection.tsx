"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface ReportSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isFirst?: boolean;
  keyTakeaway?: string;
  sectionNumber?: number;
}

export function ReportSection({
  id,
  title,
  children,
  isFirst = false,
  keyTakeaway,
  sectionNumber,
}: ReportSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section id={id} className={`py-14 ${!isFirst ? "border-t border-warm-gray/10" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Section header */}
        <div className="flex items-start gap-4 mb-6">
          {sectionNumber != null && (
            <span className="text-[10px] font-mono text-warm-gray/40 tracking-widest mt-2">
              {String(sectionNumber).padStart(2, "0")}
            </span>
          )}
          <div className="flex-1">
            <h2 className="font-display text-2xl font-bold text-espresso">{title}</h2>
            {keyTakeaway && (
              <div className="mt-3 p-3 rounded-lg bg-espresso/[0.03] border border-warm-gray/8">
                <p className="text-xs font-medium text-espresso/60 uppercase tracking-widest mb-1">Key Takeaway</p>
                <p className="text-sm text-espresso/80 leading-relaxed">{keyTakeaway}</p>
              </div>
            )}
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 p-1.5 rounded-md hover:bg-warm-gray/5 transition-colors text-warm-gray/40 hover:text-warm-gray/60"
            aria-label={expanded ? "Collapse section" : "Expand section"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`transition-transform duration-200 ${expanded ? "" : "-rotate-90"}`}>
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Collapsible content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <div className="max-w-[65ch]">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
