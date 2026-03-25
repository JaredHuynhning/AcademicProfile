"use client";

interface CalloutProps {
  children: React.ReactNode;
  icon?: string;
  color?: string;
  title?: string;
}

export function Callout({ children, icon, color = "#8b7355", title }: CalloutProps) {
  return (
    <div
      className="rounded-xl bg-parchment/50 px-5 py-4 mb-4"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {(icon || title) && (
        <p className="text-xs font-semibold text-espresso mb-1.5">
          {icon && <span className="mr-1.5">{icon}</span>}
          {title}
        </p>
      )}
      <div className="text-sm text-espresso/75 leading-relaxed">{children}</div>
    </div>
  );
}
