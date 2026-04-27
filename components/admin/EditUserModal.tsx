"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { updateUser, getRoles } from "@/lib/actions/userActions";
import { useLoading } from "@/context/LoadingContext";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [roles, setRoles] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    roleID: "",
    specialization: "",
    licenseNumber: "",
    bio: "",
    password: ""
  });

  const selectedRole = roles.find(r => r.id === formData.roleID);
  const isDoctor = selectedRole?.name === 'Doctor';

  useEffect(() => {
    async function fetchRoles() {
      const data = await getRoles();
      setRoles(data);
    }
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        middleName: user.middleName || "",
        roleID: user.roleID || "",
        specialization: user.specialization || "",
        licenseNumber: user.licenseNumber || "",
        bio: user.bio || "",
        password: ""
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    showLoading("Updating System Identity...");
    try {
      const res = await updateUser(user.id, formData);
      if (res.success) {
        onClose();
      } else {
        alert(res.error);
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modify System Identity">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-brand-primary/[0.03] border border-brand-primary/10 rounded-3xl flex items-center space-x-4 mb-2">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/5 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Update Profile</p>
            <p className="text-sm font-semibold text-zinc-600 italic">"Updating names will reflect across all medical records."</p>
          </div>
        </div>

        <div className="space-y-4">
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
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Account Email</label>
            <input
              type="email"
              disabled
              className="w-full bg-zinc-100 border-none rounded-2xl px-5 py-4 text-zinc-400 font-bold focus:outline-none text-sm cursor-not-allowed"
              value={user?.email || ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Reset Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm pr-14"
                placeholder="New password (leave blank to keep)"
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
            <p className="text-[9px] text-zinc-400 px-1 italic">Security: Password will be updated only if this field is not empty.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Assigned Role</label>
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
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary px-1">Clinical Specialization</label>
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Experience/Bio</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
                    placeholder="Brief description"
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
            Save Changes
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
