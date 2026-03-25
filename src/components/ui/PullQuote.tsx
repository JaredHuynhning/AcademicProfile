"use client";

interface PullQuoteProps {
  children: React.ReactNode;
}

export function PullQuote({ children }: PullQuoteProps) {
  return (
    <blockquote className="border-l-2 border-espresso/20 pl-5 py-2 my-6">
      <p className="font-display text-lg text-espresso/70 italic leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}
