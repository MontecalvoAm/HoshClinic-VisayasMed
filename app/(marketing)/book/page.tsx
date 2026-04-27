"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { getCaseTypes, createAppointment } from "@/lib/actions/appointmentActions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingPage() {
  const router = useRouter();
  const [caseTypes, setCaseTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    caseTypeID: "",
    preferredDate: "",
    reason: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const types = await getCaseTypes();
        setCaseTypes(types);
      } catch (err) {
        console.error("Failed to load booking data:", err);
        setError("Failed to load service types. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.caseTypeID || !formData.preferredDate) {
        throw new Error("Please select a service type and preferred date.");
      }

      const result = await createAppointment(formData);
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || "Failed to book appointment. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-500 font-medium italic">Preparing clinical resources...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-24 pb-12 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-zinc-100">
          <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mb-4">Request Sent!</h1>
          <p className="text-zinc-500 mb-10 leading-relaxed">
            Thank you for choosing Hosh Clinic, <strong>{formData.firstName}</strong>. Our staff will contact you shortly at <strong>{formData.phoneNumber}</strong> to finalize your schedule.
          </p>
          <Button onClick={() => router.push("/")} className="w-full py-4 text-base shadow-lg shadow-brand-primary/20">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              Healthcare Reservation
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-tight">
              Book Your <span className="text-brand-primary">Appointment</span>
            </h1>
            <p className="text-xl text-zinc-500 mt-4 leading-relaxed">
              Skip the wait. Fill out the form below and our medical coordinators will sort everything out for you.
            </p>
          </div>
          <Link href="/" className="text-zinc-400 hover:text-brand-primary transition-colors text-sm font-bold flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-zinc-100/50">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Form Section: Patient Details */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 font-bold">1</div>
                <h3 className="text-xl font-bold text-zinc-900">Patient Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">First Name</label>
                  <input
                    required
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Last Name</label>
                  <input
                    required
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Email Address</label>
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-zinc-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Contact Number</label>
                  <input
                    required
                    name="phoneNumber"
                    type="tel"
                    placeholder="Your primary phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-zinc-300"
                  />
                </div>
              </div>
            </section>

            <div className="h-px bg-zinc-100 w-full" />

            {/* Form Section: Appointment Details */}
            <section>
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-500 font-bold">2</div>
                <h3 className="text-xl font-bold text-zinc-900">Appointment Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Case Type</label>
                  <select
                    required
                    name="caseTypeID"
                    value={formData.caseTypeID}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Service Type</option>
                    {caseTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Preferred Date</label>
                  <input
                    required
                    name="preferredDate"
                    type="datetime-local"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border-none rounded-2xl px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-zinc-600 mb-2 px-1">Reason for Visit (Optional)</label>
                <textarea
                  name="reason"
                  rows={4}
                  placeholder="Tell us a little about your clinical concern..."
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 border-none rounded-[1.5rem] px-5 py-4 text-zinc-900 focus:ring-2 focus:ring-brand-primary/20 transition-all placeholder:text-zinc-300 resize-none"
                />
              </div>
            </section>

            {/* Error Message */}
            {error && (
              <div className="p-5 bg-red-50 border-l-4 border-red-500 rounded-2xl flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="text-red-700 font-bold text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={submitting} 
                className="w-full py-5 text-lg font-bold shadow-xl shadow-brand-primary/30 transform transition active:scale-[0.98]"
              >
                {submitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Reservation...</span>
                  </div>
                ) : (
                  "Confirm Appointment Request"
                )}
              </Button>
              <p className="text-center text-zinc-400 text-xs mt-6 font-medium">
                By submitting this request, you agree to our <span className="underline cursor-pointer">Privacy Policy</span> and <span className="underline cursor-pointer">Terms of Service</span>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
