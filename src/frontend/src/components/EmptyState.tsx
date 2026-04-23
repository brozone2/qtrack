import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  "data-ocid"?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid,
}: EmptyStateProps) {
  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 px-6 text-center",
        className,
      )}
    >
      {icon && (
        <div className="text-muted-foreground/50 text-4xl mb-1">{icon}</div>
      )}
      <p className="text-base font-display font-semibold text-foreground">
        {title}
      </p>
      {description && (
        <p className="text-sm font-body text-muted-foreground max-w-xs leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <Button
          size="sm"
          onClick={action.onClick}
          data-ocid={`${dataOcid ?? "empty_state"}.action_button`}
          className="mt-2"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
