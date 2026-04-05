export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="font-primary text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-teal max-w-none text-gray-700">
        <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1A7D80]">1. Introduction</h2>
        <p className="mb-4">At PetopiaCare, we value your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website.</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1A7D80]">2. The Data We Collect</h2>
        <p className="mb-4">We may collect, use, store and transfer different kinds of personal data about you, including Identity Data (first name, last name), Contact Data (billing address, delivery address, email, phone number), and Transaction Data (details about payments and orders).</p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-[#1A7D80]">3. How We Use Your Personal Data</h2>
        <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we use it to perform the contract we are about to enter into or have entered into with you (processing your order).</p>
      </div>
    </div>
  );
}
