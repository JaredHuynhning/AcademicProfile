"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/stores/quiz-store";
import { hexacoItems } from "@/lib/data/hexaco-items";
import { studyItems } from "@/lib/data/study-items";
import { learnerItems } from "@/lib/data/learner-items";
import { scoreHexaco } from "@/lib/scoring/hexaco-scorer";
import { scoreStudyProfile } from "@/lib/scoring/study-scorer";
import { scoreLearnerProfile } from "@/lib/scoring/learner-scorer";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { QuizCard } from "./QuizCard";
import { SectionInterstitial } from "./SectionInterstitial";
import type { LikertScore, QuizItem } from "@/lib/types";

const DOMAIN_LABELS: Record<string, string> = {
  H: "Honesty-Humility",
  E: "Emotionality",
  X: "Extraversion",
  A: "Agreeableness",
  C: "Conscientiousness",
  O: "Openness",
  studyApproaches: "Study Approaches",
  motivation: "Motivation",
  selfRegulation: "Self-Regulation",
  grit: "Grit & Resilience",
  focus: "Focus & Procrastination",
  energy: "Energy & Stamina",
  subjectFit: "Subject Passion",
  teacherPreference: "Teacher Preference",
  examBarriers: "Exam Barriers",
};

const DOMAIN_COLORS: Record<string, string> = {
  H: "#14b8a6",
  E: "#f43f5e",
  X: "#f97316",
  A: "#22c55e",
  C: "#3b82f6",
  O: "#8b5cf6",
  studyApproaches: "#0ea5e9",
  motivation: "#f59e0b",
  selfRegulation: "#10b981",
  grit: "#ef4444",
  focus: "#6366f1",
  energy: "#84cc16",
  subjectFit: "#f97316",
  teacherPreference: "#ec4899",
  examBarriers: "#8b5cf6",
};

function getDomainItemCount(items: QuizItem[], domain: string): number {
  return items.filter((i) => i.domain === domain).length;
}

export function QuizShell() {
  const router = useRouter();
  const {
    quizMode,
    items,
    answers,
    currentIndex,
    setItems,
    setAnswer,
    setIndex,
    setResults,
  } = useQuizStore();

  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [interstitial, setInterstitial] = useState<{
    visible: boolean;
    domain: string;
    count: number;
  }>({ visible: false, domain: "", count: 0 });

  useEffect(() => {
    let loadedItems: QuizItem[] = [];
    if (quizMode === "complete") {
      loadedItems = [...hexacoItems, ...studyItems, ...learnerItems];
    } else if (quizMode === "personality") {
      loadedItems = [...hexacoItems];
    } else {
      loadedItems = [...studyItems, ...learnerItems];
    }
    setItems(loadedItems);
    setIndex(0);
  }, [quizMode, setItems, setIndex]);

  const currentItem = items[currentIndex] ?? null;

  const handleAnswer = useCallback(
    (value: LikertScore) => {
      if (!currentItem) return;
      setAnswer(currentItem.id, value);

      const nextIndex = currentIndex + 1;
      if (nextIndex >= items.length) {
        finishQuiz();
        return;
      }

      const nextItem = items[nextIndex];
      const domainChanged = nextItem.domain !== currentItem.domain;

      setDirection("forward");

      if (domainChanged) {
        const count = getDomainItemCount(items, nextItem.domain);
        setInterstitial({ visible: true, domain: nextItem.domain, count });
      } else {
        setIndex(nextIndex);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentItem, currentIndex, items, setAnswer, setIndex]
  );

  const handleInterstitialComplete = useCallback(() => {
    setInterstitial((prev) => ({ ...prev, visible: false }));
    setIndex(currentIndex + 1);
  }, [currentIndex, setIndex]);

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection("back");
    setIndex(currentIndex - 1);
  }, [currentIndex, setIndex]);

  const finishQuiz = useCallback(() => {
    const results: import("@/lib/types").TestResults = {
      quizMode,
    };

    if (quizMode === "complete" || quizMode === "personality") {
      const hexacoResult = scoreHexaco(answers);
      results.dimensions = hexacoResult.dimensions;
    }

    if (quizMode === "complete" || quizMode === "learning") {
      results.studyProfile = scoreStudyProfile(answers);
      results.learnerProfile = scoreLearnerProfile(answers);
    }

    if (quizMode === "complete" || quizMode === "personality") {
      fetch("/api/hexaco/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      }).catch(() => {});
    }

    setResults(results);
    router.push("/report");
  }, [quizMode, answers, setResults, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (interstitial.visible) return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) {
        handleAnswer(n as LikertScore);
      } else if (e.key === "ArrowLeft") {
        handleBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleAnswer, handleBack, interstitial.visible]);

  const total = items.length;
  const answered = Object.keys(answers).length;
  const percent = total > 0 ? (answered / total) * 100 : 0;
  const minutesLeft = Math.ceil(((total - answered) * 8) / 60);

  if (!currentItem && !interstitial.visible) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-warm-gray text-sm">Loading questions…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs text-warm-gray">
            <span>
              {answered} / {total}
            </span>
            <span>~{minutesLeft} min left</span>
          </div>
          <ProgressBar value={percent} />
        </div>

        {interstitial.visible ? (
          <SectionInterstitial
            sectionName={DOMAIN_LABELS[interstitial.domain] ?? interstitial.domain}
            questionCount={interstitial.count}
            accentColor={DOMAIN_COLORS[interstitial.domain]}
            visible={interstitial.visible}
            onComplete={handleInterstitialComplete}
          />
        ) : (
          currentItem && (
            <QuizCard
              item={currentItem}
              currentAnswer={answers[currentItem.id] ?? null}
              onAnswer={handleAnswer}
              direction={direction}
            />
          )
        )}
      </div>
    </div>
  );
}
