import React from "react";
import { motion } from "motion/react";
import { LanguageCode } from "../shared/types";

/**
 * Unicode range matcher for Arabic characters and diacritics
 */
export const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Checks if a string or React node contains Arabic script
 */
export function isArabicText(content: React.ReactNode): boolean {
  if (typeof content === "string") {
    return ARABIC_CHAR_REGEX.test(content);
  }
  if (typeof content === "number") {
    return false;
  }
  if (Array.isArray(content)) {
    return content.some((child) => isArabicText(child));
  }
  if (React.isValidElement(content)) {
    const props = content.props as { children?: React.ReactNode };
    if (props && props.children) {
      return isArabicText(props.children);
    }
  }
  return false;
}

/**
 * Hook to detect active language direction from document or props
 */
export function useLanguageDirection(explicitDir?: "ltr" | "rtl" | "auto", explicitLang?: string): "rtl" | "ltr" {
  const [docDir, setDocDir] = React.useState<"rtl" | "ltr">(() => {
    if (typeof document !== "undefined") {
      const htmlDir = document.documentElement.getAttribute("dir");
      const htmlLang = document.documentElement.getAttribute("lang");
      return htmlDir === "rtl" || htmlLang === "ar" ? "rtl" : "ltr";
    }
    return "ltr";
  });

  React.useEffect(() => {
    if (typeof document === "undefined" || explicitDir === "ltr" || explicitDir === "rtl") return;

    const observer = new MutationObserver(() => {
      const htmlDir = document.documentElement.getAttribute("dir");
      const htmlLang = document.documentElement.getAttribute("lang");
      setDocDir(htmlDir === "rtl" || htmlLang === "ar" ? "rtl" : "ltr");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir", "lang"],
    });

    return () => observer.disconnect();
  }, [explicitDir]);

  if (explicitDir === "rtl" || explicitDir === "ltr") {
    return explicitDir;
  }
  if (explicitLang === "ar") {
    return "rtl";
  }
  return docDir;
}

export type GridColsConfig =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | "auto"
  | {
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      "2xl"?: number;
    };

export interface DashboardCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  cols?: GridColsConfig;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | number;
  direction?: "ltr" | "rtl" | "auto";
  lang?: LanguageCode | string;
  minCardWidth?: number | string;
  layoutMode?: "grid" | "flex";
  id?: string;
  style?: React.CSSProperties;
}

/**
 * DashboardCardGrid - Utility Grid component that dynamically adapts
 * flex-basis, grid-template-columns, and mobile bounds for Arabic / RTL layouts.
 */
