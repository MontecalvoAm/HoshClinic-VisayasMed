"use client";

import React, { useState, useEffect, useRef } from "react";
import { getUsers, getRoles } from "@/lib/actions/userActions";
import { UserTable, User } from "@/components/admin/UserTable";
import { AddUserModal } from "@/components/admin/AddUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { useLoading } from "@/context/LoadingContext";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { showLoading, hideLoading } = useLoading();
  const pageSize = 10;

  const loadUsers = async () => {
    showLoading("Syncing System Identities...");
    try {
      const { data, count } = await getUsers(currentPage, pageSize, searchQuery, roleFilter, dateFilter);
      setUsers(data);
      setTotalCount(count);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery, roleFilter, dateFilter]);

  useEffect(() => {
    async function fetchRoles() {
      const data = await getRoles();
      setRoles(data);
    }
    fetchRoles();
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Custom Filter Dropdown Component
  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    onChange, 
    icon,
    id
  }: { 
    label: string, 
    value: string, 
    options: { label: string, value: string }[], 
    onChange: (val: string) => void,
    icon: React.ReactNode,
    id: string
  }) => {
    const isOpen = openDropdown === id;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
          className={`flex items-center bg-white border ${isOpen ? 'border-brand-primary shadow-md ring-4 ring-brand-primary/5' : 'border-zinc-200/60 shadow-sm'} rounded-2xl px-4 py-3 hover:border-zinc-300 transition-all focus:outline-none min-w-[160px] group`}
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
          <div className="absolute top-[calc(100%+8px)] left-0 w-full min-w-[200px] bg-white/90 backdrop-blur-xl border border-zinc-100 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top-left">
            <div className="py-1.5 max-h-[320px] overflow-y-auto">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onChange(opt.value);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold transition-all flex items-center justify-between ${
                    value === opt.value 
                      ? "bg-brand-primary/5 text-brand-primary" 
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && (
                    <div className="w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Date Filter Component
  const DateFilter = ({ 
    label, 
    value, 
    onChange, 
    icon 
  }: { 
    label: string, 
    value: string, 
    onChange: (val: string) => void,
    icon: React.ReactNode 
  }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const displayValue = value === "All Time" ? "All Time" : new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value));

    return (
      <div className="relative">
        <button
          onClick={() => inputRef.current?.showPicker()}
          className="flex items-center bg-white border border-zinc-200/60 shadow-sm rounded-2xl px-4 py-3 hover:border-zinc-300 transition-all focus:outline-none min-w-[170px] group"
        >
          <div className="flex items-center transition-colors mr-3 text-zinc-400 group-hover:text-brand-primary">
            {icon}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-[0.1em] text-zinc-400 leading-tight mb-0.5">{label}</p>
            <p className="text-sm font-bold text-zinc-700 truncate">{displayValue}</p>
          </div>
          <input 
            ref={inputRef}
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
            onChange={(e) => onChange(e.target.value)}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">User Management</h1>
          <p className="text-zinc-500 font-medium">Coordinate system access, security roles, and staff identities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-brand-primary/25 hover:bg-brand-secondary transition-all active:scale-95 flex items-center justify-center"
        >
          <span className="mr-2 text-lg leading-none">+</span> Create Identity
        </button>
      </div>

      {/* Modern Filters Bar */}
      <div className="bg-white/50 backdrop-blur-md p-4 rounded-[2.5rem] border border-zinc-200/60 shadow-sm">
        <div className="flex flex-col xl:flex-row items-center gap-6">
          {/* Search Input */}
          <div className="relative group flex-1 w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-brand-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search by name, email, or identity ID..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-14 pr-6 py-4 bg-white border border-zinc-200/80 rounded-2xl text-zinc-900 text-sm font-bold focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all shadow-sm placeholder:text-zinc-400"
            />
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-4">
            <FilterDropdown 
              id="role"
              label="System Role"
              value={roleFilter}
              onChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
              options={[
                { label: "All Roles", value: "All Roles" },
                ...roles.map(r => ({ label: r.name, value: r.name }))
              ]}
            />

            <DateFilter 
              label="Registration Date"
              value={dateFilter}
              onChange={(val) => { setDateFilter(val); setCurrentPage(1); }}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
            />

            {(searchQuery !== "" || roleFilter !== "All Roles" || dateFilter !== "All Time") && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("All Roles");
                  setDateFilter("All Time");
                  setCurrentPage(1);
                }}
                title="Clear All Filters"
                className="w-12 h-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        <UserTable 
          users={users} 
          onEdit={(user: User) => setEditingUser(user)}
        />
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-6 bg-white rounded-[2rem] border border-zinc-200/60 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></span>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Insight: <span className="text-zinc-900 font-black">{(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-zinc-900 font-black">{totalCount}</span> Active Identities
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-6 py-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1 
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                      : "text-zinc-400 hover:bg-zinc-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-6 py-3 bg-zinc-50 border border-zinc-200/60 rounded-2xl text-[11px] font-black uppercase tracking-widest text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          loadUsers();
        }} 
      />

      <EditUserModal 
        isOpen={!!editingUser} 
        user={editingUser}
        onClose={() => {
          setEditingUser(null);
          loadUsers();
        }} 
      />
    </div>
  );
}
