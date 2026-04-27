"use client";

import React from "react";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  name: string;
  email: string;
  role: string;
  roleID: string;
  createdAt: string;
  specialization?: string;
  licenseNumber?: string;
  bio?: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  isLoading?: boolean;
}

export const UserTable = ({ users, onEdit, isLoading }: UserTableProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200/50 shadow-2xl shadow-zinc-200/15 overflow-hidden relative">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-zinc-50/30 border-b border-zinc-100">
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-left">User Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-left">Contact Email</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">System Role</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Member Since</th>
              <th className="px-6 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100/50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-brand-primary/[0.02] transition-all duration-300 group border-transparent hover:border-zinc-200/50 border-b last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors duration-300">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-left">
                    <span className="text-sm font-semibold text-zinc-600">{user.email}</span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      user.role === 'Super Admin' || user.role === 'Admin' 
                        ? "bg-indigo-50 text-indigo-600" 
                        : user.role === 'Doctor' 
                        ? "bg-emerald-50 text-emerald-600" 
                        : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="text-zinc-900 font-bold text-sm">
                      {new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(user.createdAt))}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button 
                        onClick={() => onEdit(user)}
                        className="p-2.5 text-zinc-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all duration-300" 
                        title="Modify Identity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      
                      {/* Access Icon (Placeholder for Future Dev) */}
                      <button 
                        className="p-2.5 text-zinc-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-xl transition-all duration-300 cursor-not-allowed" 
                        title="System Access Control (Coming Soon)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                        </svg>
                      </button>

                      <button className="p-2.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300" title="Revoke Identity">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 italic">No users found matching the search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
