"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserProfile {
  fullName: string;
  email: string;
  roleName: string;
  profilePictureURL?: string;
}

interface UserDropdownProps {
  userProfile: UserProfile | null;
  onLogout: () => Promise<void>;
}

export const UserDropdown = ({ userProfile, onLogout }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-zinc-100 transition-all duration-200 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold overflow-hidden shadow-md ring-2 ring-white">
          {userProfile?.profilePictureURL ? (
            <img
              src={userProfile.profilePictureURL}
              alt={userProfile.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-sm tracking-tighter">
              {userProfile ? getInitials(userProfile.fullName) : "?"}
            </span>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="px-5 py-4 border-b border-zinc-100">
            <p className="text-sm font-bold text-zinc-900 truncate">
              {userProfile?.fullName || "Guest User"}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">
              {userProfile?.email || "No email provided"}
            </p>
          </div>
          <div className="p-2">
            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-brand-primary transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="p-1.5 bg-zinc-100 rounded-lg group-hover:bg-brand-primary/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold">Settings</span>
            </Link>
            <button
              onClick={async () => {
                setIsOpen(false);
                await onLogout();
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors group"
            >
              <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
