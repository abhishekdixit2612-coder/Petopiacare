import Link from 'next/link';

export const metadata = {
  title: 'FAQ | PetopiaCare',
  description: 'Frequently asked questions about shipping, returns, products, and pet care support at PetopiaCare.',
};

export default function FAQPage() {
  return (
    <main className="bg-neutral-50 min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-label font-medium text-primary-600 uppercase tracking-widest mb-4">Support</span>
          <h1 className="text-display-md font-display text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-body-lg text-neutral-600 max-w-2xl mx-auto">
            Quick answers to common questions about orders, shipping, returns, digital products, and pet care support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              question: 'What are your shipping times?',
              answer: 'We ship within 24–48 hours. Delivery in NCR is usually 2–3 days, and pan-India delivery usually takes 5–7 days depending on your location.',
            },
            {
              question: 'Do you offer returns and refunds?',
              answer: 'Yes, we offer a 30-day money-back guarantee on most products. If your product is damaged or not as described, reach out to support and we will help you process the return.',
            },
            {
              question: 'How do I access free digital downloads?',
              answer: 'Visit our Digital Products page and select the free guide you want. Free downloads are available instantly after clicking the product and following the download instructions.',
            },
            {
              question: 'Can I use homemade recipes for my dog?',
              answer: 'Yes, our blog includes safe, budget-friendly homemade dog food recipes designed for Indian dogs. Always avoid toxic ingredients like onions, garlic, chocolate, grapes, and avocado.',
            },
            {
              question: 'How can I contact customer support?',
              answer: 'You can call or WhatsApp us at +91 9667742377, or email support@petopiacare.in. We aim to respond within 24 hours.',
            },
            {
              question: 'Do you provide dog boarding or consultation?',
              answer: 'Yes, we offer dog boarding and personalized pet care consultations in Indirapuram, Ghaziabad. Contact us to book a visit or consultation.',
            },
          ].map((item, i) => (
            <section key={i} className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all">
              <h2 className="text-heading-md font-display text-neutral-900 mb-3">{item.question}</h2>
              <p className="text-body-md text-neutral-600 leading-relaxed">{item.answer}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 p-10 text-white shadow-lg">
          <h2 className="text-display-sm font-display mb-3">Still have questions?</h2>
          <p className="text-body-lg text-primary-100 max-w-2xl mb-6">
            Reach out to our team any time via WhatsApp or email. We&apos;re here to help you and your pet find the best products, support, and care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="https://wa.me/919667742377"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-primary-600 font-medium shadow-md hover:bg-neutral-50 transition-all"
            >
              Message on WhatsApp
            </Link>
            <Link
              href="mailto:support@petopiacare.in"
              className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 text-white font-medium hover:bg-white/10 transition-all"
            >
              Email Support
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
