"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { LikertScale } from "./LikertScale";
import type { LikertScore, QuizItem } from "@/lib/types";

interface QuizCardProps {
  item: QuizItem;
  currentAnswer: LikertScore | null;
  onAnswer: (value: LikertScore) => void;
  direction: "forward" | "back";
}

const variants = {
  enter: (direction: "forward" | "back") => ({
    x: direction === "forward" ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: "forward" | "back") => ({
    x: direction === "forward" ? -300 : 300,
    opacity: 0,
  }),
};

export function QuizCard({ item, currentAnswer, onAnswer, direction }: QuizCardProps) {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={item.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      >
        <Card className="min-h-[280px] flex flex-col gap-6">
          <p className="font-display text-xl font-semibold text-espresso leading-snug">
            {item.text}
          </p>
          <div className="mt-auto">
            <LikertScale value={currentAnswer} onClick={onAnswer} />
          </div>
          <p className="text-center text-warm-gray" style={{ fontSize: "10px" }}>
            Press 1–5 to answer · ← to go back
          </p>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
