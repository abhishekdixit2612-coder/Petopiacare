export default function PrivacyPolicyPage() {
  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-10 md:p-16">
          <h1 className="font-display text-display-md font-semibold text-neutral-900 mb-3">Privacy Policy</h1>
          <p className="text-body-md text-neutral-400 mb-10 pb-8 border-b border-neutral-100">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-10 text-body-md text-neutral-700 leading-relaxed">
            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">1. Introduction</h2>
              <p>At PetopiaCare, we value your privacy and are committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website.</p>
            </section>

            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">2. The Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you, including Identity Data (first name, last name), Contact Data (billing address, delivery address, email, phone number), and Transaction Data (details about payments and orders).</p>
            </section>

            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">3. How We Use Your Personal Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we use it to perform the contract we are about to enter into or have entered into with you (processing your order).</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
