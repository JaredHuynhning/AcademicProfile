interface CardProps {
  children: React.ReactNode;
  className?: string;
  outerClassName?: string;
}

export function Card({ children, className = "", outerClassName = "" }: CardProps) {
  return (
    <div className={`bg-warm-gray/[0.03] p-1.5 rounded-[1.75rem] border border-warm-gray/[0.06] ${outerClassName}`}>
      <div className={`bg-white rounded-[calc(1.75rem-0.375rem)] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_8px_32px_rgba(139,115,85,0.06)] ${className}`}>
        {children}
      </div>
    </div>
  );
}
