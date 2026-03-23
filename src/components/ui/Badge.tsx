interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = "" }: BadgeProps) {
  const style = color ? { color, backgroundColor: `${color}15` } : {};
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium ${!color ? "text-warm-gray bg-warm-gray/[0.06]" : ""} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
