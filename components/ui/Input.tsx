"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-primary transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white border border-zinc-200/60 rounded-xl px-4 py-3.5 
            text-zinc-900 text-sm font-semibold 
            placeholder:text-zinc-400 placeholder:font-medium
            focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary 
            transition-all shadow-sm outline-none
            ${icon ? "pl-12" : ""}
            ${error ? "border-red-500 focus:ring-red-500/5 focus:border-red-500" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
};
