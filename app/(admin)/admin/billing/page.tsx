import React from "react";
import { Button } from "@/components/ui/Button";

export default function BillingPage() {
  const invoices = [
    { id: "INV-2024-001", patient: "John Doe", date: "2026-03-15", amount: 150.00, status: "Paid", method: "Credit Card" },
    { id: "INV-2024-002", patient: "Jane Smith", date: "2026-03-16", amount: 85.50, status: "Pending", method: "-" },
    { id: "INV-2024-003", patient: "Robert Johnson", date: "2026-03-16", amount: 210.00, status: "Paid", method: "Cash" },
    { id: "INV-2024-004", patient: "Maria Garcia", date: "2026-03-17", amount: 120.00, status: "Unpaid", method: "-" },
    { id: "INV-2024-005", patient: "David Lee", date: "2026-03-17", amount: 45.00, status: "Paid", method: "Digital Wallet" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Billing & Invoices</h1>
          <p className="text-zinc-500">Track payments and manage clinic revenue.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="shadow-sm">Export Report</Button>
          <Button variant="primary" className="shadow-lg">Create Invoice</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Unpaid Invoices</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">$1,240.00</p>
          <div className="mt-4 flex items-center text-xs font-bold text-red-500 bg-red-50 w-fit px-2 py-1 rounded-full">
            <span>High priority</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Total Collected (Mtd)</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">$12,850.00</p>
          <div className="mt-4 flex items-center text-xs font-bold text-green-500 bg-green-50 w-fit px-2 py-1 rounded-full">
            <span>+15% from last month</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Avg. Payment Time</p>
          <p className="text-3xl font-bold text-zinc-900 mt-2">1.2 Days</p>
          <div className="mt-4 flex items-center text-xs font-bold text-blue-500 bg-blue-50 w-fit px-2 py-1 rounded-full">
            <span>Optimal</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-50">
          <h2 className="text-lg font-bold text-zinc-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50">
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Invoice #</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-zinc-400">{inv.id}</td>
                  <td className="px-6 py-4 font-bold text-zinc-900">{inv.patient}</td>
                  <td className="px-6 py-4 text-zinc-600">{inv.date}</td>
                  <td className="px-6 py-4 font-bold text-zinc-900">${inv.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      inv.status === 'Paid' ? "bg-green-50 text-green-600" :
                      inv.status === 'Pending' ? "bg-yellow-50 text-yellow-600" :
                      "bg-red-50 text-red-600"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-sm">{inv.method}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-brand-primary hover:bg-zinc-100 rounded-lg transition-all" title="View/Print">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.89l-4.72-4.72m0 0l4.72-4.72M2 9.17h18a2 2 0 012 2v10.99" />
                      </svg>
                    </button>
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
