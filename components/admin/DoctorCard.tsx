"use client";

import React from "react";
import { Button } from "../ui/Button";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  email: string;
  appointments: number;
  rating: number;
  status: string;
  bio?: string;
  licenseNumber?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col">
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-zinc-100 rounded-2xl mx-auto overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>
        <div className={`absolute bottom-0 right-1/2 translate-x-10 w-4 h-4 rounded-full border-4 border-white ${
          doctor.status === 'Active' ? "bg-green-500" : "bg-zinc-400"
        }`}></div>
      </div>

      <div className="text-center space-y-1 flex-1">
        <h3 className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors">{doctor.name}</h3>
        <p className="text-sm text-zinc-500">{doctor.specialization}</p>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{doctor.licenseNumber || "No License Info"}</p>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center justify-around text-center">
        <div>
          <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.1em]">Appointments</p>
          <p className="font-bold text-zinc-900">{doctor.appointments}</p>
        </div>
        <div className="w-px h-8 bg-zinc-100"></div>
        <div>
          <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.1em]">Rating</p>
          <p className="font-bold text-zinc-900">{doctor.rating}⭐</p>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-2xl py-3 border-zinc-200 text-zinc-600 hover:border-brand-primary hover:text-brand-primary">Schedule</Button>
        <Button variant="ghost" size="sm" className="p-3 rounded-2xl bg-zinc-50 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
