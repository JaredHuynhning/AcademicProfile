"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Trophy } from "@phosphor-icons/react";

export interface QuickWin {
  id: string;
  text: string;
  completed: boolean;
}

interface QuickWinsChecklistProps {
  wins: QuickWin[];
  studentName: string;
}

export function QuickWinsChecklist({ wins: initialWins, studentName }: QuickWinsChecklistProps) {
  const [wins, setWins] = useState<QuickWin[]>(initialWins);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Load completion state from local storage if needed
    const saved = localStorage.getItem(`quick-wins-${studentName}`);
    if (saved) {
      try {
        const completedIds = JSON.parse(saved);
        setWins(prev => prev.map(w => ({ ...w, completed: completedIds.includes(w.id) })));
      } catch (e) {
        console.error("Failed to load quick wins state", e);
      }
    }
  }, [studentName]);

  const toggleWin = (id: string) => {
    const nextWins = wins.map(w => w.id === id ? { ...w, completed: !w.completed } : w);
    setWins(nextWins);
    
    // Save to local storage
    const completedIds = nextWins.filter(w => w.completed).map(w => w.id);
    localStorage.setItem(`quick-wins-${studentName}`, JSON.stringify(completedIds));

    // Show celebration if all completed
    if (nextWins.every(w => w.completed)) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const completedCount = wins.filter(w => w.completed).length;
  const progress = (completedCount / wins.length) * 100;

  return (
    <Card className="!p-6 mb-12 border-none bg-indigo-50/30 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-indigo-600 mb-1">Interactive Roadmap</p>
            <h2 className="font-display text-2xl font-bold text-espresso">Your Quick Wins</h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-indigo-600 mb-1">{completedCount} of {wins.length} complete</p>
            <div className="w-24 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {wins.map((win) => (
            <button
              key={win.id}
              onClick={() => toggleWin(win.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left ${
                win.completed ? "bg-white/80 opacity-60" : "bg-white shadow-sm hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              <div className="shrink-0">
                {win.completed ? (
                  <CheckCircle size={24} weight="fill" className="text-indigo-600" />
                ) : (
                  <Circle size={24} className="text-indigo-300" />
                )}
              </div>
              <p className={`text-sm font-medium ${win.completed ? "text-espresso/50 line-through" : "text-espresso"}`}>
                {win.text}
              </p>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="absolute inset-0 flex items-center justify-center bg-indigo-600/90 text-white z-20 rounded-2xl"
            >
              <div className="text-center">
                <Trophy size={48} weight="bold" className="mx-auto mb-2 animate-bounce" />
                <h3 className="text-xl font-bold italic">All Wins Complete!</h3>
                <p className="text-sm opacity-90">You're building the habit muscle, {studentName.split(' ')[0]}!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Decorative bg element */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-200/20 rounded-full blur-3xl" />
    </Card>
  );
}
