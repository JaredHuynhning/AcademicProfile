"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReportsStore } from "@/lib/stores/reports-store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SavedReport } from "@/lib/types";

const MODE_LABELS: Record<string, string> = {
  complete: "Complete",
  personality: "Personality",
  learning: "Learning",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ReportsPage() {
  const router = useRouter();
  const { reports, loadReport, deleteReport } = useReportsStore();

  function handleOpen(report: SavedReport) {
    loadReport(report);
    router.push("/report");
  }

  function handleDelete(e: React.MouseEvent, id: string, name: string) {
    e.stopPropagation();
    if (window.confirm(`Delete the report for "${name}"? This cannot be undone.`)) {
      deleteReport(id);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4">Your Assessments</Badge>
          <h1 className="font-display text-4xl md:text-5xl text-espresso">
            Saved Reports
          </h1>
        </div>

        {reports.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-24"
          >
            <p className="text-warm-gray text-lg mb-6">
              No saved reports yet. Take the assessment to get started.
            </p>
            <Link href="/test">
              <Button variant="primary" icon>
                Take the Assessment
              </Button>
            </Link>
          </motion.div>
        ) : (
          /* Report grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((report, i) => {
              const mode = report.results.quizMode ?? "complete";
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                >
                  <Card
                    outerClassName="cursor-pointer group hover:shadow-md transition-shadow duration-300"
                    className="relative flex flex-col gap-3 h-full"
                  >
                    {/* Clickable overlay */}
                    <button
                      aria-label={`Open report for ${report.name}`}
                      onClick={() => handleOpen(report)}
                      className="absolute inset-0 rounded-[calc(1.75rem-0.375rem)] focus:outline-none focus-visible:ring-2 focus-visible:ring-espresso/40"
                    />

                    {/* Mode badge */}
                    <Badge className="self-start relative z-10">
                      {MODE_LABELS[mode] ?? mode}
                    </Badge>

                    {/* Student name */}
                    <p className="font-display text-xl text-espresso leading-snug relative z-10">
                      {report.name}
                    </p>

                    {/* Date */}
                    <p className="text-sm text-warm-gray relative z-10">
                      {formatDate(report.date)}
                    </p>

                    {/* Delete button */}
                    <div className="mt-auto pt-4 relative z-10">
                      <button
                        onClick={(e) => handleDelete(e, report.id, report.name)}
                        className="text-xs text-warm-gray/60 hover:text-red-500 transition-colors duration-200 underline underline-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
