"use client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-XXXXXX";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-success-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14 text-success-500" />
        </div>
      </div>
      <h1 className="font-display text-display-sm text-neutral-900 mb-4">Thank you for your order!</h1>
      <p className="text-body-lg text-neutral-600 mb-8">
        Order Number:{' '}
        <span className="font-mono font-semibold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-md">
          {orderId}
        </span>
      </p>

      <div className="max-w-md mx-auto bg-primary-50 border border-primary-200 rounded-xl p-6 mb-10 text-left">
        <p className="text-body-md text-neutral-700 mb-2">
          Check your email for order confirmation and a detailed receipt.
        </p>
        <p className="font-medium text-primary-600 text-body-md">Estimated delivery: 5–7 business days</p>
      </div>

      <Link
        href="/products"
        className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-md text-body-lg"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <Suspense fallback={<div className="text-center py-20 text-body-lg font-medium text-neutral-600">Loading...</div>}>
        <OrderConfirmationContent />
      </Suspense>
    </div>
  );
}
