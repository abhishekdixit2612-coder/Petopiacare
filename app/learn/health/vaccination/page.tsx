import type { Metadata } from 'next';
import BreadcrumbNav from '@/components/learn/BreadcrumbNav';
import DoAndDontsList from '@/components/learn/DoAndDontsList';
import ComparisonTable from '@/components/learn/ComparisonTable';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Dog Vaccination Schedule India — Complete Guide',
  description: 'Complete vaccination schedule for Indian dogs — puppy vaccines (6–16 weeks), adult boosters, and senior considerations with core and non-core vaccines.',
};

const SCHEDULE_TABLE = [
  { name: '6 weeks',  properties: { Vaccines: 'Distemper, Parvovirus (optional early start)', Type: 'Core', Notes: 'Only if puppies at high risk; mother\'s antibodies may interfere' } },
  { name: '8–9 weeks', properties: { Vaccines: 'DHPPi (5-in-1)', Type: 'Core', Notes: 'First full dose — Distemper, Hepatitis, Parvovirus, Parainfluenza' } },
  { name: '12 weeks', properties: { Vaccines: 'DHPPi booster + Rabies', Type: 'Core', Notes: 'Rabies required by law in India. Leptospirosis optional.' } },
  { name: '16 weeks', properties: { Vaccines: 'DHPPi final puppy dose', Type: 'Core', Notes: 'Completes primary series. Dog can socialise fully after this.' } },
  { name: '1 year',   properties: { Vaccines: 'DHPPi + Rabies booster', Type: 'Core', Notes: 'Annual booster. Add Leptospirosis if in monsoon-prone area.' } },
  { name: 'Annual (adult)', properties: { Vaccines: 'DHPPi annual booster', Type: 'Core', Notes: 'Rabies every 1 or 3 years depending on vaccine brand used.' } },
  { name: 'Senior (7+)', properties: { Vaccines: 'Vet assessment required', Type: 'Core/Modified', Notes: 'Titre testing may be used instead of blanket annual boosters for seniors.' } },
];

const CORE_VACCINES = [
  { name: 'Rabies', notes: 'Required by law in India. Fatal, zoonotic — no exceptions.' },
  { name: 'Distemper', notes: 'Attacks nervous system. Highly contagious, often fatal in puppies.' },
  { name: 'Parvovirus', notes: 'Common cause of puppy death in India. Survives in soil for a year.' },
  { name: 'Hepatitis (Adenovirus)', notes: 'Liver disease; included in combination DHPPi vaccine.' },
];

const NON_CORE = [
  { name: 'Leptospirosis', notes: 'Highly recommended in India, especially during monsoon. Zoonotic.' },
  { name: 'Kennel Cough (Bordetella)', notes: 'Recommended if dog visits boarding or dog parks.' },
  { name: 'Canine Coronavirus', notes: 'Low priority in India; discuss with vet.' },
];

const DOS = [
  'Keep a written vaccination record and take it to every vet visit',
  'Start the puppy series at 6–8 weeks from a reputable vet',
  'Complete the full primary series before allowing uncontrolled outdoor socialisation',
  'Vaccinate for Leptospirosis if you live in a monsoon-heavy area',
  'Book annual booster even if the dog seems healthy',
];

const DONTS = [
  'Skip vaccinations because the dog seems healthy — prevention is the entire point',
  'Allow unvaccinated puppies to visit parks, pet shops, or meet unknown dogs',
  'Vaccinate a sick or immunocompromised dog without vet guidance',
  'Assume that one puppy series provides lifelong immunity — annual boosters are required',
  'Ignore rabies vaccination — it is legally mandatory and 100% fatal',
];

const FAQ = [
  { q: 'Can I buy and give vaccines at home?', a: 'In India, some vaccines are available at pet shops, but vet-administered vaccines are strongly preferred. Improper storage or injection technique can render vaccines ineffective or unsafe. Always use a licensed vet.' },
  { q: 'What is the DHPPi vaccine?', a: 'DHPPi stands for Distemper, Hepatitis (Adenovirus), Parvovirus, and Parainfluenza. It\'s a combination vaccine given as a single injection. It may come as a 5-in-1 (DHPPiL with Leptospirosis) or 7-in-1.' },
  { q: 'How long after vaccination can my puppy go outside?', a: 'Full protection builds approximately 2 weeks after the final dose in the primary series (usually at 16 weeks). Until then, avoid public areas with unknown dogs. Carrying your puppy in your arms in low-risk areas is generally safe.' },
  { q: 'Do senior dogs still need annual vaccines?', a: 'Yes, though the protocol may change. Some vets use titre testing to check antibody levels in older dogs before giving blanket boosters. Discuss with your vet at age 7+.' },
];

export default function VaccinationPage() {
  return (
    <div className="space-y-10">
      <BreadcrumbNav items={[
        { label: 'Learn', href: '/learn' },
        { label: 'Health', href: '/learn/health-wellness' },
        { label: 'Vaccination Schedule' },
      ]} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white">
        <h1 className="font-display font-bold text-display-md mb-3">Vaccination Schedule for Dogs in India</h1>
        <p className="text-body-lg text-green-100 max-w-xl leading-relaxed">
          Vaccination is the single most important preventive health measure you can take for your dog.
          This guide covers the complete schedule from puppy to senior, specific to India.
        </p>
      </div>

      {/* Schedule table */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Age-by-Age Vaccination Schedule</h2>
        <ComparisonTable items={SCHEDULE_TABLE} />
      </section>

      {/* Core vaccines */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Core Vaccines (All Dogs Must Have)</h2>
        <div className="space-y-2">
          {CORE_VACCINES.map((v) => (
            <div key={v.name} className="flex gap-4 p-4 bg-green-50 border border-green-100 rounded-xl">
              <span className="w-5 h-5 bg-success-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">✓</span>
              </span>
              <div>
                <p className="font-semibold text-neutral-900 text-body-md">{v.name}</p>
                <p className="text-body-sm text-neutral-600">{v.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Non-core vaccines */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Non-Core Vaccines (Based on Risk)</h2>
        <div className="space-y-2">
          {NON_CORE.map((v) => (
            <div key={v.name} className="flex gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <span className="w-5 h-5 bg-warning-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">!</span>
              </span>
              <div>
                <p className="font-semibold text-neutral-900 text-body-md">{v.name}</p>
                <p className="text-body-sm text-neutral-600">{v.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-4">Vaccination Do&apos;s and Don&apos;ts</h2>
        <DoAndDontsList dos={DOS} donts={DONTS} />
      </section>

      {/* Questions to ask vet */}
      <section className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
        <h2 className="font-display font-bold text-heading-lg text-neutral-900 mb-4">Questions to Ask Your Vet</h2>
        <ul className="space-y-2">
          {[
            'Which combination vaccine brand do you use and what does it cover?',
            'Should I vaccinate for Leptospirosis given my area and lifestyle?',
            'What is your recommended Rabies booster interval — 1 or 3 years?',
            'At what age do you recommend titre testing instead of boosters for my senior dog?',
            'Do I need kennel cough vaccination if my dog attends a dog walker or boarding?',
          ].map((q) => (
            <li key={q} className="flex items-start gap-2 text-body-sm text-neutral-700">
              <span className="text-primary-500 flex-shrink-0 mt-0.5">→</span> {q}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display font-bold text-display-sm text-neutral-900 mb-6">Common Questions</h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <div key={item.q} className="bg-white border border-neutral-100 rounded-xl p-5">
              <p className="font-display font-semibold text-neutral-900 text-heading-sm mb-2">{item.q}</p>
              <p className="text-body-sm text-neutral-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
