import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answers, QuizItem, QuizMode, TestResults, LikertScore } from "../types";

interface QuizState {
  name: string;
  quizMode: QuizMode;
  items: QuizItem[];
  answers: Answers;
  currentIndex: number;
  results: TestResults | null;
  progress: { answered: number; total: number; percent: number };
  setName: (name: string) => void;
  setMode: (mode: QuizMode) => void;
  setItems: (items: QuizItem[]) => void;
  setAnswer: (itemId: number, value: LikertScore) => void;
  setIndex: (index: number) => void;
  setResults: (results: TestResults) => void;
  reset: () => void;
}

const initialState = {
  name: "",
  quizMode: "complete" as QuizMode,
  items: [] as QuizItem[],
  answers: {} as Answers,
  currentIndex: 0,
  results: null as TestResults | null,
  progress: { answered: 0, total: 0, percent: 0 },
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setName: (name) => set({ name }),
      setMode: (mode) => set({ quizMode: mode }),
      setItems: (items) => set({ items }),
      setAnswer: (itemId, value) => {
        const answers = { ...get().answers, [itemId]: value };
        const total = get().items.length || 120;
        const answered = Object.keys(answers).length;
        set({ answers, progress: { answered, total, percent: (answered / total) * 100 } });
      },
      setIndex: (index) => set({ currentIndex: index }),
      setResults: (results) => set({ results }),
      reset: () => set(initialState),
    }),
    {
      name: "hexaco_quiz_state",
      partialize: (state) => ({
        answers: state.answers,
        name: state.name,
        quizMode: state.quizMode,
        results: state.results,
      }),
    }
  )
);
