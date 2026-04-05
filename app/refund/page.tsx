export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="font-primary text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
      <div className="prose prose-teal max-w-none text-gray-700 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mt-4 mb-4 text-[#1A7D80]">30-Day Money-Back Guarantee</h2>
        <p className="mb-4 text-lg">We want you and your pet to be completely satisfied with your purchase. If you are not entirely happy, we offer a 30-day money-back guarantee.</p>
        
        <ul className="list-disc pl-6 space-y-3 mb-8 text-lg">
          <li>Items must be returned within 30 days of receipt.</li>
          <li>Items must be unused, in the same condition you received them, and in the original packaging.</li>
          <li>For hygienic reasons, opened pet food or chewed toys cannot be returned unless defective.</li>
        </ul>
        
        <h3 className="text-xl font-bold mb-3">How to Start a Return</h3>
        <p className="text-lg">Please contact our support team at <strong>hello@petopiacare.in</strong> with your order number. Once approved, we will provide a return shipping address and issue a full refund to your original payment method within 5-7 business days of receiving the item.</p>
      </div>
    </div>
  );
}
