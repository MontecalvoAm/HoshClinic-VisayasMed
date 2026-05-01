"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { getCaseTypes, createAppointment } from "@/lib/actions/appointmentActions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/sections/PageHeader";

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium italic">Preparing the booking form...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-10 shadow-xl text-center border border-gray-100">
          <div className="w-20 h-20 bg-brand-success/10 text-brand-success rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Request Sent!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Thank you, <strong>{formData.firstName}</strong>. Our staff will contact you at <strong>{formData.phoneNumber}</strong> to finalize your schedule.
          </p>
          <Button onClick={() => router.push("/")} variant="primary" size="lg" className="w-full">
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900">
      <PageHeader
        title="Book Your Appointment"
        subtitle="Skip the wait. Fill out the form below and our medical coordinators will sort everything out for you."
      />
      <div className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Form Card */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Form Section: Patient Details */}
              <section>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary font-bold">1</div>
                  <h3 className="text-2xl font-bold text-gray-900">Patient Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">First Name</label>
                    <input
                      required
                      name="firstName"
                      type="text"
                      placeholder="e.g., John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Last Name</label>
                    <input
                      required
                      name="lastName"
                      type="text"
                      placeholder="e.g., Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Email Address</label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="e.g., john.doe@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Contact Number</label>
                    <input
                      required
                      name="phoneNumber"
                      type="tel"
                      placeholder="e.g., +1 234 567 890"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </section>

              <div className="h-px bg-gray-200 w-full" />

              {/* Form Section: Appointment Details */}
              <section>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary font-bold">2</div>
                  <h3 className="text-2xl font-bold text-gray-900">Appointment Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Service Type</label>
                    <select
                      required
                      name="caseTypeID"
                      value={formData.caseTypeID}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      {caseTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Preferred Date</label>
                    <input
                      required
                      name="preferredDate"
                      type="datetime-local"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2">Reason for Visit (Optional)</label>
                  <textarea
                    name="reason"
                    rows={4}
                    placeholder="Briefly describe your medical concern..."
                    value={formData.reason}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
                  />
                </div>
              </section>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-400 rounded-lg flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-red-700 font-bold">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 text-center">
                <Button 
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting} 
                  className="w-full md:w-auto px-16"
                >
                  {submitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Confirm Request"
                  )}
                </Button>
                <p className="text-gray-500 text-xs mt-6 font-medium">
                  By submitting, you agree to our <Link href="/privacy" className="underline hover:text-brand-primary">Privacy Policy</Link> and <Link href="/terms" className="underline hover:text-brand-primary">Terms of Service</Link>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
