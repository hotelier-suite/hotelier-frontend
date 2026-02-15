"use client";

import Image from "next/image";

interface HotelierLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "modern" | "full";
  showBackground?: boolean;
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const sizePixels = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

const fullLogoSizes = {
  sm: "h-8 w-24",
  md: "h-10 w-32",
  lg: "h-16 w-48",
  xl: "h-20 w-60",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const taglineSizeClasses = {
  sm: "text-[10px]",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

export function HotelierLogo({
  className = "",
  size = "md",
  variant = "icon",
  showBackground = false,
  showText = true,
}: HotelierLogoProps) {
  const getSizeClass = () => {
    return variant === "full" ? fullLogoSizes[size] : sizeClasses[size];
  };

  const sizeClass = getSizeClass();
  const sizeInPixels = sizePixels[size];
  const textSizeClass = textSizeClasses[size];
  const taglineSizeClass = taglineSizeClasses[size];

  const backgroundClass = showBackground
    ? "bg-linear-to-br from-indigo-500 via-blue-500 via-cyan-500 to-emerald-500 rounded-lg p-1"
    : "";

  return (
    <div
      className={`flex items-center gap-3 ${backgroundClass} ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Hotelier"
        width={sizeInPixels}
        height={sizeInPixels}
        className={`${sizeClass} object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClass} text-foreground leading-tight`}>
            Hotelier
          </span>
          <span className={`${taglineSizeClass} text-muted-foreground`}>
            Management Simplified
          </span>
        </div>
      )}
    </div>
  );
}

export default HotelierLogo;
