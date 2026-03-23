import { create } from "zustand";
import { sampleProfiles, SAMPLE_VERSION } from "../data/sample-profiles";
import type { SavedReport, TestResults } from "../types";
import { useQuizStore } from "./quiz-store";

const REPORTS_KEY = "hexaco_saved_reports";
const SAMPLE_VERSION_KEY = "hexaco_sample_version";

function loadReports(): SavedReport[] {
  if (typeof window === "undefined") return [...sampleProfiles];
  try {
    const stored = localStorage.getItem(REPORTS_KEY);
    const reports: SavedReport[] = stored ? JSON.parse(stored) : [];
    const storedVersion = parseInt(localStorage.getItem(SAMPLE_VERSION_KEY) || "0");

    const userReports = reports.filter((r) => !r.id.startsWith("sample-"));
    const existingSampleIds = new Set(
      reports.filter((r) => r.id.startsWith("sample-")).map((r) => r.id)
    );
    const needsUpdate =
      storedVersion < SAMPLE_VERSION ||
      sampleProfiles.length !== existingSampleIds.size ||
      sampleProfiles.some((s) => !existingSampleIds.has(s.id));

    if (needsUpdate) {
      const merged = [...userReports, ...sampleProfiles];
      localStorage.setItem(REPORTS_KEY, JSON.stringify(merged));
      localStorage.setItem(SAMPLE_VERSION_KEY, String(SAMPLE_VERSION));
      return merged;
    }
    return reports;
  } catch {
    return [...sampleProfiles];
  }
}

function persistReports(reports: SavedReport[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  }
}

interface ReportsState {
  reports: SavedReport[];
  saveReport: (name: string, results: TestResults) => void;
  loadReport: (report: SavedReport) => void;
  deleteReport: (id: string) => void;
}

export const useReportsStore = create<ReportsState>()((set, get) => ({
  reports: loadReports(),

  saveReport: (name, results) => {
    const entry: SavedReport = {
      id: crypto.randomUUID(),
      name,
      date: new Date().toISOString(),
      results,
    };
    const current = get().reports;
    try {
      const updated = [entry, ...current];
      persistReports(updated);
      set({ reports: updated });
    } catch (e) {
      if (e instanceof Error && e.name === "QuotaExceededError") {
        const trimmed = current
          .filter((r) => r.id.startsWith("sample-"))
          .concat(current.filter((r) => !r.id.startsWith("sample-")).slice(0, -1));
        const updated = [entry, ...trimmed];
        persistReports(updated);
        set({ reports: updated });
      }
    }
  },

  loadReport: (report) => {
    useQuizStore.getState().setResults(report.results);
    useQuizStore.getState().setName(report.name);
  },

  deleteReport: (id) => {
    const updated = get().reports.filter((r) => r.id !== id);
    persistReports(updated);
    set({ reports: updated });
  },
}));
