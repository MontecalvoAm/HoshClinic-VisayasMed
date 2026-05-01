
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { getCaseTypes } from "@/lib/actions/appointmentActions";
import Link from "next/link";
import {
  HeartIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BeakerIcon,
  ShieldCheckIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";
import React from "react";

// Helper to assign icons and descriptions to services
const getServiceDetails = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes("cardiology")) {
    return {
      icon: HeartIcon,
      description: "Specialized care for heart conditions, from diagnosis to advanced treatment."
    };
  }
  if (name.includes("family medicine")) {
    return {
      icon: UserGroupIcon,
      description: "Comprehensive healthcare for individuals and families across all ages."
    };
  }
  if (name.includes("dermatology")) {
    return {
      icon: ShieldCheckIcon,
      description: "Expert treatment for skin, hair, and nail conditions for a healthier you."
    };
  }
    if (name.includes("consultation")) {
    return {
      icon: AcademicCapIcon,
      description: "Expert advice and treatment plans from our experienced medical professionals."
    };
  }
  if (name.includes("laboratory")) {
    return {
      icon: BeakerIcon,
      description: "Accurate and timely diagnostic testing to help guide your medical care."
    };
  }
  // Default case
  return {
    icon: CircleStackIcon,
    description: "Providing a wide range of medical services to meet your healthcare needs."
  };
};

export default async function ServicesPage() {
  const services = await getCaseTypes();

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <PageHeader
        title="Our Medical Services"
        subtitle="Dedicated to providing top-tier healthcare across a range of specialties. Explore our services to find the right care for you."
      />

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-brand-primary font-bold tracking-wider uppercase text-sm mb-3">Our Expertise</h2>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive Healthcare Services</h3>
            <p className="text-gray-600 text-lg">
              We offer a wide range of medical services designed to meet the unique needs of every patient.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const details = getServiceDetails(service.label);
              const Icon = details.icon;
              return (
                <div 
                  key={service.id} 
                  className="group p-8 rounded-2xl border border-gray-100 bg-zinc-50 hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-6 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" aria-hidden="true" />
                  </div>
                  <h4 className="text-xl font-bold mb-4">{service.label}</h4>
                  <p className="text-gray-600 mb-6">
                    {details.description}
                  </p>
                  <Link href="/book">
                    <Button variant="ghost" className="p-0 !text-brand-primary font-bold hover:bg-transparent">
                      Learn more <span>→</span>
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
