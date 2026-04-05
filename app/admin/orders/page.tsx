"use client";
import { useState } from "react";
import { Eye } from "lucide-react";

// Mock Orders Data
const mockOrders = [
  { id: "ORD-123456", customer: "John Doe", total: 1398, status: "paid", date: "2023-10-01", items: 2 },
  { id: "ORD-234567", customer: "Jane Smith", total: 499, status: "pending", date: "2023-10-02", items: 1 },
  { id: "ORD-345678", customer: "Raj Kumar", total: 2497, status: "shipped", date: "2023-10-03", items: 3 },
];

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-3xl font-primary font-bold mb-8 text-gray-900">Recent Orders</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total (₹)</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-mono font-medium text-gray-900">{order.id}</td>
                  <td className="p-4 text-sm text-gray-700">{order.customer}</td>
                  <td className="p-4 text-sm text-gray-500">{order.date}</td>
                  <td className="p-4 text-sm text-gray-500">{order.items}</td>
                  <td className="p-4 text-sm font-semibold text-gray-900">{order.total.toFixed(2)}</td>
                  <td className="p-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-gray-400 hover:text-[#1A7D80] transition-colors p-1" title="View details">
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
  );
}
