"use client";

import React, { useState, useEffect } from "react";
import { getDoctors } from "@/lib/actions/doctorActions";
import { DoctorCard } from "@/components/admin/DoctorCard";
import { DoctorTable } from "@/components/admin/DoctorTable";
import { useLoading } from "@/context/LoadingContext";

export default function DoctorsPage() {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { showLoading, hideLoading } = useLoading();
  const pageSize = 8;

  const loadDoctors = async () => {
    showLoading("Fetching Medical Specialists...");
    try {
      const { data, count } = await getDoctors(currentPage, pageSize, searchQuery);
      setDoctors(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [currentPage, searchQuery]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Doctor Management</h1>
          <p className="text-zinc-500 font-medium">Automatic list of medical specialists based on assigned user roles.</p>
        </div>
      </div>

      {/* Advanced Filter & View Control Bar */}
      <div className="bg-white/50 backdrop-blur-md p-4 rounded-[2rem] border border-zinc-200/60 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative group w-full lg:max-w-md">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input 
            type="text" 
            placeholder="Search by name or specialization..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-14 pr-6 py-4 bg-white border border-zinc-200/80 rounded-2xl text-zinc-900 text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm placeholder:text-zinc-400"
          />
        </div>

        {/* View Toggle Controls */}
        <div className="flex items-center gap-3 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/50">
          <button 
            onClick={() => setViewMode('card')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              viewMode === 'card' 
                ? "bg-white text-brand-primary shadow-sm ring-1 ring-zinc-200" 
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
            </svg>
            <span>Grid View</span>
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              viewMode === 'list' 
                ? "bg-white text-brand-primary shadow-sm ring-1 ring-zinc-200" 
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5" />
            </svg>
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
            {doctors.length === 0 && (
              <div className="col-span-full py-20 text-center bg-zinc-50/50 rounded-[2.5rem] border-2 border-dashed border-zinc-200">
                <p className="text-zinc-400 font-bold">No Specialists Found</p>
              </div>
            )}
          </div>
        ) : (
          <DoctorTable doctors={doctors} />
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2rem] border border-zinc-200/60 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Showing <span className="text-zinc-900 font-black">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-zinc-900 font-black">{totalCount}</span> Professionals
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-6 py-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "text-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-6 py-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
