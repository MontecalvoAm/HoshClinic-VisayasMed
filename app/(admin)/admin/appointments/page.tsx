import React from "react";
import { Button } from "@/components/ui/Button";

export default function AppointmentsPage() {
  const appointments = [
    { id: "APT-001", patient: "John Doe", doctor: "Dr. Elena Smith", date: "2026-03-18", time: "09:00 AM", type: "Check-up", status: "Confirmed" },
    { id: "APT-002", patient: "Jane Smith", doctor: "Dr. Marcus Adams", date: "2026-03-18", time: "10:30 AM", type: "Follow-up", status: "Pending" },
    { id: "APT-003", patient: "Robert Johnson", doctor: "Dr. Sarah Evans", date: "2026-03-18", time: "01:00 PM", type: "Consultation", status: "Cancelled" },
    { id: "APT-004", patient: "Maria Garcia", doctor: "Dr. Elena Smith", date: "2026-03-19", time: "08:30 AM", type: "Emergency", status: "Confirmed" },
    { id: "APT-005", patient: "David Lee", doctor: "Dr. Marcus Adams", date: "2026-03-19", time: "11:00 AM", type: "Vaccination", status: "Confirmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Appointment Management</h1>
          <p className="text-zinc-500">Manage and schedule patient appointments.</p>
        </div>
        <Button variant="primary" className="shadow-lg">
          <span className="mr-2">+</span> New Appointment
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-6 border-b border-zinc-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input 
              type="text" 
              placeholder="Search appointments..." 
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 border-none rounded-xl text-zinc-900 focus:ring-2 focus:ring-brand-primary transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="bg-zinc-50 border-none rounded-xl px-4 py-2 text-sm font-medium text-zinc-600 focus:ring-2 focus:ring-brand-primary">
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
            <Button variant="outline" size="sm" className="h-[38px]">
              Filters
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Doctor</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {appointments.map((app) => (
                <tr key={app.id} className="hover:bg-zinc-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-zinc-400">{app.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-zinc-900">{app.patient}</div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 font-medium">{app.doctor}</td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-900 font-medium">{app.date}</div>
                    <div className="text-xs text-zinc-500">{app.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md">{app.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      app.status === 'Confirmed' ? "bg-blue-50 text-blue-600" :
                      app.status === 'Pending' ? "bg-yellow-50 text-yellow-600" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-brand-primary hover:bg-zinc-100 rounded-lg transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="p-6 border-t border-zinc-50 flex items-center justify-between">
          <p className="text-sm text-zinc-500">Showing 5 of 48 appointments</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="px-4" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="px-4">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
