"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { updateProfile } from "@/lib/actions/profileActions";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    firstName: "",
    lastName: "",
    middleName: "",
    profilePictureURL: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from("M_Users")
          .select(`
            FullName,
            Email,
            FirstName,
            LastName,
            MiddleName,
            M_UserDetails (
              ProfilePictureURL
            )
          `)
          .eq("UserID", user.id)
          .single();

        if (data && !error) {
          setProfile({
            fullName: data.FullName,
            email: data.Email,
            firstName: data.FirstName || "",
            lastName: data.LastName || "",
            middleName: data.MiddleName || "",
            profilePictureURL: (data.M_UserDetails as any)?.ProfilePictureURL || "",
          });
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    const result = await updateProfile(userId, {
      firstName: profile.firstName,
      lastName: profile.lastName,
      middleName: profile.middleName,
      profilePictureURL: profile.profilePictureURL,
    });

    if (result.success) {
      alert("Profile updated successfully!");
    } else {
      alert("Error updating profile: " + result.error);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Account Settings</h1>
          <p className="text-zinc-500 mt-1">Manage your profile information and security preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm overflow-hidden relative group">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-3xl font-bold border-4 border-white shadow-xl overflow-hidden">
                  {profile.profilePictureURL ? (
                    <img src={profile.profilePictureURL} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{profile.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-zinc-100 text-zinc-500 hover:text-brand-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-zinc-900">{profile.fullName}</h2>
              <p className="text-sm text-zinc-500">{profile.email}</p>
              
              <div className="mt-6 w-full pt-6 border-t border-zinc-100 flex justify-around">
                <div className="text-center">
                  <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Status</p>
                  <span className="inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">Joined</p>
                  <p className="text-sm font-semibold text-zinc-700 mt-1">April 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Form */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h3 className="font-bold text-zinc-900">Personal Information</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 ml-1">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 ml-1">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-zinc-700 ml-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 cursor-not-allowed outline-none"
                    value={profile.email}
                  />
                  <p className="text-xs text-zinc-400 mt-1 ml-1 italic">Email cannot be changed directly for security reasons.</p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? "Saving Changes..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Security / Password Form */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50/50">
              <h3 className="font-bold text-zinc-900">Security</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/30">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Password</p>
                    <p className="text-sm text-zinc-500">Update your account password regularly to stay secure.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50/30">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">Two-Factor Authentication</p>
                    <p className="text-sm text-zinc-500">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest bg-zinc-100 px-2 py-1 rounded">Disabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
