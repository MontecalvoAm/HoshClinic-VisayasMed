"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { getDoctors } from "@/lib/actions/doctorActions";
import { getStatuses, getCaseTypes, updateAppointment, deleteAppointment, createAppointment, confirmAppointment } from "@/lib/actions/appointmentActions";
import { useLoading } from "@/context/LoadingContext";
import { PatientRegistrationModal } from "./PatientRegistrationModal";

/**
 * Formats a Date object to a string compatible with <input type="datetime-local">
 * respecting the user's local timezone.
 */
const toLocalISOString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

interface Appointment {
  id: string;
  patientName: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  doctorID: string;
  doctorSpecialization: string;
  date: string;
  status: string;
  statusID: string;
  type: string;
  caseTypeID: string;
  patientID: string;
  reason: string;
}

interface AppointmentTableProps {
  appointments: Appointment[];
}

export const AppointmentTable = ({ appointments }: AppointmentTableProps) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [registeringPatient, setRegisteringPatient] = useState<Appointment | null>(null);
  
  // Resource Lists for Dropdowns
  const [doctors, setDoctors] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [caseTypes, setCaseTypes] = useState<any[]>([]);

  // Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
  // Edit & Create Form State
  const { showLoading, hideLoading } = useLoading();
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    doctorID: "",
    statusID: "",
    caseTypeID: "",
    appointmentDate: "",
    reason: ""
  });

  // Load resources once
  useEffect(() => {
    async function loadResources() {
      const [docs, stats, types] = await Promise.all([
        getDoctors(1, 100), // Fetch a larger batch for the dropdowns
        getStatuses(),
        getCaseTypes()
      ]);
      setDoctors(Array.isArray(docs) ? docs : docs.data);
      setStatuses(stats);
      setCaseTypes(types);
    }
    loadResources();
  }, []);

  const startEditing = (app: Appointment) => {
    setEditingAppointment(app);
    setEditForm({
      firstName: app.patientFirstName,
      lastName: app.patientLastName,
      email: app.patientEmail,
      phoneNumber: app.patientPhone,
      doctorID: app.doctorID || "",
      statusID: app.statusID || "",
      caseTypeID: app.caseTypeID || "",
      appointmentDate: toLocalISOString(new Date(app.date)), 
      reason: app.reason || ""
    });
  };

  const startCreatingAppointment = () => {
    setIsCreatingAppointment(true);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      doctorID: "",
      statusID: statuses.find(s => s.label === "Pending")?.id || "",
      caseTypeID: caseTypes[0]?.id || "",
      appointmentDate: toLocalISOString(new Date(new Date().setHours(new Date().getHours() + 1))),
      reason: ""
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    const id = (editingAppointment)!.id;
    showLoading("Updating Appointment...");
    
    const payload: any = {
      doctorID: editForm.doctorID,
      statusID: editForm.statusID,
      caseTypeID: editForm.caseTypeID,
    };

    if (editingAppointment) {
      payload.appointmentDate = new Date(editForm.appointmentDate).toISOString();
      payload.reason = editForm.reason;
      payload.patientInfo = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber
      };
    }

    try {
      const res = await updateAppointment(id, payload);
      if (res.success) {
        setEditingAppointment(null);
      } else {
        alert("Error updating appointment: " + res.error);
      }
    } finally {
      hideLoading();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Creating Appointment...");
    try {
      const res = await createAppointment({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phoneNumber: editForm.phoneNumber,
        caseTypeID: editForm.caseTypeID,
        preferredDate: new Date(editForm.appointmentDate).toISOString(),
        doctorID: editForm.doctorID || undefined,
        reason: editForm.reason
      });
      
      if (res.success) {
        setIsCreatingAppointment(false);
      } else {
        alert("Error creating appointment: " + res.error);
      }
    } finally {
      hideLoading();
    }
  };

  // Derived filtered appointments
  const filteredAppointments = appointments.filter(app => {
    // 1. Search filter (Name, Email, or Doctor)
    const matchesSearch = 
      app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status filter
    const matchesStatus = statusFilter === "All Status" || app.status === statusFilter;

    // 3. Doctor filter
    const matchesDoctor = doctorFilter === "All Doctors" || app.doctorID === doctorFilter;

    // 4. Category filter
    const matchesCategory = categoryFilter === "All Categories" || app.type === categoryFilter;

    // 5. Date filter
    let matchesDate = true;
    const appDate = new Date(app.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === "Today") {
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);
      matchesDate = appDate >= today && appDate <= endOfToday;
    } else if (dateFilter === "Upcoming") {
      matchesDate = appDate >= today;
    }

    return matchesSearch && matchesStatus && matchesDoctor && matchesCategory && matchesDate;
  });

  const formatTime = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).format(new Date(dateStr));
  };

  // Internal Custom Dropdown Component
  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    icon,
    id
  }: { 
    label: string, 
    value: string, 
    options: { label: string, value: string }[], 
    onChange: (val: string) => void,
    icon: React.ReactNode,
    id: string
  }) => {
    const isOpen = openDropdown === id;
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          if (isOpen) setOpenDropdown(null);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const selectedLabel = options.find(opt => opt.value === value)?.label || value;

    return (
      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setOpenDropdown(isOpen ? null : id)}
          className={`flex items-center bg-white border ${isOpen ? 'border-brand-primary shadow-md ring-4 ring-brand-primary/5' : 'border-zinc-200/60 shadow-sm'} rounded-2xl px-4 py-2.5 hover:border-zinc-300 transition-all focus:outline-none min-w-[160px] group`}
        >
          <div className={`flex items-center transition-colors mr-3 ${isOpen ? 'text-brand-primary' : 'text-zinc-400 group-hover:text-zinc-500'}`}>
            {icon}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-400 leading-tight mb-0.5">{label}</p>
            <p className="text-sm font-bold text-zinc-700 truncate">{selectedLabel}</p>
          </div>
          <div className={`ml-2 text-zinc-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : 'group-hover:text-zinc-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[220px] bg-white/90 backdrop-blur-xl border border-zinc-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top-left">
            <div className="py-1.5 max-h-[320px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between ${
                    value === opt.value 
                      ? "bg-brand-primary/5 text-brand-primary" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && (
                    <div className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Appointment Management</h1>
          <p className="text-zinc-500">Manage and schedule patient appointments.</p>
        </div>
        <button 
          onClick={startCreatingAppointment}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
        >
          <span className="mr-2 text-lg">+</span> New Appointment
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200/50 shadow-2xl shadow-zinc-200/15 overflow-hidden mb-8">
        {/* Modern Filters Bar */}
        <div className="p-8 border-b border-zinc-100/80 bg-zinc-50/40">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            {/* Search Section */}
            <div className="relative group flex-1 max-w-xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search patient records or medical specialists..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200/60 rounded-2xl text-zinc-900 text-sm font-semibold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm placeholder:text-zinc-400"
              />
            </div>

            {/* Controls Section */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Date Category Filter */}
              <FilterDropdown 
                id="date"
                label="Timeline"
                value={dateFilter}
                onChange={setDateFilter}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                }
                options={[
                  { label: "All Time", value: "All Time" },
                  { label: "Today", value: "Today" },
                  { label: "Upcoming", value: "Upcoming" }
                ]}
              />

              {/* Status Filter */}
              <FilterDropdown 
                id="status"
                label="Appointment Status"
                value={statusFilter}
                onChange={setStatusFilter}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                }
                options={[
                  { label: "All Status", value: "All Status" },
                  ...statuses.map(s => ({ label: s.label, value: s.label }))
                ]}
              />

              {/* Specialist Filter */}
              <FilterDropdown 
                id="specialist"
                label="Assigned Specialist"
                value={doctorFilter}
                onChange={setDoctorFilter}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                }
                options={[
                  { label: "All Doctors", value: "All Doctors" },
                  ...doctors.map(d => ({ label: d.name, value: d.id }))
                ]}
              />

              {/* Case Category Filter */}
              <FilterDropdown 
                id="category"
                label="Case Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.659A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                }
                options={[
                  { label: "All Categories", value: "All Categories" },
                  ...caseTypes.map(c => ({ label: c.label, value: c.label }))
                ]}
              />

              {/* Clear Filters Action */}
              {(searchQuery !== "" || statusFilter !== "All Status" || doctorFilter !== "All Doctors" || dateFilter !== "All Time" || categoryFilter !== "All Categories") && (
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All Status");
                    setDoctorFilter("All Doctors");
                    setCategoryFilter("All Categories");
                    setDateFilter("All Time");
                  }}
                  title="Clear All Filters"
                  className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/30 border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Patient Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Primary Contact</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Assigned Doctor</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Appointment Schedule</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Case Category</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/50">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((app) => (
                <tr 
                  key={app.id} 
                  onClick={() => setSelectedAppointment(app)}
                  className="hover:bg-brand-primary/[0.02] transition-all duration-300 group cursor-pointer border-transparent hover:border-zinc-200/50 border-b last:border-0"
                >
                  <td className="px-6 py-6 text-center">
                    <div className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors duration-300">{app.patientName}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-600 font-semibold text-sm">{app.patientPhone}</div>
                    <div className="text-[11px] text-zinc-400 font-medium">{app.patientEmail}</div>
                  </td>
                  <td className="px-6 py-6 text-center font-bold text-zinc-600 text-sm">
                    {app.doctorName}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-900 font-bold text-sm">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(app.date))}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                      {formatTime(app.date)}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-[10px] font-black text-brand-primary bg-brand-primary/5 px-3 py-1.5 rounded-full uppercase tracking-wider">{app.type}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedAppointment(app); }}
                        className="p-2.5 text-zinc-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all duration-300"
                        title="View Full Record"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          if (app.status === 'Confirmed') return;
                          if (window.confirm(`Are you sure you want to CONFIRM the booking for ${app.patientName}?`)) {
                            showLoading("Confirming Appointment...");
                            const res = await confirmAppointment(app.id);
                            hideLoading();
                            if (!res.success) alert("Error: " + res.error);
                          }
                        }}
                        className={`p-2.5 rounded-xl transition-all duration-300 ${
                          app.status === 'Confirmed' 
                            ? "text-emerald-500 bg-emerald-50 cursor-default" 
                            : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                        title={app.status === 'Confirmed' ? "Booking Confirmed" : "Confirm Appointment"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(app); }}
                        className="p-2.5 text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                        title="Edit Appointment Logic"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      {app.status !== 'Completed' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setRegisteringPatient(app); }}
                          className="p-2.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all duration-300"
                          title="Transform into Patient"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                          </svg>
                        </button>
                      )}
                      <button 
                        onClick={async (e) => { 
                          e.stopPropagation(); 
                          if (window.confirm("Are you sure you want to PERMANENTLY delete this appointment? This action cannot be undone.")) {
                            const res = await deleteAppointment(app.id);
                            if (!res.success) alert("Error deleting appointment: " + res.error);
                          }
                        }}
                        className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                        title="Purge Record"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-32 text-center bg-zinc-50/10">
                  <div className="max-w-xs mx-auto space-y-4">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-zinc-900 font-bold text-lg">No Appointments Found</p>
                      <p className="text-zinc-500 text-sm">We couldn't find any records matching your current filter criteria.</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("All Status");
                        setDoctorFilter("All Doctors");
                        setDateFilter("All Time");
                      }}
                      className="text-brand-primary font-bold text-sm hover:underline"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

        {/* Status indicator footer */}
        <div className="px-8 py-6 border-t border-zinc-100/60 bg-white/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
            <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest text-[10px]">
              System Insight: <span className="text-zinc-900">{filteredAppointments.length}</span> Records Synchronized
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-5 py-2.5 bg-zinc-50 border border-zinc-200/60 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 cursor-not-allowed hover:bg-zinc-100 transition-all">
              Previous Page
            </button>
            <button className="px-5 py-2.5 bg-zinc-50 border border-zinc-200/60 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 cursor-not-allowed hover:bg-zinc-100 transition-all">
              Next Page
            </button>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      <PatientRegistrationModal 
        isOpen={!!registeringPatient} 
        onClose={() => setRegisteringPatient(null)} 
        appointment={registeringPatient} 
      />

      {/* Details Modal */}
      <Modal isOpen={!!selectedAppointment} onClose={() => setSelectedAppointment(null)} title="Appointment Passport" showFooter={false}>
        {selectedAppointment && (
          <div className="space-y-10 py-2">
            {/* Header Section */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-brand-primary/20">
                {selectedAppointment.patientName.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Authenticated Patient</p>
                <h4 className="text-3xl font-black text-zinc-900 leading-tight">{selectedAppointment.patientName}</h4>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selectedAppointment.status === 'Confirmed' ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {selectedAppointment.status}
                  </span>
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">ID: {selectedAppointment.id.slice(0, 8)}</span>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-px bg-zinc-100 rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
              <div className="bg-white p-6 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Communication</p>
                <p className="font-bold text-zinc-900">{selectedAppointment.patientEmail}</p>
                <p className="font-semibold text-zinc-500 text-sm">{selectedAppointment.patientPhone}</p>
              </div>
              <div className="bg-white p-6 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Attending specialist</p>
                <p className="font-bold text-zinc-900">{selectedAppointment.doctorName}</p>
                <p className="font-semibold text-brand-primary text-sm uppercase tracking-wider">{selectedAppointment.doctorSpecialization}</p>
              </div>
              <div className="bg-white p-6 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Scheduled for</p>
                <p className="font-bold text-zinc-900">{new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(selectedAppointment.date))}</p>
                <p className="font-bold text-zinc-500 text-sm">{formatTime(selectedAppointment.date)}</p>
              </div>
              <div className="bg-white p-6 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Clinical Service</p>
                <p className="font-bold text-zinc-900">{selectedAppointment.type}</p>
                <p className="font-semibold text-zinc-400 text-[10px] uppercase tracking-widest">{selectedAppointment.caseTypeID === '1' ? 'Regular' : 'Urgent Care'}</p>
              </div>
            </div>

            {selectedAppointment.reason && (
              <div className="p-8 bg-zinc-50/50 rounded-[2rem] border-2 border-dashed border-zinc-100 italic">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1 text-center">Clinical Notes / Reason</p>
                <p className="text-zinc-600 text-lg leading-relaxed text-center font-medium">"{selectedAppointment.reason}"</p>
              </div>
            )}

            <button 
              onClick={() => setSelectedAppointment(null)}
              className="w-full py-5 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-900/20"
            >
              Acknowledge & Close
            </button>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal 
        isOpen={!!editingAppointment} 
        onClose={() => setEditingAppointment(null)} 
        title="Modify Appointment Details"
      >
        {editingAppointment && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">First Name</label>
                <input 
                  type="text" 
                  value={editForm.firstName} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Last Name</label>
                <input 
                  type="text" 
                  value={editForm.lastName} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Phone Number</label>
                <input 
                  type="tel" 
                  value={editForm.phoneNumber} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Appointment Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={editForm.appointmentDate} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Booking Status</label>
                <div className="relative group">
                  <select 
                    value={editForm.statusID} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, statusID: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
                  >
                    {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Case Type</label>
                <div className="relative group">
                  <select 
                    value={editForm.caseTypeID} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, caseTypeID: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
                  >
                    {caseTypes.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Attending Specialist</label>
                <div className="relative group">
                  <select 
                    value={editForm.doctorID} 
                    onChange={(e) => setEditForm(prev => ({ ...prev, doctorID: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
                  >
                    <option value="">Pool / Unassigned</option>
                    {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Reason for Visit (Optional)</label>
              <textarea 
                value={editForm.reason} 
                onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all min-h-[100px] resize-none"
              />
            </div>

            <div className="pt-8 border-t border-zinc-100 flex items-center space-x-4">
              <button 
                type="submit" 
                className="flex-1 py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
              >
                Sync & Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditingAppointment(null)}
                className="px-10 py-5 bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
              >
                Dismiss
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* New Appointment Modal */}
      <Modal 
        isOpen={isCreatingAppointment} 
        onClose={() => setIsCreatingAppointment(false)} 
        title="Schedule New Appointment"
      >
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">First Name</label>
              <input 
                type="text" 
                value={editForm.firstName} 
                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Last Name</label>
              <input 
                type="text" 
                value={editForm.lastName} 
                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Email Address</label>
              <input 
                type="email" 
                value={editForm.email} 
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Phone Number</label>
              <input 
                type="tel" 
                value={editForm.phoneNumber} 
                onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Date & Time</label>
              <input 
                type="datetime-local" 
                value={editForm.appointmentDate} 
                onChange={(e) => setEditForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Case Type</label>
              <div className="relative group">
                <select 
                  value={editForm.caseTypeID} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, caseTypeID: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
                >
                  {caseTypes.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Assign Specialist (Optional)</label>
            <div className="relative group">
              <select 
                value={editForm.doctorID} 
                onChange={(e) => setEditForm(prev => ({ ...prev, doctorID: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
              >
                <option value="">Unassigned / Pool</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name} - {d.specialization}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Reason for Visit</label>
            <textarea 
              value={editForm.reason} 
              onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all min-h-[100px] resize-none"
              placeholder="Briefly describe the clinical concern..."
            />
          </div>

          <div className="pt-8 border-t border-zinc-100 flex items-center space-x-4">
            <button 
              type="submit" 
              className="flex-1 py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
            >
              Confirm & Book Appointment
            </button>
            <button 
              type="button" 
              onClick={() => setIsCreatingAppointment(false)}
              className="px-10 py-5 bg-zinc-50 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
            >
              Abort
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
