"use client";

import React from "react";

interface Finding {
  id: string;
  title: string;
  type: string;
  url: string;
  notes: string;
  date: string;
  doctor: string;
}

interface PatientFindingsTableProps {
  findings: Finding[];
}

export const PatientFindingsTable = ({ findings }: PatientFindingsTableProps) => {
  if (findings.length === 0) {
    return (
      <div className="py-20 text-center bg-zinc-50/50 rounded-[2rem] border-2 border-dashed border-zinc-100">
        <div className="w-16 h-16 bg-zinc-100 text-zinc-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-zinc-500 font-bold">No clinical findings archive for this patient.</p>
        <p className="text-zinc-400 text-xs mt-1">Upload records to populate the medical history.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-zinc-50/50 border-b border-zinc-100">
            <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left">Document Title</th>
            <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left">Category</th>
            <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-left">Date</th>
            <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-50">
          {findings.map((f) => (
            <tr key={f.id} className="hover:bg-zinc-50/50 transition-colors group">
              <td className="px-6 py-4">
                <p className="font-bold text-zinc-900 leading-tight">{f.title}</p>
                <p className="text-[10px] text-zinc-400 font-medium">By: {f.doctor}</p>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-black text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg uppercase tracking-tighter">{f.type}</span>
              </td>
              <td className="px-6 py-4 text-xs font-bold text-zinc-500">{f.date}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <button className="p-2 text-zinc-400 hover:text-brand-primary transition-colors" title="View Document">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors" title="Download">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5M12 3v13.5" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
