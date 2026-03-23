import { ArrowRight } from "@phosphor-icons/react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  onClick?: () => void;
  className?: string;
  icon?: boolean;
}

export function Button({ children, variant = "primary", onClick, className = "", icon = false }: ButtonProps) {
  const base = "inline-flex items-center gap-2.5 font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]";

  const variants = {
    primary: "bg-espresso text-cream px-6 py-3 rounded-full hover:bg-espresso/90",
    secondary: "border border-espresso/20 text-espresso px-6 py-3 rounded-full hover:bg-espresso/5",
    text: "text-warm-gray underline underline-offset-4 hover:text-espresso",
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {icon && variant === "primary" && (
        <span className="w-7 h-7 rounded-full bg-cream/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight size={14} weight="bold" />
        </span>
      )}
    </button>
  );
}
