import React from "react";
import { Button } from "@/components/ui/Button";

export default function PatientsPage() {
  const patients = [
    { id: "PAT-1082", name: "John Doe", age: 34, gender: "Male", lastVisit: "2026-03-10", bloodType: "O+", status: "Active" },
    { id: "PAT-1083", name: "Jane Smith", age: 28, gender: "Female", lastVisit: "2026-03-12", bloodType: "A-", status: "Active" },
    { id: "PAT-1084", name: "Robert Johnson", age: 52, gender: "Male", lastVisit: "2026-02-28", bloodType: "B+", status: "Inactive" },
    { id: "PAT-1085", name: "Maria Garcia", age: 41, gender: "Female", lastVisit: "2026-03-15", bloodType: "AB+", status: "Active" },
    { id: "PAT-1086", name: "David Lee", age: 19, gender: "Male", lastVisit: "2026-03-05", bloodType: "O-", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Patient Records (EMR)</h1>
          <p className="text-zinc-500">View and manage electronic medical records.</p>
        </div>
        <Button variant="primary" className="shadow-lg">
          <span className="mr-2">+</span> Add New Patient
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search by name, ID or phone..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-zinc-900 focus:ring-2 focus:ring-brand-primary transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-[38px] px-4">
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="h-[38px] px-4">
              Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Patient ID</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Patient Name</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Age / Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Blood Type</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Last Visit</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-zinc-400">{patient.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900">{patient.name}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    <span className="font-medium">{patient.age}y</span> / {patient.gender}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-red-50 text-brand-accent text-xs font-bold rounded-md border border-brand-accent/10">
                      {patient.bloodType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">{patient.lastVisit}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      patient.status === 'Active' ? "bg-green-50 text-green-600" : "bg-zinc-50 text-zinc-400"
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-zinc-400 hover:text-brand-primary hover:bg-zinc-100 rounded-lg transition-all" title="View EMR">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button className="p-2 text-zinc-400 hover:text-brand-primary hover:bg-zinc-100 rounded-lg transition-all" title="Edit Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
