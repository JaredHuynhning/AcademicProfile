"use client";

import { DownloadSimple, BookmarkSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";

interface StickyNavProps {
  studentName: string;
  onSave: () => void;
}

export function StickyNav({ studentName, onSave }: StickyNavProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur-xl border-b border-warm-gray/10">
      <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <p className="font-display text-espresso truncate text-sm font-semibold">
          {studentName}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-sm font-medium border border-espresso/20 text-espresso px-4 py-2 rounded-full hover:bg-espresso/5 transition-colors duration-200"
            aria-label="Download PDF"
          >
            <DownloadSimple size={15} weight="bold" />
            Download PDF
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
