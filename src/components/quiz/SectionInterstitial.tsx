"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";

interface SectionInterstitialProps {
  sectionName: string;
  questionCount: number;
  accentColor?: string;
  visible: boolean;
  onComplete: () => void;
}

export function SectionInterstitial({
  sectionName,
  questionCount,
  accentColor,
  visible,
  onComplete,
}: SectionInterstitialProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col items-center justify-center gap-4 py-16"
        >
          <Badge color={accentColor}>{sectionName}</Badge>
          <p className="text-warm-gray text-sm">{questionCount} questions</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
