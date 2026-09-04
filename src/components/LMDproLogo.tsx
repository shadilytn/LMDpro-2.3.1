import React from "react";

interface LMDproLogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
  showText?: boolean;
}

export const LMDproLogo: React.FC<LMDproLogoProps> = ({
  className = "",
  size = 32,
  onClick,
  showText = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      title="LMDpro"
    >
      {/* Icon Image */}
      <img
        src="/logo.svg"
        alt="Logo"
        style={{ width: `${size}px`, height: `${size}px` }}
        className="rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105 shrink-0 object-contain"
      />
    </div>
  );
};
