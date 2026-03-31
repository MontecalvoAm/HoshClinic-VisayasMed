import React from "react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Patients", value: "1,284", icon: "👥", trend: "+12%" },
    { label: "Today's Appointments", value: "48", icon: "📅", trend: "-5%" },
    { label: "Medical Staff", value: "32", icon: "🏥", trend: "0%" },
    { label: "Revenue (Mtd)", value: "$24,500", icon: "💰", trend: "+18%" },
  ];

  const recentAppointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Adams", time: "10:30 AM", status: "Pending" },
    { id: 3, patient: "Robert Johnson", doctor: "Dr. Evans", time: "01:00 PM", status: "In-Progress" },
    { id: 4, patient: "Maria Garcia", doctor: "Dr. Smith", time: "02:30 PM", status: "Confirmed" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? "bg-green-50 text-green-600" : 
                stat.trend === '0%' ? "bg-zinc-50 text-zinc-500" : "bg-red-50 text-red-600"
              }`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-zinc-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-zinc-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900">Today's Appointments</h2>
            <button className="text-brand-primary text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Doctor</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {recentAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-zinc-100 rounded-full"></div>
                        <span className="font-semibold text-zinc-900">{app.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600">{app.doctor}</td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">{app.time}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        app.status === 'Confirmed' ? "bg-blue-50 text-blue-600" :
                        app.status === 'Pending' ? "bg-yellow-50 text-yellow-600" :
                        "bg-green-50 text-green-600"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-6 rounded-3xl text-white shadow-xl shadow-brand-primary/20">
            <h3 className="text-lg font-bold mb-4">Quick Post</h3>
            <p className="text-white/80 text-sm mb-6">Create a new announcement for the clinic staff or patients.</p>
            <button className="w-full py-3 bg-white text-brand-primary font-bold rounded-xl hover:bg-zinc-100 transition-colors shadow-lg">
              Create Announcement
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900 mb-4">Clinic Performance</h3>
            <div className="space-y-4">
              {[
                { label: "Patient Satisfaction", val: 94 },
                { label: "Consultation Efficiency", val: 82 },
                { label: "Billing Accuracy", val: 98 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">{item.label}</span>
                    <span className="font-bold text-zinc-900">{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-success" style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
