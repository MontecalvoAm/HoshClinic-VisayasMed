"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { createUser, getRoles } from "@/lib/actions/userActions";
import { useLoading } from "@/context/LoadingContext";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
    roleID: "",
    specialization: "",
    licenseNumber: "",
    bio: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const selectedRole = roles.find(r => r.id === formData.roleID);
  const isDoctor = selectedRole?.name === 'Doctor';

  useEffect(() => {
    async function fetchRoles() {
      const data = await getRoles();
      setRoles(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, roleID: data.find((r: any) => r.name === 'Staff')?.id || data[0].id }));
      }
    }
    if (isOpen) fetchRoles();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Creating System Identity...");
    try {
      const res = await createUser(formData);
      if (res.success) {
        onClose();
        setFormData({
          firstName: "",
          lastName: "",
          middleName: "",
          email: "",
          password: "",
          roleID: roles.find((r: any) => r.name === 'Staff')?.id || roles[0]?.id || "",
          specialization: "",
          licenseNumber: "",
          bio: ""
        });
      } else {
        alert(res.error);
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New System User">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-3xl flex items-center space-x-4 mb-2">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Identity Creation</p>
            <p className="text-sm font-semibold text-zinc-600 italic">"Separate name components used for legal consistency."</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Granular Name Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">First Name</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Last Name</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Middle Name (Optional)</label>
            <input
              type="text"
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Official Email</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="e.g. staff@vismed.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Initial Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm pr-14"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[9px] text-zinc-400 px-1 italic">Security Note: You can change this later in the User Management dashboard.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Initial System Role</label>
            <div className="relative group">
              <select
                required
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm appearance-none cursor-pointer"
                value={formData.roleID}
                onChange={(e) => setFormData({ ...formData, roleID: e.target.value })}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          {isDoctor && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary px-1">Medical Specialization</label>
                <input
                  type="text"
                  required={isDoctor}
                  className="w-full bg-white border border-brand-primary/10 rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                  placeholder="e.g. Cardiology, Pediatrics"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">License Number</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                    placeholder="PRC-1234567"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Experience Info</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                    placeholder="Years/Notes"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-zinc-100 flex items-center space-x-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
          >
            Create Identity
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-4 bg-zinc-100 text-zinc-500 font-bold rounded-2xl hover:bg-zinc-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
