"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DownloadSimple, BookmarkSimple, CircleNotch } from "@phosphor-icons/react";

interface StickyNavProps {
  studentName: string;
  onSave: () => void;
  onDownloadPDF: () => Promise<void>;
}

export function StickyNav({ studentName, onSave, onDownloadPDF }: StickyNavProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      await onDownloadPDF();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-50 bg-cream backdrop-blur-xl border-b border-warm-gray/10">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-espresso/5 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={16} weight="bold" className="text-espresso" />
          </button>
          <p className="font-display text-espresso truncate text-sm font-semibold">
            {studentName}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 text-sm font-medium border border-espresso/20 text-espresso px-4 py-2 rounded-full hover:bg-espresso/5 transition-colors duration-200 disabled:opacity-50"
            aria-label="Download PDF"
          >
            {downloading ? (
              <CircleNotch size={15} weight="bold" className="animate-spin" />
            ) : (
              <DownloadSimple size={15} weight="bold" />
            )}
            {downloading ? "Generating..." : "Download PDF"}
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 text-sm font-medium bg-espresso text-cream px-4 py-2 rounded-full hover:bg-espresso/90 transition-colors duration-200"
            aria-label="Save report"
          >
            <BookmarkSimple size={15} weight="bold" />
            Save Report
          </button>
        </div>
      </div>
    </header>
  );
}
