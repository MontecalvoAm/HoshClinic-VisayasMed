import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Patients", value: "1,284", icon: "👥", trend: "+12%", color: "brand-primary" },
    { label: "Today's Appointments", value: "48", icon: "📅", trend: "-5%", color: "brand-accent" },
    { label: "Medical Staff", value: "32", icon: "🏥", trend: "0%", color: "brand-success" },
    { label: "Revenue (Mtd)", value: "$24,500", icon: "💰", trend: "+18%", color: "brand-warning" },
  ];

  const recentAppointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Adams", time: "10:30 AM", status: "Pending" },
    { id: 3, patient: "Robert Johnson", doctor: "Dr. Evans", time: "01:00 PM", status: "In-Progress" },
    { id: 4, patient: "Maria Garcia", doctor: "Dr. Smith", time: "02:30 PM", status: "Confirmed" },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header with quick summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Overview</h2>
          <p className="text-zinc-500 font-medium">Welcome back! Here's what's happening at the clinic today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md">Download Report</Button>
          <Button variant="primary" size="md">+ New Appointment</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-8 rounded-[2rem] bg-white border border-zinc-100 shadow-soft hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                stat.trend === '0%' ? "bg-zinc-50 text-zinc-400" : "bg-rose-50 text-rose-600"
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
            <p className="text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2">
          <Card 
            title="Today's Appointments" 
            subtitle="Real-time schedule of patient visits."
            action={<Button variant="ghost" size="sm">View Schedule</Button>}
            noPadding
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Patient</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Doctor</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {recentAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-zinc-50/50 transition-colors group cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-zinc-100 rounded-xl border-2 border-white shadow-sm flex items-center justify-center font-bold text-zinc-400 group-hover:text-brand-primary transition-colors">
                            {app.patient.charAt(0)}
                          </div>
                          <span className="font-bold text-zinc-900 group-hover:text-brand-primary transition-colors">{app.patient}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-zinc-500 font-semibold text-sm">{app.doctor}</td>
                      <td className="px-8 py-5 text-zinc-900 font-black text-sm">{app.time}</td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          app.status === 'Confirmed' ? "bg-blue-50 text-blue-600" :
                          app.status === 'Pending' ? "bg-amber-50 text-amber-600" :
                          "bg-emerald-50 text-emerald-600"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30 text-center">
               <button className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-brand-primary transition-colors">Load More Records</button>
            </div>
          </Card>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="space-y-8">
          <div className="bg-brand-primary p-10 rounded-[2.5rem] text-white shadow-premium shadow-brand-primary/20 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-2xl font-black mb-4 relative z-10 tracking-tight">Staff Update</h3>
            <p className="text-white/70 text-sm mb-8 relative z-10 leading-relaxed">Broadcast clinical protocols or general announcements to the medical team instantly.</p>
            <Button variant="outline" className="w-full !bg-white/10 !border-white/20 !text-white hover:!bg-white hover:!text-brand-primary relative z-10">
              Create Broadcast
            </Button>
          </div>

          <Card title="Clinic Performance">
            <div className="space-y-8">
              {[
                { label: "Patient Satisfaction", val: 94, color: "bg-emerald-500" },
                { label: "Consultation Efficiency", val: 82, color: "bg-brand-primary" },
                { label: "Billing Accuracy", val: 98, color: "bg-brand-secondary" },
              ].map((item) => (
                <div key={item.label} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</span>
                    <span className="font-black text-zinc-900 tracking-tighter">{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-1000 shadow-sm`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
