"use client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-XXXXXX";

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-16 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="w-20 h-20 text-[#1A7D80]" />
      </div>
      <h1 className="font-primary text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank you for your order!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Order Number: <span className="font-mono font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-md">{orderId}</span>
      </p>
      
      <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-6 mb-10 text-left">
        <p className="text-gray-700 mb-2">Check your email for order confirmation and a detailed receipt.</p>
        <p className="font-medium text-[#1A7D80]">Estimated delivery: 5-7 business days</p>
      </div>

      <Link href="/products" className="inline-block bg-[#F2A65A] hover:bg-orange-500 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-md">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Suspense fallback={<div className="text-center py-20 font-bold">Loading...</div>}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
}
