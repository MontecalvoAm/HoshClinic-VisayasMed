"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image with Parallax effect (Simplified) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      
      {/* Modern Overlay - Depth & Legibility Enhancement */}
      <div className="absolute inset-0 z-10 bg-black/30 md:bg-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/70 via-brand-primary/20 to-brand-primary/70" />
      
      {/* Badge: Top Left Corner */}
      <div className="absolute top-28 left-6 md:left-12 z-30">
        <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/20 shadow-lg">
          <span className="flex h-2 w-2 rounded-full bg-brand-success animate-pulse" />
          <span className="text-white text-xs font-semibold tracking-wide uppercase">Now accepting online reservations</span>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-5xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Compassionate <span className="text-brand-success underline decoration-brand-success/40 underline-offset-8">Care</span> for Your Health.
          </h1>
          
          <p className="text-xl md:text-2xl text-white font-medium mb-10 leading-relaxed max-w-3xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            Providing expert medical services with a personal touch. 
            Experience healthcare that prioritizes your comfort and recovery.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto border-2 border-white transform transition hover:-translate-y-1 px-12 py-4 text-lg shadow-2xl">
                Book a Appointment
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-20 flex items-center justify-center space-x-8 md:space-x-20 text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold">15k+</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Happy Patients</div>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold">40+</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80">Medical Experts</div>
            </div>
            <div className="h-12 w-px bg-white/30" />
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-4xl font-bold">24/7</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-80 text-brand-success">Emergency Care</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative side shape */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-primary/10 backdrop-blur-3xl -skew-x-12 transform translate-x-1/2 hidden lg:block" />
    </section>
  );
};
