"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoading = (msg?: string) => {
    if (msg) setMessage(msg);
    else setMessage("Loading...");
    setIsLoading(true);
  };

  const hideLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-900/40 backdrop-blur-md transition-all duration-3100 ease-out">
          <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 flex flex-col items-center space-y-6 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-zinc-100 rounded-full opacity-50"></div>
              <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-brand-secondary border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-zinc-900 font-black text-xl tracking-tight">{message}</p>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Processing Request</p>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
