import React from "react";
import { Button } from "@/components/ui/Button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Reports & Analytics</h1>
          <p className="text-zinc-500">Comprehensive overview of clinic performance and patient trends.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Schedule Auto-Report</Button>
          <Button variant="primary">Download All Data (CSV)</Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm h-96 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-zinc-900">Revenue Growth</h3>
            <select className="text-sm border-none bg-zinc-50 rounded-lg px-2 py-1 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 bg-zinc-50 rounded-2xl flex items-center justify-center border border-dashed border-zinc-200">
            <div className="text-center text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <p className="font-medium text-zinc-500">Visualization Engine Initializing...</p>
              <p className="text-sm">Revenue trends will appear here.</p>
            </div>
          </div>
        </div>

        {/* Patient Demographics Placeholder */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm h-96 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-zinc-900">Patient Demographics</h3>
            <span className="text-xs font-bold text-brand-primary bg-blue-50 px-2 py-1 rounded-full uppercase">Real-time</span>
          </div>
          <div className="flex-1 bg-zinc-50 rounded-2xl flex items-center justify-center border border-dashed border-zinc-200">
            <div className="text-center text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 opacity-50">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
              <p className="font-medium text-zinc-500">Compiling demographic data...</p>
              <p className="text-sm">Age and gender distribution.</p>
            </div>
          </div>
        </div>

        {/* Specialized Reports Table */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Custom Report Queries</h2>
            <Button variant="ghost" size="sm" className="text-brand-primary font-bold">New Query</Button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Appointment Success Rate", val: "92%", desc: "Ratio of confirmed vs cancelled" },
              { title: "Average Visit Duration", val: "24m", desc: "Time per patient consultation" },
              { title: "Staff Utilization", val: "78%", desc: "Percentage of active working hours" },
            ].map((report) => (
              <div key={report.title} className="p-6 bg-zinc-50 rounded-2xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-zinc-100">
                <h4 className="font-bold text-zinc-900 mb-1">{report.title}</h4>
                <p className="text-3xl font-bold text-brand-primary my-3">{report.val}</p>
                <p className="text-xs text-zinc-500">{report.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
