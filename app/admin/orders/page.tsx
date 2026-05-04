"use client";
import Link from "next/link";
import { Eye, ArrowLeft } from "lucide-react";

const mockOrders = [
  { id: "ORD-123456", customer: "John Doe", total: 1398, status: "paid", date: "2023-10-01", items: 2 },
  { id: "ORD-234567", customer: "Jane Smith", total: 499, status: "pending", date: "2023-10-02", items: 1 },
  { id: "ORD-345678", customer: "Raj Kumar", total: 2497, status: "shipped", date: "2023-10-03", items: 3 },
];

const statusStyles: Record<string, string> = {
  paid: "bg-success-50 text-success-700",
  pending: "bg-warning-50 text-warning-700",
  shipped: "bg-info-50 text-info-700",
};

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 font-bold mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="font-display text-display-sm font-semibold text-neutral-900 mb-8">Recent Orders</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider border-b border-neutral-200">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Items</th>
                  <th className="p-4 font-semibold">Total (₹)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {mockOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 text-body-sm font-mono font-medium text-neutral-900">{order.id}</td>
                    <td className="p-4 text-body-sm text-neutral-700">{order.customer}</td>
                    <td className="p-4 text-body-sm text-neutral-500">{order.date}</td>
                    <td className="p-4 text-body-sm text-neutral-500">{order.items}</td>
                    <td className="p-4 text-body-sm font-semibold text-neutral-900">{order.total.toFixed(2)}</td>
                    <td className="p-4 text-body-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status] || 'bg-neutral-100 text-neutral-700'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="text-neutral-400 hover:text-primary-600 transition-colors p-1" title="View details">
                        <Eye className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
