"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { UserDropdown } from "./UserDropdown";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
      active
        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]"
        : "text-zinc-500 hover:bg-brand-primary/10 hover:text-brand-primary"
    }`}
  >
    <div className={`${active ? "text-white" : "text-zinc-400 group-hover:text-brand-primary"} transition-colors`}>
      {icon}
    </div>
    {label && <span className="font-bold tracking-tight text-sm">{label}</span>}
  </Link>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    email: string;
    roleName: string;
    profilePictureURL?: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('M_Users')
          .select(`
            FullName,
            Email,
            M_Roles ( RoleName ),
            M_UserDetails ( ProfilePictureURL )
          `)
          .eq('UserID', user.id)
          .single();

        if (data && !error) {
          setUserProfile({
            fullName: data.FullName,
            email: data.Email,
            roleName: (data.M_Roles as any)?.RoleName || 'User',
            profilePictureURL: (data.M_UserDetails as any)?.ProfilePictureURL || undefined
          });
        }
      }
    };

    fetchUserProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const maxAge = session.expires_in;
        document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
      } else if (event === 'SIGNED_OUT') {
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1900 00:00:00 GMT';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1900 00:00:00 GMT';
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      router.push("/");
    }
  };

  const navigation = [
    { label: "Dashboard", href: "/admin", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H18a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg> },
    { label: "Appointments", href: "/admin/appointments", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
    { label: "Patients", href: "/admin/patients", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
    { label: "Users", href: "/admin/users", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
    { label: "Doctors", href: "/admin/doctors", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
    { label: "Billing", href: "/admin/billing", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg> },
    { label: "Reports", href: "/admin/reports", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-24"
        } flex-shrink-0 bg-[#f4f7fa] border-r border-zinc-200/50 transition-all duration-500 ease-in-out hidden md:flex flex-col relative z-30`}
      >
        {/* Toggle Button - Centered Vertically & Bigger */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute -right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center shadow-xl shadow-brand-primary/5 transition-all duration-300 z-50 group active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={`w-6 h-6 transition-transform duration-500 ${isSidebarOpen ? "" : "rotate-180"}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Logo Section */}
        <div className="h-24 flex items-center px-8">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-lg shadow-brand-primary/20">
            H
          </div>
          {isSidebarOpen && (
            <span className="ml-4 font-black text-2xl text-zinc-900 tracking-tighter">HoshClinic</span>
          )}
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-1.5">
          {navigation.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={isSidebarOpen ? item.label : ""}
              active={pathname === item.href}
            />
          ))}
        </nav>

        {/* User Section / Bottom */}
        <div className="p-6 border-t border-zinc-200/50 bg-white/50">
          <div className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-white transition-all group cursor-pointer">
            <div className="w-11 h-11 bg-zinc-200 rounded-xl flex-shrink-0 border-2 border-white shadow-sm overflow-hidden">
               {userProfile?.profilePictureURL ? (
                 <img src={userProfile.profilePictureURL} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold">
                   {userProfile?.fullName?.charAt(0) || "U"}
                 </div>
               )}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-black text-zinc-900 truncate">
                  {userProfile?.fullName || "Loading..."}
                </p>
                <p className="text-[10px] font-bold text-zinc-400 truncate tracking-tight">{userProfile?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        {/* Subtle mesh background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-brand-primary/[0.04] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[0%] left-[-10%] w-[40%] h-[40%] bg-brand-success/[0.04] rounded-full blur-[100px]"></div>
        </div>

        {/* Top Header */}
        <header className="h-20 bg-[#f4f7fa] border-b border-zinc-200/50 flex items-center justify-between px-10 flex-shrink-0 z-20">
          <div className="flex items-center">
            <div className="w-1.5 h-8 bg-brand-primary rounded-full mr-4"></div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tight">
              {navigation.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <button className="p-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 transition-all relative group border border-zinc-200/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-accent rounded-full border-2 border-white shadow-sm scale-100 group-hover:scale-110 transition-transform"></span>
            </button>
            <div className="h-8 w-px bg-zinc-200/80"></div>
            <UserDropdown userProfile={userProfile} onLogout={handleLogout} />
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-10 relative z-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
