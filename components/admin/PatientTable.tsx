"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { useLoading } from "@/context/LoadingContext";
import { updatePatient, deletePatient, getLookups } from "@/lib/actions/patientActions";
import { getPatientFindings } from "@/lib/actions/findingActions";
import { PatientFindingsTable } from "./PatientFindingsTable";

interface Patient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  civilStatus: string;
  bloodType: string;
  address: string;
  city: string;
  state: string;
  lastVisit: string;
  status: string;
}

interface PatientTableProps {
  patients: Patient[];
}

export const PatientTable = ({ patients }: PatientTableProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [isUploading, setIsUploading] = useState<Patient | null>(null);
  
  // Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("General");
  const [uploadStep, setUploadStep] = useState<'SELECT' | 'REVIEW'>('SELECT');
  
  const [searchQuery, setSearchQuery] = useState("");
  const [genderFilter, setGenderFilter] = useState("All Gender");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { showLoading, hideLoading } = useLoading();

  // Detail Modal Tabs & Data
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'FINDINGS'>('PROFILE');
  const [findings, setFindings] = useState<any[]>([]);

  // Resource Lists for Edit Modal
  const [genders, setGenders] = useState<any[]>([]);
  const [bloodTypes, setBloodTypes] = useState<any[]>([]);
  const [civilStatuses, setCivilStatuses] = useState<any[]>([]);

  // Edit Form State
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    phone: "",
    dob: "",
    genderID: "",
    bloodTypeID: "",
    civilStatusID: "",
    address: "",
    city: "",
    state: ""
  });

  // Load lookups for Edit Modal
  useEffect(() => {
    async function loadLookups() {
      const [gen, blood, civil] = await Promise.all([
        getLookups('GENDER'),
        getLookups('BLOOD_TYPE'),
        getLookups('CIVIL_STATUS')
      ]);
      setGenders(gen);
      setBloodTypes(blood);
      setCivilStatuses(civil);
    }
    loadLookups();
  }, []);

  const startEditing = (p: Patient) => {
    setEditingPatient(p);
    setEditForm({
      firstName: p.firstName,
      lastName: p.lastName,
      middleName: p.middleName,
      email: p.email,
      phone: p.phone,
      dob: p.dob,
      genderID: genders.find(g => g.label === p.gender)?.id || "",
      bloodTypeID: bloodTypes.find(b => b.label === p.bloodType)?.id || "",
      civilStatusID: civilStatuses.find(c => c.label === p.civilStatus)?.id || "",
      address: p.address,
      city: p.city,
      state: p.state
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;

    showLoading("Updating Patient Record...");
    try {
      const res = await updatePatient(editingPatient.id, editForm);
      if (res.success) {
        setEditingPatient(null);
      } else {
        alert("Error updating patient: " + res.error);
      }
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (p: Patient) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete the record for ${p.name}? This action cannot be undone.`)) {
      showLoading("Deleting Patient Record...");
      try {
        const res = await deletePatient(p.id);
        if (!res.success) alert("Error deleting patient: " + res.error);
      } finally {
        hideLoading();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadTitle(file.name.split('.')[0]);
      setUploadStep('REVIEW');
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadTitle("");
    setUploadCategory("General");
    setUploadStep('SELECT');
    setIsUploading(null);
  };

  const calculateAge = (dob: string | null) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    
    const matchesGender = genderFilter === "All Gender" || p.gender === genderFilter;
    const matchesStatus = statusFilter === "All Status" || p.status === statusFilter;

    return matchesSearch && matchesGender && matchesStatus;
  });

  // Internal Custom Dropdown Component
  const FilterDropdown = ({ 
    label, value, options, onChange, icon, id 
  }: { 
    label: string, value: string, options: { label: string, value: string }[], 
    onChange: (val: string) => void, icon: React.ReactNode, id: string
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
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white/90 backdrop-blur-xl border border-zinc-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top-left">
            <div className="py-1.5 max-h-[320px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between ${
                    value === opt.value ? "bg-brand-primary/5 text-brand-primary" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span>{opt.label}</span>
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
          <h1 className="text-2xl font-bold text-zinc-900">Patient Records</h1>
          <p className="text-zinc-500">View and manage electronic medical records.</p>
        </div>
        <button 
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all active:scale-95"
        >
          <span className="mr-2 text-lg">+</span> Add New Patient
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200/50 shadow-2xl shadow-zinc-200/15 overflow-hidden mb-8">
        <div className="p-8 border-b border-zinc-100/80 bg-zinc-50/40">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="relative group flex-1 max-w-xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input 
                type="text" 
                placeholder="Search by name, contact details or location..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200/60 rounded-2xl text-zinc-900 text-sm font-semibold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <FilterDropdown 
                id="gender" label="Gender Profile" value={genderFilter} onChange={setGenderFilter}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
                options={[{ label: "All Gender", value: "All Gender" }, { label: "Male", value: "Male" }, { label: "Female", value: "Female" }]}
              />

              <FilterDropdown 
                id="status" label="Record Status" value={statusFilter} onChange={setStatusFilter}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                options={[{ label: "All Status", value: "All Status" }, { label: "Active", value: "Active" }, { label: "Inactive", value: "Inactive" }]}
              />

              {(searchQuery !== "" || genderFilter !== "All Gender" || statusFilter !== "All Status") && (
                <button 
                  onClick={() => { setSearchQuery(""); setGenderFilter("All Gender"); setStatusFilter("All Status"); }}
                  className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50/30 border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Full Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Primary Contact</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Age / Gender</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Blood Type</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100/50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-brand-primary/[0.02] transition-all duration-300 group cursor-pointer border-transparent hover:border-zinc-200/50 border-b last:border-0">
                  <td className="px-6 py-6 text-center">
                    <div className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors">{p.name}</div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-600 font-semibold text-sm">{p.phone}</div>
                    <div className="text-[11px] text-zinc-400 font-medium">{p.email}</div>
                  </td>
                  <td className="px-6 py-6 text-center text-sm">
                    <span className="font-bold text-zinc-700">{calculateAge(p.dob)}y</span>
                    <span className="text-zinc-400 mx-1">/</span>
                    <span className="font-semibold text-zinc-500">{p.gender}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full uppercase tracking-wider">{p.bloodType}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); }}
                        className="p-2.5 text-zinc-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all" 
                        title="View Patient Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setIsUploading(p); }}
                        className="p-2.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" 
                        title="Upload Clinical Findings"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEditing(p); }}
                        className="p-2.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all" 
                        title="Edit Patient Profile"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(p); }}
                        className="p-2.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                        title="Purge Record"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Patient Details Modal */}
      <Modal 
        isOpen={!!selectedPatient} 
        onClose={() => { setSelectedPatient(null); setActiveTab('PROFILE'); }} 
        title="Patient Access Details" 
        showFooter={false}
      >
        {selectedPatient && (
          <div className="space-y-8 py-2">
            {/* Header Section */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-brand-primary text-white rounded-[2rem] flex items-center justify-center text-3xl font-black shadow-2xl shadow-brand-primary/20">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Authenticated Patient Profile</p>
                <h4 className="text-3xl font-black text-zinc-900 leading-tight">{selectedPatient.name}</h4>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500">
                    {selectedPatient.gender}
                  </span>
                  <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">DOB: {selectedPatient.dob}</span>
                </div>
              </div>
            </div>

            {/* Premium Tab Navigation */}
            <div className="flex items-center space-x-2 p-1 bg-zinc-50 rounded-2xl border border-zinc-100">
              <button 
                onClick={() => setActiveTab('PROFILE')}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'PROFILE' ? "bg-white text-brand-primary shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Clinical Profile
              </button>
              <button 
                onClick={async () => {
                  setActiveTab('FINDINGS');
                  showLoading("Retrieving medical archive...");
                  const data = await getPatientFindings(selectedPatient.id);
                  setFindings(data);
                  hideLoading();
                }}
                className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'FINDINGS' ? "bg-white text-brand-primary shadow-sm ring-1 ring-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                Findings & Reports
              </button>
            </div>

            <div className="min-h-[300px] animate-in fade-in duration-500">
              {activeTab === 'PROFILE' ? (
                <div className="space-y-8">
                  {/* Content Grid */}
                  <div className="grid grid-cols-2 gap-px bg-zinc-100 rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
                    <div className="bg-white p-6 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Primary Contact</p>
                      <p className="font-bold text-zinc-900">{selectedPatient.phone}</p>
                      <p className="font-semibold text-zinc-500 text-sm">{selectedPatient.email}</p>
                    </div>
                    <div className="bg-white p-6 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Clinical Background</p>
                      <p className="font-bold text-zinc-900">Blood Type: {selectedPatient.bloodType}</p>
                      <p className="font-semibold text-brand-primary text-sm uppercase tracking-wider">{selectedPatient.civilStatus}</p>
                    </div>
                    <div className="bg-white p-6 col-span-2 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Residence / Address</p>
                      <p className="font-bold text-zinc-900">{selectedPatient.address}</p>
                      <p className="font-semibold text-zinc-400 text-[10px] uppercase tracking-widest">{selectedPatient.city}, {selectedPatient.state}</p>
                    </div>
                  </div>

                  <div className="p-8 bg-zinc-50/50 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">Administrative Status</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <p className="font-bold text-zinc-900 leading-none">Active Patient Record</p>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                      Verification Logs
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h5 className="text-xs font-black uppercase tracking-widest text-zinc-400">Medical Repository</h5>
                    <p className="text-[10px] font-bold text-brand-primary">{findings.length} Documents Archived</p>
                  </div>
                  <PatientFindingsTable findings={findings} />
                </div>
              )}
            </div>

            <button 
              onClick={() => { setSelectedPatient(null); setActiveTab('PROFILE'); }}
              className="w-full py-5 bg-zinc-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-2xl shadow-zinc-900/20"
            >
              Acknowledge & Close
            </button>
          </div>
        )}
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={!!editingPatient} onClose={() => setEditingPatient(null)} title="Modify Patient Information">
        {editingPatient && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
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
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Middle Name</label>
                <input 
                  type="text" 
                  value={editForm.middleName} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, middleName: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
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
                  value={editForm.phone} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Date of Birth</label>
                <input 
                  type="date" 
                  value={editForm.dob} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Gender</label>
                <select 
                  value={editForm.genderID} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, genderID: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Civil Status</label>
                <select 
                  value={editForm.civilStatusID} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, civilStatusID: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Status</option>
                  {civilStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Blood Type</label>
                <select 
                  value={editForm.bloodTypeID} 
                  onChange={(e) => setEditForm(prev => ({ ...prev, bloodTypeID: e.target.value }))}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Full Address</label>
              <textarea 
                value={editForm.address} 
                onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all min-h-[80px] resize-none"
                required
              />
            </div>

            <div className="pt-8 border-t border-zinc-100 flex items-center space-x-4">
              <button 
                type="submit" 
                className="flex-1 py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
              >
                Sync & Save Profile
              </button>
              <button 
                type="button" 
                onClick={() => setEditingPatient(null)}
                className="px-10 py-5 bg-zinc-50 text-zinc-400 font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
              >
                Dismiss
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* File Upload Modal (Multi-stage with Review) */}
      <Modal isOpen={!!isUploading} onClose={resetUpload} title="Premium Clinical Findings Upload">
        {isUploading && (
          <div className="space-y-8 py-4">
            {uploadStep === 'SELECT' ? (
              <div 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="p-16 border-4 border-dashed border-zinc-100 rounded-[2.5rem] bg-zinc-50/50 flex flex-col items-center justify-center text-center group hover:border-brand-primary/20 hover:bg-brand-primary/[0.02] transition-all cursor-pointer relative"
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                </div>
                <h5 className="text-2xl font-black text-zinc-900 mb-2">Deploy Patient Results</h5>
                <p className="text-base text-zinc-500 max-w-[300px] font-medium leading-relaxed">
                  Select a clinical document (X-ray, Lab, MRI) to begin the synchronization process.
                </p>
                <button className="mt-10 px-10 py-4 bg-white border border-zinc-200 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 shadow-sm hover:shadow-md transition-all">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center space-x-6 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 mb-8">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Staging for review</p>
                    <h6 className="text-xl font-black text-zinc-900 truncate max-w-[280px]">{selectedFile?.name}</h6>
                    <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-tighter">{(selectedFile!.size / 1024 / 1024).toFixed(2)} MB • Ready for Cloud Sync</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Clinical Display Title</label>
                    <input 
                      type="text" 
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-emerald-500/10 transition-all border-dashed"
                      placeholder="e.g., Thoracic X-Ray Result"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Document Category</label>
                    <select 
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold appearance-none cursor-pointer border-dashed"
                    >
                      <option value="General">General Consultation</option>
                      <option value="X-Ray">Radiology / X-Ray</option>
                      <option value="Laboratory">Laboratory Findings</option>
                      <option value="MRI">MRI / CT Scan</option>
                      <option value="Prescription">Medical Prescription</option>
                    </select>
                  </div>
                </div>

                <div className="pt-10 flex items-center space-x-4">
                  <button 
                    onClick={() => {
                      alert(`Review Complete: ${uploadTitle} (${uploadCategory}) will be securely stored for ${isUploading.name}.`);
                      resetUpload();
                    }}
                    className="flex-1 py-5 bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-emerald-500/25 hover:bg-emerald-700 transition-all active:scale-[0.98]"
                  >
                    Authorize Synchronization
                  </button>
                  <button 
                    onClick={() => setUploadStep('SELECT')}
                    className="px-8 py-5 bg-zinc-50 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
                  >
                    Change File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
