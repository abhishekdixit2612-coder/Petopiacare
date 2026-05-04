export default function TermsPage() {
  return (
    <div className="bg-neutral-50 min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-10 md:p-16">
          <h1 className="font-display text-display-md font-semibold text-neutral-900 mb-3">Terms &amp; Conditions</h1>
          <p className="text-body-md text-neutral-400 mb-10 pb-8 border-b border-neutral-100">
            Please read these terms carefully before using our services.
          </p>

          <div className="space-y-10 text-body-md text-neutral-700 leading-relaxed">
            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">1. Terms</h2>
              <p>By accessing the website at petopiacare.in, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            </section>

            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials on PetopiaCare&apos;s website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section>
              <h2 className="font-display text-heading-lg font-semibold text-primary-600 mb-4">3. Disclaimer</h2>
              <p>The materials on PetopiaCare&apos;s website are provided on an &apos;as is&apos; basis. PetopiaCare makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
