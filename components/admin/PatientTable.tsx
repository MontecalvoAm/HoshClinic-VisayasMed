"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { useLoading } from "@/context/LoadingContext";
import { deletePatient } from "@/lib/actions/patientActions";
import { getPatientFindings } from "@/lib/actions/findingActions";
import { PatientFindingsTable } from "./PatientFindingsTable";
import EditPatientModal from "./EditPatientModal";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<Patient | null>(null);
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

  const startEditing = (p: Patient) => {
    setSelectedPatientForEdit(p);
    setIsEditModalOpen(true);
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
          className={`flex items-center bg-white border ${isOpen ? 'border-brand-primary shadow-premium' : 'border-zinc-200/60 shadow-sm'} rounded-xl px-4 py-3 hover:border-zinc-300 transition-all focus:outline-none min-w-[160px] group`}
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
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white border border-zinc-100 rounded-2xl shadow-premium z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top-left">
            <div className="py-2 max-h-[320px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center justify-between ${
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Patient Records</h2>
          <p className="text-zinc-500 font-medium">Manage and access patient health information securely.</p>
        </div>
        <Button variant="primary" size="md">+ Add New Patient</Button>
      </div>

      <Card noPadding>
        <div className="p-8 border-b border-zinc-50 bg-brand-primary/[0.01]">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="flex-1 max-w-xl">
              <Input 
                placeholder="Search name, email, or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
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
                  className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"
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
              <tr className="bg-zinc-50/20 border-b border-zinc-100">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Patient Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Contact Information</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Demographics</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Clinical Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-brand-primary/[0.01] transition-all duration-300 group cursor-pointer border-transparent hover:border-zinc-200/50 border-b last:border-0">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-11 h-11 bg-zinc-100 rounded-xl border-2 border-white shadow-sm flex items-center justify-center font-black text-zinc-400 group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                        {p.name.charAt(0)}
                      </div>
                      <div className="font-black text-zinc-900 group-hover:text-brand-primary transition-colors tracking-tight">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-zinc-900 font-bold text-sm tracking-tight">{p.phone}</div>
                    <div className="text-[11px] text-zinc-400 font-bold uppercase tracking-tighter">{p.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-black text-zinc-900 text-sm tracking-tight">{calculateAge(p.dob)}y</span>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{p.gender}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-rose-100/50">{p.bloodType}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center space-x-1">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); }} className="p-2.5 text-zinc-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all" title="View Details">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setIsUploading(p); }} className="p-2.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="Upload Finding">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); startEditing(p); }} className="p-2.5 text-zinc-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all" title="Edit Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(p); }} className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedPatient} 
        onClose={() => { setSelectedPatient(null); setActiveTab('PROFILE'); }} 
        title="Patient Record Details" 
        showFooter={false}
      >
        {selectedPatient && (
          <div className="space-y-8 py-2">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-brand-primary text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-premium shadow-brand-primary/20">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Clinical Profile</p>
                <h4 className="text-3xl font-black text-zinc-900 leading-tight tracking-tighter">{selectedPatient.name}</h4>
                <div className="flex items-center space-x-3 mt-3">
                  <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 border border-zinc-200/50">{selectedPatient.gender}</span>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">DOB: {selectedPatient.dob}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 p-1.5 bg-zinc-50 rounded-2xl border border-zinc-100">
              <button onClick={() => setActiveTab('PROFILE')} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PROFILE' ? "bg-white text-brand-primary shadow-premium border border-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"}`}>Clinical Info</button>
              <button onClick={async () => { setActiveTab('FINDINGS'); showLoading("Retrieving medical archive..."); const data = await getPatientFindings(selectedPatient.id); setFindings(data); hideLoading(); }} className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'FINDINGS' ? "bg-white text-brand-primary shadow-premium border border-zinc-200/50" : "text-zinc-400 hover:text-zinc-600"}`}>Medical History</button>
            </div>

            <div className="min-h-[300px] animate-in fade-in duration-500">
              {activeTab === 'PROFILE' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100/50 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Contact</p>
                      <p className="font-black text-zinc-900 tracking-tight">{selectedPatient.phone}</p>
                      <p className="font-bold text-zinc-400 text-xs truncate tracking-tighter">{selectedPatient.email}</p>
                    </div>
                    <div className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100/50 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Biological</p>
                      <p className="font-black text-zinc-900 tracking-tight">Blood: {selectedPatient.bloodType}</p>
                      <p className="font-bold text-brand-primary text-[10px] uppercase tracking-widest">{selectedPatient.civilStatus}</p>
                    </div>
                    <div className="bg-zinc-50/50 p-6 col-span-2 rounded-3xl border border-zinc-100/50 space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Address</p>
                      <p className="font-black text-zinc-900 tracking-tight leading-snug">{selectedPatient.address}</p>
                      <p className="font-bold text-zinc-400 text-[10px] uppercase tracking-widest">{selectedPatient.city}, {selectedPatient.state}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Archived Documents</h5>
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{findings.length} Records</p>
                  </div>
                  <PatientFindingsTable findings={findings} />
                </div>
              )}
            </div>

            <Button variant="primary" className="w-full !py-5 uppercase tracking-[0.2em] text-xs shadow-premium" onClick={() => setSelectedPatient(null)}>Close Record</Button>
          </div>
        )}
      </Modal>

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patient={selectedPatientForEdit}
      />

      {/* Upload Modal */}
      <Modal isOpen={!!isUploading} onClose={resetUpload} title="Cloud Synchronizer">
        {isUploading && (
          <div className="space-y-8 py-4">
            {uploadStep === 'SELECT' ? (
              <div 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="p-16 border-4 border-dashed border-zinc-100 rounded-[3rem] bg-zinc-50/50 flex flex-col items-center justify-center text-center group hover:border-brand-primary/20 hover:bg-brand-primary/[0.01] transition-all cursor-pointer relative"
              >
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" /></svg>
                </div>
                <h5 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">Upload Clinical Data</h5>
                <p className="text-sm text-zinc-500 max-w-[280px] font-medium leading-relaxed">Securely synchronize medical imaging and lab results to the cloud.</p>
                <Button variant="outline" className="mt-10 pointer-events-none">Browse Repository</Button>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                <div className="flex items-center space-x-6 p-8 bg-zinc-50 rounded-[2.5rem] border border-zinc-100">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-premium shadow-emerald-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">Staging Document</p>
                    <h6 className="text-xl font-black text-zinc-900 truncate leading-none tracking-tight">{selectedFile?.name}</h6>
                    <p className="text-[10px] font-black text-emerald-600 mt-2 uppercase tracking-widest">{(selectedFile!.size / 1024 / 1024).toFixed(2)} MB • Optimized</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Input label="Document Title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="Enter display title..." />
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Archive Category</label>
                    <select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} className="w-full bg-white border border-zinc-200/60 rounded-xl px-5 py-3.5 text-zinc-900 text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm outline-none appearance-none cursor-pointer">
                      <option value="General">General Consultation</option>
                      <option value="X-Ray">Radiology / X-Ray</option>
                      <option value="Laboratory">Laboratory Findings</option>
                      <option value="MRI">MRI / CT Scan</option>
                      <option value="Prescription">Medical Prescription</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex items-center space-x-4">
                  <Button variant="success" className="flex-1 !py-5 shadow-premium" onClick={() => { alert(`Success: ${uploadTitle} synchronized.`); resetUpload(); }}>Authorize Upload</Button>
                  <Button variant="secondary" className="px-8 !py-5" onClick={() => setUploadStep('SELECT')}>Cancel</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
