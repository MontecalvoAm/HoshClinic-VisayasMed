"use client";

import React from "react";

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

interface DoctorTableProps {
  doctors: Doctor[];
}

export const DoctorTable = ({ doctors }: DoctorTableProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200/50 shadow-2xl shadow-zinc-200/15 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50/30 border-b border-zinc-100">
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Specialist</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Expertise</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Contact Info</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Activity</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/50">
            {doctors.length > 0 ? (
              doctors.map((doc) => (
                <tr 
                  key={doc.id} 
                  className="hover:bg-brand-primary/[0.02] transition-all duration-300 group border-transparent hover:border-zinc-200/50 border-b last:border-0"
                >
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-4 justify-center">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors duration-300">{doc.name}</div>
                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{doc.licenseNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-3 py-1.5 rounded-full uppercase tracking-wider">{doc.specialization}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-600 font-semibold text-sm">{doc.email}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-900 font-bold text-sm">{doc.appointments}</div>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Appointments</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'Active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-zinc-300"}`}></div>
                      <span className="text-xs font-bold text-zinc-600">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button className="p-2.5 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all duration-300" title="Edit Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button className="p-2.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all duration-300" title="View Schedule">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 italic">No doctors found matching the search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
