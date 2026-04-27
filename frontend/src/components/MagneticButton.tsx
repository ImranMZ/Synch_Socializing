"use client";

import { ButtonHTMLAttributes } from "react";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  return (
    <button
      className={`relative flex items-center justify-center transition-colors duration-150 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}