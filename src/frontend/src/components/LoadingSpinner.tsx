import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  "data-ocid"?: string;
}

const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

export function LoadingSpinner({
  className,
  size = "md",
  "data-ocid": dataOcid,
}: LoadingSpinnerProps) {
  return (
    <div
      aria-label="Loading"
      data-ocid={dataOcid}
      className={cn("flex items-center justify-center", className)}
    >
      <div
        className={cn(
          "rounded-full border-muted border-t-primary animate-spin",
          sizeMap[size],
        )}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
