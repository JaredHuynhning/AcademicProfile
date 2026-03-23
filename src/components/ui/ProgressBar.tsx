interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
}

export function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={`h-1 bg-warm-gray/[0.08] rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-espresso to-warm-gray rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
