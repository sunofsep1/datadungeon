import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outreach" | "planning" | "active" | "completed" | "cancelled" | "hot" | "warm" | "cold" | "entered";

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  outreach: "bg-primary/20 text-primary",
  planning: "bg-primary/30 text-primary",
  active: "bg-success/20 text-success",
  completed: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
  hot: "bg-destructive/20 text-destructive",
  warm: "bg-warning/20 text-warning",
  cold: "bg-info/20 text-info",
  entered: "bg-secondary text-secondary-foreground",
};

export function StatusBadge({ children, variant = "default", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
