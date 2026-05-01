"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

export const Header = ({ variant = 'transparent' }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(variant === 'solid');

  useEffect(() => {
    if (variant === 'transparent') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [variant]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-white/10 backdrop-blur-md py-6 border-b border-white/10"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isScrolled ? "text-brand-primary" : "text-white"}`}>
            Hosh<span className="text-brand-accent">Clinic</span>
          </span>
        </Link>

        {/* Navigation - Right Side */}
        <nav className="flex items-center space-x-6">
          <Link
            href="/services"
            className={`font-medium transition-colors hidden md:block ${isScrolled ? "text-gray-600 hover:text-brand-primary" : "text-white/90 hover:text-white"
              }`}
          >
            Services
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/book">
              <Button
                variant="outline"
                size="sm"
                className={!isScrolled ? "border-white text-white hover:bg-brand-primary hover:border-brand-primary" : "border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"}
              >
                Reservation
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="primary" size="sm">
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};
