"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { createDoctor } from "@/lib/actions/doctorActions";
import { useLoading } from "@/context/LoadingContext";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDoctorModal = ({ isOpen, onClose }: AddDoctorModalProps) => {
  const { showLoading, hideLoading } = useLoading();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    bio: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Registering Specialist...");
    try {
      const res = await createDoctor(formData);
      if (res.success) {
        onClose();
        setFormData({
          fullName: "",
          email: "",
          specialization: "",
          licenseNumber: "",
          bio: ""
        });
      } else {
        alert("Error: " + res.error);
      }
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New medical Specialist">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-3xl flex items-center space-x-4 mb-2">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-zinc-300 border border-zinc-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Profile Creation</p>
            <p className="text-sm font-semibold text-zinc-600">Enter the credentials for the new healthcare professional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="e.g. Dr. Jane Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="e.g. jane.doe@hosh.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Specialization</label>
            <input
              type="text"
              required
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="e.g. Cardiology"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">License Number</label>
            <input
              type="text"
              className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-bold focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm"
              placeholder="e.g. LIC-12345"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">Professional Bio</label>
          <textarea
            rows={4}
            className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 font-medium focus:ring-4 focus:ring-brand-primary/5 transition-all text-sm resize-none"
            placeholder="Briefly describe the specialist's experience and expertise..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <div className="pt-6 border-t border-zinc-100 flex items-center space-x-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-brand-primary text-white font-bold rounded-2xl shadow-xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-[0.98]"
          >
            Confirm Registration
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
