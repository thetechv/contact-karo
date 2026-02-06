"use client";

import React from "react";
import { cn } from "@/fe/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-yellow-400 border-t-transparent",
        sizeClasses[size],
        className,
      )}
    />
  );
};
