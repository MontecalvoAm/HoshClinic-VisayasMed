"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "outline";
  noPadding?: boolean;
}

export const Card = ({
  children,
  title,
  subtitle,
  action,
  className = "",
  variant = "default",
  noPadding = false,
}: CardProps) => {
  const variants = {
    default: "bg-white border border-zinc-100 shadow-soft",
    glass: "glass-card",
    outline: "bg-transparent border border-zinc-200",
  };

  return (
    <div className={`rounded-3xl overflow-hidden transition-all duration-300 ${variants[variant]} ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-8 py-6 border-b border-zinc-50 flex items-center justify-between">
          <div>
            {title && <h3 className="text-lg font-black text-zinc-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-sm font-medium text-zinc-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-8"}>
        {children}
      </div>
    </div>
  );
};
