import React from "react";
import { motion } from "motion/react";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
  variant?: "card" | "list-item" | "text" | "circle";
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className = "", 
  count = 1,
  variant = "card"
}) => {
  const items = Array.from({ length: count });

  const getVariantClasses = () => {
    switch (variant) {
      case "circle":
        return "rounded-full w-12 h-12";
      case "list-item":
        return "rounded-xl h-16 w-full";
      case "text":
        return "rounded-md h-4 w-3/4 mb-2";
      case "card":
      default:
        return "rounded-2xl h-48 w-full";
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((_, idx) => (
        <div key={idx} className="relative overflow-hidden">
          <div 
            className={`bg-[var(--bg-surface-elevated)]/40 border border-[var(--border-color)]/30 ${getVariantClasses()}`}
          />
          <motion.div
            className="absolute inset-0 skeleton-shimmer pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "linear",
            }}
          />
        </div>
      ))}
    </div>
  );
};
