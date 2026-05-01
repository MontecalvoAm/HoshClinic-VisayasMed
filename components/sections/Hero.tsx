"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export const Hero = () => {
  return (
    <section className="relative h-screen min-h-[800px] flex items-center overflow-hidden bg-white">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full mesh-gradient opacity-60"></div>
      
      {/* Decorative Floating Elements */}
      <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[10%] left-[5%] w-80 h-80 bg-brand-success/5 rounded-full blur-[80px]"></div>

      <div className="container mx-auto px-10 relative z-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/40 backdrop-blur-xl rounded-full px-5 py-2 border border-white/60 shadow-soft mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brand-success animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">Now accepting online appointments</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black text-zinc-900 leading-[0.85] tracking-[-0.05em] mb-12 animate-in fade-in slide-in-from-left-8 duration-1000 delay-150">
            Medical <br />
            <span className="text-brand-primary">Precision.</span> <br />
            Human Care.
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-500 font-medium mb-16 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            Experience healthcare redefined through world-class technology and a personal commitment to your long-term wellness.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Link href="/book" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto !px-12 !py-6 text-base tracking-widest uppercase shadow-premium">
                Book an Appointment
              </Button>
            </Link>
            <Link href="/services" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto !px-12 !py-6 text-base tracking-widest uppercase">
                Our Services
              </Button>
            </Link>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-24 pt-12 border-t border-zinc-100 flex flex-wrap gap-12 md:gap-24 animate-in fade-in duration-1000 delay-700">
            {[
              { val: "15k+", label: "Patients Served" },
              { val: "40+", label: "Medical Experts" },
              { val: "24/7", label: "Urgent Care" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Hero Visual Element (Glass Card Effect) */}
      <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[45%] h-[70%] hidden lg:block animate-in fade-in slide-in-from-right-20 duration-1000 delay-300">
        <div className="w-full h-full glass-card rounded-[4rem] border border-white/40 shadow-premium flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent"></div>
           {/* Mock Medical UI inside the glass card */}
           <div className="relative z-10 w-full p-20 space-y-12">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-brand-primary rounded-3xl shadow-premium"></div>
                <div className="space-y-3">
                   <div className="w-48 h-4 bg-zinc-900 rounded-full"></div>
                   <div className="w-32 h-3 bg-zinc-200 rounded-full"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-32 bg-white/50 rounded-3xl border border-white/60"></div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
