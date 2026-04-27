"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, showFooter = false }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
          {children}
        </div>
        
        {/* Optional Footer */}
        {showFooter && (
          <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-600 font-bold rounded-xl hover:bg-zinc-100 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
