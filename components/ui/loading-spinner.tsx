import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  className,
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <LoaderCircle
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
}
