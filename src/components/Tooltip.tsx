import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguageDirection } from "./DashboardCard";

export type TooltipPosition = "top" | "bottom" | "left" | "right" | "auto";
export type TooltipVariant = "dark" | "cyan" | "emerald" | "amber" | "default";

export interface TooltipProps {
  children: React.ReactElement;
  content?: React.ReactNode;
  title?: string;
  description?: string;
  shortcut?: string | string[];
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  arrow?: boolean;
  variant?: TooltipVariant;
  interactive?: boolean;
  maxWidth?: number | string;
  className?: string;
  wrapperClassName?: string;
  id?: string;
  showOnFocus?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  title,
  description,
  shortcut,
  position = "top",
  delay = 250,
  disabled = false,
  arrow = true,
  variant = "default",
  interactive = false,
  maxWidth = 260,
  className = "",
  wrapperClassName = "",
  id,
  showOnFocus = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [coords, setCoords] = React.useState<{ top: number; left: number; actualPosition: "top" | "bottom" | "left" | "right" }>({
    top: 0,
    left: 0,
    actualPosition: "top",
  });
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const targetRef = React.useRef<HTMLDivElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const isRtl = useLanguageDirection() === "rtl";

  const calculatePosition = React.useCallback(() => {
    if (!targetRef.current) return;
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipElement = tooltipRef.current;
    const tooltipWidth = tooltipElement ? tooltipElement.offsetWidth : 200;
    const tooltipHeight = tooltipElement ? tooltipElement.offsetHeight : 60;
    const padding = 8;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    let targetPos: "top" | "bottom" | "left" | "right" = position === "auto" ? "top" : position;

    // Flip left/right if in RTL mode
    if (isRtl && (position === "left" || position === "right")) {
      targetPos = position === "left" ? "right" : "left";
    }

    // Viewport collision detection
    const spaceAbove = targetRect.top;
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = window.innerWidth - targetRect.right;

    if (targetPos === "top" && spaceAbove < tooltipHeight + padding && spaceBelow > spaceAbove) {
      targetPos = "bottom";
    } else if (targetPos === "bottom" && spaceBelow < tooltipHeight + padding && spaceAbove > spaceBelow) {
      targetPos = "top";
    } else if (targetPos === "left" && spaceLeft < tooltipWidth + padding && spaceRight > spaceLeft) {
      targetPos = "right";
    } else if (targetPos === "right" && spaceRight < tooltipWidth + padding && spaceLeft > spaceRight) {
      targetPos = "left";
    }

    let top = 0;
    let left = 0;

    switch (targetPos) {
      case "top":
        top = targetRect.top + scrollY - tooltipHeight - padding;
        left = targetRect.left + scrollX + (targetRect.width - tooltipWidth) / 2;
        break;
      case "bottom":
        top = targetRect.bottom + scrollY + padding;
        left = targetRect.left + scrollX + (targetRect.width - tooltipWidth) / 2;
        break;
      case "left":
        top = targetRect.top + scrollY + (targetRect.height - tooltipHeight) / 2;
        left = targetRect.left + scrollX - tooltipWidth - padding;
        break;
      case "right":
        top = targetRect.top + scrollY + (targetRect.height - tooltipHeight) / 2;
        left = targetRect.right + scrollX + padding;
        break;
    }

    // Keep within viewport boundaries
    const minLeft = scrollX + padding;
    const maxLeft = scrollX + window.innerWidth - tooltipWidth - padding;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    setCoords({ top, left, actualPosition: targetPos });
  }, [position, isRtl]);

  const showTooltip = () => {
    if (disabled) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsVisible(false);
  };

  React.useEffect(() => {
    if (isVisible) {
      calculatePosition();
      const handleScrollOrResize = () => calculatePosition();
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);
      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isVisible, calculatePosition]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const variantStyles = {
    default: "bg-[#071720]/95 text-gray-100 border-[#1b3b4a] shadow-cyan-950/40",
    dark: "bg-[#050d12]/95 text-gray-100 border-[#122834] shadow-black/60",
    cyan: "bg-[#061e2b]/95 text-cyan-100 border-[#22d3ee]/40 shadow-cyan-500/20",
    emerald: "bg-[#06241c]/95 text-emerald-100 border-[#34d399]/40 shadow-emerald-500/20",
    amber: "bg-[#241b08]/95 text-amber-100 border-[#f59e0b]/40 shadow-amber-500/20",
  };

  const hasComplexContent = Boolean(title || description || shortcut);

  return (
    <div
      ref={targetRef}
      className={`relative inline-flex items-center ${wrapperClassName}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showOnFocus ? showTooltip : undefined}
      onBlur={showOnFocus ? hideTooltip : undefined}
      onClick={() => {
        // Hide tooltip on tap if mobile
        if (window.matchMedia("(pointer: coarse)").matches) {
          hideTooltip();
        }
      }}
    >
      {children}

      <AnimatePresence>
        {isVisible && !disabled && (
          <motion.div
            ref={tooltipRef}
            id={id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.94, y: coords.actualPosition === "top" ? 3 : -3 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
              zIndex: 999999,
              pointerEvents: interactive ? "auto" : "none",
            }}
            className={`px-2.5 py-1.5 rounded-lg border backdrop-blur-md shadow-lg text-xs leading-snug transition-colors ${variantStyles[variant]} ${className}`}
            onMouseEnter={interactive ? showTooltip : undefined}
            onMouseLeave={interactive ? hideTooltip : undefined}
            dir={isRtl ? "rtl" : "ltr"}
          >
            {hasComplexContent ? (
              <div className="space-y-1">
                {title && (
                  <div className="font-semibold text-white flex items-center justify-between gap-2">
                    <span className="text-[11px] font-sans tracking-wide text-cyan-300 font-bold">{title}</span>
                    {shortcut && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-gray-300">
                        {Array.isArray(shortcut) ? shortcut.join(" + ") : shortcut}
                      </span>
                    )}
                  </div>
                )}
                {description && <p className="text-[10px] text-gray-300 font-sans leading-normal">{description}</p>}
                {content && !title && !description && content}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium tracking-normal text-left rtl:text-right">{content}</span>
                {shortcut && (
                  <span className="font-mono text-[9px] px-1 py-0.5 rounded bg-black/40 border border-white/10 text-gray-300 shrink-0">
                    {Array.isArray(shortcut) ? shortcut.join("+") : shortcut}
                  </span>
                )}
              </div>
            )}

            {/* Subtle glass arrow */}
            {arrow && (
              <div
                className={`absolute w-2 h-2 rotate-45 border pointer-events-none ${
                  coords.actualPosition === "top"
                    ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-t-0 border-l-0"
                    : coords.actualPosition === "bottom"
                    ? "top-[-5px] left-1/2 -translate-x-1/2 border-b-0 border-r-0"
                    : coords.actualPosition === "left"
                    ? "right-[-5px] top-1/2 -translate-y-1/2 border-b-0 border-l-0"
                    : "left-[-5px] top-1/2 -translate-y-1/2 border-t-0 border-r-0"
                } ${
                  variant === "cyan"
                    ? "bg-[#061e2b] border-[#22d3ee]/40"
                    : variant === "emerald"
                    ? "bg-[#06241c] border-[#34d399]/40"
                    : variant === "amber"
                    ? "bg-[#241b08] border-[#f59e0b]/40"
                    : "bg-[#071720] border-[#1b3b4a]"
                }`}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
