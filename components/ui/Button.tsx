"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary focus:ring-brand-primary/20 rounded-xl shadow-lg shadow-brand-primary/20",
    secondary: "bg-brand-neutral text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-200/50 rounded-xl",
    accent: "bg-brand-accent text-white hover:opacity-90 focus:ring-brand-accent/20 rounded-xl shadow-lg shadow-brand-accent/20",
    success: "bg-brand-success text-white hover:opacity-90 focus:ring-brand-success/20 rounded-xl shadow-lg shadow-brand-success/20",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/20 rounded-xl",
    outline: "border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 focus:ring-zinc-100 rounded-xl",
    ghost: "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:ring-zinc-100 rounded-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs uppercase tracking-widest",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
