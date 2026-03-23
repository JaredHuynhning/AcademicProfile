import { describe, it, expect, beforeEach } from "vitest";
import { useQuizStore } from "@/lib/stores/quiz-store";

function getStore() {
  return useQuizStore.getState();
}

beforeEach(() => {
  useQuizStore.getState().reset();
  localStorage.clear();
});

describe("useQuizStore", () => {
  describe("initial state", () => {
    it("starts with empty name", () => {
      expect(getStore().name).toBe("");
    });

    it("starts with complete quiz mode", () => {
      expect(getStore().quizMode).toBe("complete");
    });

    it("starts with no answers", () => {
      expect(getStore().answers).toEqual({});
    });

    it("starts at index 0", () => {
      expect(getStore().currentIndex).toBe(0);
    });

    it("starts with null results", () => {
      expect(getStore().results).toBeNull();
    });

    it("starts with zero progress", () => {
      expect(getStore().progress).toEqual({ answered: 0, total: 0, percent: 0 });
    });
  });

  describe("setName", () => {
    it("records the student name", () => {
      getStore().setName("Alice");
      expect(getStore().name).toBe("Alice");
    });
  });

  describe("setMode", () => {
    it("updates quiz mode", () => {
      getStore().setMode("personality");
      expect(getStore().quizMode).toBe("personality");
    });
  });

  describe("setItems", () => {
    it("stores quiz items", () => {
      const items = [{ id: 1, text: "Q1", domain: "H", subscale: "s", reverse: false }];
      getStore().setItems(items);
      expect(getStore().items).toEqual(items);
    });
  });

  describe("setAnswer", () => {
    it("records an answer", () => {
      getStore().setAnswer(5, 3);
      expect(getStore().answers[5]).toBe(3);
    });

    it("accumulates multiple answers", () => {
      getStore().setAnswer(1, 2);
      getStore().setAnswer(2, 4);
      expect(getStore().answers).toEqual({ 1: 2, 2: 4 });
    });

    it("tracks progress answered count", () => {
      getStore().setAnswer(1, 3);
      getStore().setAnswer(2, 5);
      expect(getStore().progress.answered).toBe(2);
    });

    it("calculates percent based on items length when set", () => {
      const items = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        text: `Q${i + 1}`,
        domain: "H",
        subscale: "s",
        reverse: false,
      }));
      getStore().setItems(items);
      getStore().setAnswer(1, 3);
      getStore().setAnswer(2, 4);
      expect(getStore().progress.percent).toBeCloseTo(50);
    });

    it("uses 120 as total when no items loaded", () => {
      getStore().setAnswer(1, 3);
      expect(getStore().progress.total).toBe(120);
    });
  });

  describe("setIndex", () => {
    it("updates current index", () => {
      getStore().setIndex(7);
      expect(getStore().currentIndex).toBe(7);
    });
  });

  describe("setResults", () => {
    it("stores test results", () => {
      const results = { quizMode: "complete" as const };
      getStore().setResults(results);
      expect(getStore().results).toEqual(results);
    });
  });

  describe("reset", () => {
    it("clears answers", () => {
      getStore().setAnswer(1, 3);
      getStore().reset();
      expect(getStore().answers).toEqual({});
    });

    it("clears name", () => {
      getStore().setName("Bob");
      getStore().reset();
      expect(getStore().name).toBe("");
    });

    it("clears results", () => {
      getStore().setResults({ quizMode: "complete" });
      getStore().reset();
      expect(getStore().results).toBeNull();
    });

    it("resets index to 0", () => {
      getStore().setIndex(10);
      getStore().reset();
      expect(getStore().currentIndex).toBe(0);
    });

    it("resets progress to zero", () => {
      getStore().setAnswer(1, 3);
      getStore().reset();
      expect(getStore().progress).toEqual({ answered: 0, total: 0, percent: 0 });
    });
  });

  describe("localStorage persistence", () => {
    it("writes answers to localStorage after setAnswer", () => {
      getStore().setAnswer(42, 5);
      const stored = localStorage.getItem("hexaco_quiz_state");
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.state.answers[42]).toBe(5);
    });

    it("writes name to localStorage after setName", () => {
      getStore().setName("Persisted");
      const stored = JSON.parse(localStorage.getItem("hexaco_quiz_state")!);
      expect(stored.state.name).toBe("Persisted");
    });

    it("does not persist items or currentIndex", () => {
      getStore().setItems([{ id: 1, text: "Q", domain: "H", subscale: "s", reverse: false }]);
      getStore().setIndex(3);
      const stored = JSON.parse(localStorage.getItem("hexaco_quiz_state")!);
      expect(stored.state.items).toBeUndefined();
      expect(stored.state.currentIndex).toBeUndefined();
    });
  });
});
