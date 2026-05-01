import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Background Image - Same as Hero */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background.png')" }}
      />
      
      {/* Modern Overlay - Same as Hero */}
      <div className="absolute inset-0 z-10 bg-black/30 md:bg-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/70 via-brand-primary/20 to-brand-primary/70" />
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-20 flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tracking-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed max-w-3xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};
