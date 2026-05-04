import { ShieldCheck } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-10 md:p-16">
          <h1 className="font-display text-display-md font-semibold text-neutral-900 mb-10">Refund Policy</h1>

          <div className="flex gap-4 p-6 bg-success-50 border border-success-100 rounded-xl items-start mb-10">
            <ShieldCheck className="w-8 h-8 text-success-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-heading-lg font-semibold text-neutral-900 mb-2">30-Day Money-Back Guarantee</h2>
              <p className="text-body-lg text-neutral-700">We want you and your pet to be completely satisfied with your purchase. If you are not entirely happy, we offer a 30-day money-back guarantee.</p>
            </div>
          </div>

          <div className="space-y-4 mb-10">
            {[
              "Items must be returned within 30 days of receipt.",
              "Items must be unused, in the same condition you received them, and in the original packaging.",
              "For hygienic reasons, opened pet food or chewed toys cannot be returned unless defective.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg">
                <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm mt-0.5">{i + 1}</div>
                <p className="text-body-md text-neutral-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-8">
            <h3 className="font-display text-heading-md font-semibold text-neutral-900 mb-3">How to Start a Return</h3>
            <p className="text-body-md text-neutral-600">
              Please contact our support team at{" "}
              <a href="mailto:hello@petopiacare.in" className="text-primary-600 font-medium hover:underline">hello@petopiacare.in</a>{" "}
              with your order number. Once approved, we will provide a return shipping address and issue a full refund to your original payment method within 5–7 business days of receiving the item.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
