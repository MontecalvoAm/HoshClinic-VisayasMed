"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { getLookups, updatePatient } from "@/lib/actions/patientActions";
import { completeAppointmentRegistration } from "@/lib/actions/appointmentActions";
import { useLoading } from "@/context/LoadingContext";

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

export const PatientRegistrationModal = ({ isOpen, onClose, appointment }: PatientRegistrationModalProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [step, setStep] = useState(1);
  const [genders, setGenders] = useState<any[]>([]);
  const [bloodTypes, setBloodTypes] = useState<any[]>([]);
  const [civilStatuses, setCivilStatuses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dob: "",
    genderID: "",
    civilStatusID: "",
    bloodTypeID: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    occupation: ""
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        firstName: appointment.patientFirstName || "",
        lastName: appointment.patientLastName || "",
        middleName: "",
        dob: "",
        genderID: "",
        civilStatusID: "",
        bloodTypeID: "",
        phone: appointment.patientPhone || "",
        email: appointment.patientEmail || "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        occupation: ""
      });
    }
  }, [appointment]);

  useEffect(() => {
    async function loadLookups() {
      const [g, b, c] = await Promise.all([
        getLookups("GENDER"),
        getLookups("BLOOD_TYPE"),
        getLookups("CIVIL_STATUS")
      ]);
      setGenders(g);
      setBloodTypes(b);
      setCivilStatuses(c);
    }
    if (isOpen) loadLookups();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Finalizing Registration...");
    try {
      // 1. Update Patient Record
      const patientRes = await updatePatient(appointment.patientID, formData);
      if (!patientRes.success) throw new Error(patientRes.error);

      // 2. Complete Appointment
      const appRes = await completeAppointmentRegistration(appointment.id);
      if (!appRes.success) throw new Error(appRes.error);

      onClose();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Patient Registration" showFooter={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-3 mb-10 px-1">
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-brand-primary' : 'bg-zinc-100'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-brand-primary' : 'bg-zinc-100'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 3 ? 'bg-brand-primary' : 'bg-zinc-100'}`}></div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-6 flex items-center">
              <span className="w-8 h-px bg-zinc-200 mr-4"></span> Personal Identity
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">First Name</label>
                <input 
                  type="text" value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Last Name</label>
                <input 
                  type="text" value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Middle Name (Optional)</label>
              <input 
                type="text" value={formData.middleName} 
                onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Date of Birth</label>
                <input 
                  type="date" value={formData.dob} 
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Gender</label>
                <select 
                  value={formData.genderID} 
                  onChange={(e) => setFormData({...formData, genderID: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all" required
                >
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </div>
            </div>
            <div className="pt-6">
              <button 
                type="button" onClick={() => setStep(2)}
                className="w-full py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
              >
                Proceed: Contact & Status
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-6 flex items-center">
              <span className="w-8 h-px bg-zinc-200 mr-4"></span> Communication & Vitality
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Phone Number</label>
                <input 
                  type="tel" value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
              <div>
                <label className="block text-[10px) font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Email</label>
                <input 
                  type="email" value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Civil Status</label>
                <select 
                  value={formData.civilStatusID} 
                  onChange={(e) => setFormData({...formData, civilStatusID: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all" required
                >
                  <option value="">Select Status</option>
                  {civilStatuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Blood Type</label>
                <select 
                  value={formData.bloodTypeID} 
                  onChange={(e) => setFormData({...formData, bloodTypeID: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 appearance-none cursor-pointer transition-all"
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Occupation / Profession</label>
              <input 
                type="text" value={formData.occupation} 
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            <div className="pt-6 flex space-x-4">
              <button 
                type="button" onClick={() => setStep(1)}
                className="flex-1 py-5 bg-zinc-50 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
              >
                Return
              </button>
              <button 
                type="button" onClick={() => setStep(3)}
                className="flex-[2] py-5 bg-brand-primary text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
              >
                Proceed: Residency
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300 mb-6 flex items-center">
              <span className="w-8 h-px bg-zinc-200 mr-4"></span> Residential Detail
            </h3>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Street Address</label>
              <textarea 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all min-h-[100px] resize-none" required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">City</label>
                <input 
                  type="text" value={formData.city} 
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">State / Province</label>
                <input 
                  type="text" value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all" required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2.5 px-1">Postal Code</label>
              <input 
                type="text" value={formData.postalCode} 
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/10 transition-all"
              />
            </div>
            <div className="pt-6 flex space-x-4">
              <button 
                type="button" onClick={() => setStep(2)}
                className="flex-1 py-5 bg-zinc-50 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-zinc-100 transition-all"
              >
                Return
              </button>
              <button 
                type="submit"
                className="flex-[2] py-5 bg-brand-accent text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-brand-accent/25 hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Complete Registration
              </button>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};