export const DashboardCardGrid: React.FC<DashboardCardGridProps> = ({
  children,
  className = "",
  cols = "auto",
  gap = "md",
  direction = "auto",
  lang,
  minCardWidth,
  layoutMode = "grid",
  id,
  style = {},
  ...rest
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const activeDirection = useLanguageDirection(direction, lang);
  const isRTL = activeDirection === "rtl";

  // Gap mapping
  const gapClass = React.useMemo(() => {
    if (typeof gap === "number") return "";
    switch (gap) {
      case "none":
        return "gap-0";
      case "xs":
        return "gap-1.5 sm:gap-2";
      case "sm":
        return "gap-2 sm:gap-3";
      case "md":
        return "gap-3 sm:gap-4 lg:gap-5";
      case "lg":
        return "gap-4 sm:gap-6";
      case "xl":
        return "gap-6 sm:gap-8";
      default:
        return "gap-3 sm:gap-4 lg:gap-5";
    }
  }, [gap]);

  // Compute responsive column classes and dynamic styles
  const { gridClass, inlineStyles } = React.useMemo(() => {
    const computedStyles: React.CSSProperties = { ...style };
    if (typeof gap === "number") {
      computedStyles.gap = `${gap}px`;
    }

    if (layoutMode === "flex") {
      // Dynamic flex basis calculation based on direction & viewport
      return {
        gridClass: `flex flex-wrap ${gapClass}`,
        inlineStyles: computedStyles,
      };
    }

    // Grid layout mode
    let colClasses = "";

    if (cols === "auto") {
      // For auto mode, calculate minmax with adaptive threshold for Arabic
      // Arabic text often has longer compound words, so on mobile minCardWidth is set to 100% / minmax(0, 1fr)
      const baseMin = minCardWidth
        ? typeof minCardWidth === "number"
          ? `${minCardWidth}px`
          : minCardWidth
        : isRTL
        ? "min(100%, 280px)"
        : "min(100%, 260px)";

      computedStyles.gridTemplateColumns = `repeat(auto-fit, minmax(${baseMin}, 1fr))`;
      colClasses = "grid";
    } else if (typeof cols === "number") {
      switch (cols) {
        case 1:
          colClasses = "grid grid-cols-1";
          break;
        case 2:
          // On mobile always 1 col to prevent Arabic overflow, 2 col on sm/md
          colClasses = "grid grid-cols-1 sm:grid-cols-2";
          break;
        case 3:
          colClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
          break;
        case 4:
          colClasses = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
          break;
        case 5:
          colClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
          break;
        case 6:
          colClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
          break;
        default:
          colClasses = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      }
    } else if (typeof cols === "object") {
      const parts: string[] = ["grid", "grid-cols-1"];
      if (cols.sm) parts.push(`sm:grid-cols-${cols.sm}`);
      if (cols.md) parts.push(`md:grid-cols-${cols.md}`);
      if (cols.lg) parts.push(`lg:grid-cols-${cols.lg}`);
      if (cols.xl) parts.push(`xl:grid-cols-${cols.xl}`);
      if (cols["2xl"]) parts.push(`2xl:grid-cols-${cols["2xl"]}`);
      colClasses = parts.join(" ");
    }

    return {
      gridClass: `${colClasses} ${gapClass}`,
      inlineStyles: computedStyles,
    };
  }, [cols, gap, gapClass, isRTL, layoutMode, minCardWidth, style]);

  return (
    <div
      ref={containerRef}
      id={id}
      dir={isRTL ? "rtl" : "ltr"}
      className={`dashboard-card-grid w-full min-w-0 flex-shrink ${
        isRTL ? "dashboard-card-grid-rtl" : ""
      } ${gridClass} ${className}`}
      style={inlineStyles}
      {...rest}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        // Inject layout awareness props if needed
        return (
          <div
            className={`dashboard-card-grid-item w-full h-full min-w-0 flex-shrink flex flex-col ${
              layoutMode === "flex" ? (isRTL ? "basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]" : "basis-full sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]") : ""
            }`}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export interface DashboardCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "glass" | "elevated" | "bordered" | "flat" | "gradient";
  hoverEffect?: boolean;
  onClick?: () => void;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  direction?: "ltr" | "rtl" | "auto";
  lang?: LanguageCode | string;
  id?: string;
  style?: React.CSSProperties;
}

/**
 * DashboardCard - Polished, mobile-first card component with built-in
 * fluid typography, automatic Arabic/RTL detection, and boundary containment.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  title,
  subtitle,
  icon,
  badge,
  actions,
  footer,
  variant = "glass",
  hoverEffect = false,
  onClick,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  direction = "auto",
  lang,
  id,
  style,
  ...rest
}) => {
  const activeDirection = useLanguageDirection(direction, lang);

  // Auto-detect if title or subtitle contains Arabic characters
  const containsArabic = React.useMemo(() => {
    if (activeDirection === "rtl" || lang === "ar") return true;
    return isArabicText(title) || isArabicText(subtitle) || isArabicText(children);
  }, [activeDirection, lang, title, subtitle, children]);

  const isRTL = containsArabic || activeDirection === "rtl";

  // Base styling per variant
  const variantStyles = React.useMemo(() => {
    switch (variant) {
      case "elevated":
        return "bg-[#0d1f2d] border border-[#1b3d4f] shadow-lg shadow-black/40";
      case "bordered":
        return "bg-[#09151e]/80 border border-[#224b61]";
      case "flat":
        return "bg-[#0a1721] border border-transparent";
      case "gradient":
        return "bg-gradient-to-br from-[#0c222e] via-[#09161f] to-[#061017] border border-cyan-500/20 shadow-md";
      case "glass":
      default:
        return "bg-[#091722]/80 backdrop-blur-md border border-[#153445] shadow-sm";
    }
  }, [variant]);

  const hoverClasses = hoverEffect
    ? "transition-all duration-200 hover:border-cyan-500/40 hover:shadow-cyan-950/20 hover:-translate-y-0.5 cursor-pointer"
    : "";

  return (
    <motion.div
      id={id}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClick}
      whileHover={hoverEffect ? { y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`dashboard-card relative w-full h-full min-w-0 flex-shrink rounded-xl overflow-hidden flex flex-col ${variantStyles} ${hoverClasses} ${
        isRTL ? "rtl-fluid-card text-right" : "text-left"
      } ${className}`}
      style={{
        maxWidth: "100%",
        boxSizing: "border-box",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        ...style,
      }}
    >
      {/* Card Header (if title, icon, badge, or actions provided) */}
      {(title || icon || badge || actions) && (
        <div
          className={`px-3.5 py-3 sm:px-4 sm:py-3.5 border-b border-[#143242]/60 flex items-center justify-between gap-2.5 min-w-0 flex-shrink-0 ${
            isRTL ? "flex-row-reverse" : ""
          } ${headerClassName}`}
        >
          <div className={`flex items-center gap-2.5 min-w-0 flex-1 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-[#0b1d28] border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
                {icon}
              </div>
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              {title && (
                <div
                  className={`text-sm sm:text-base font-bold text-white truncate ${
                    isRTL ? "font-arabic" : ""
                  }`}
                  title={typeof title === "string" ? title : undefined}
                >
                  {title}
                </div>
              )}
              {subtitle && (
                <p
                  className={`text-xs text-[#7ea0b1] truncate mt-0.5 ${
                    isRTL ? "font-arabic" : ""
                  }`}
                  title={typeof subtitle === "string" ? subtitle : undefined}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {(badge || actions) && (
            <div className={`flex items-center gap-1.5 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`}>
              {badge && <div className="shrink-0">{badge}</div>}
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      {children && (
        <div
          className={`p-3.5 sm:p-4 md:p-5 flex-1 min-w-0 flex flex-col overflow-hidden ${
            isRTL ? "font-arabic" : ""
          } ${bodyClassName}`}
        >
          {children}
        </div>
      )}

      {/* Card Footer */}
      {footer && (
        <div
          className={`px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#061219]/60 border-t border-[#143242]/50 text-xs text-[#7ea0b1] flex items-center justify-between gap-2 min-w-0 shrink-0 ${
            isRTL ? "flex-row-reverse text-right font-arabic" : "text-left"
          } ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardCard;
