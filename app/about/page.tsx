import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Users, Leaf } from 'lucide-react';
import { getPageImage } from '@/lib/getPageImage';

export const metadata = {
  title: 'About PetopiaCare | Pet Products & Education',
  description: "Learn about PetopiaCare - India's trusted source for premium dog products and expert pet care education.",
};

export default async function AboutPage() {
  const [heroImg, missionImg, ctaImg] = await Promise.all([
    getPageImage('happy dog owner family india outdoor', 'default'),
    getPageImage('dog harness collar india premium', 'breed'),
    getPageImage('dog leash walking park india', 'default'),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-forest-500 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImg}
            alt="Happy dog with owner"
            fill
            className="object-cover opacity-25"
            unoptimized
            priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-primary-400 font-bold uppercase tracking-[0.12em] text-[11px] mb-4">Our Story</span>
          <h1 className="font-display font-bold italic text-white text-display-md md:text-display-lg mb-5">About PetopiaCare</h1>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            India&apos;s trusted destination for premium dog products and expert pet care education
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20" id="mission">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-label-sm font-medium text-primary-500 uppercase tracking-widest mb-3">Why We Started</span>
              <h2 className="text-display-sm font-display text-neutral-900 mb-4">Our Mission</h2>
              <p className="text-body-lg text-neutral-700 mb-4">
                At PetopiaCare, we believe every dog deserves premium care. Founded by passionate dog parents, we started with a simple goal: provide India with high-quality pet products and reliable pet care education.
              </p>
              <p className="text-body-lg text-neutral-700 mb-6">
                We&apos;ve grown from a small pet shop in Indirapuram to serving thousands of dog parents across NCR and India. Today, we offer:
              </p>
              <ul className="space-y-3">
                {[
                  'Premium dog products (harnesses, leashes, beds, grooming tools)',
                  'Expert pet care guides and educational content',
                  'Dog training resources and behavioral tips',
                  'Personalized pet care consultation',
                  'Dog boarding services in Indirapuram',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-body-md text-neutral-700">
                    <span className="text-success-500 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={missionImg}
                alt="Happy dog wearing PetopiaCare harness"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-50 py-20" id="values">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-label-sm font-medium text-primary-500 uppercase tracking-widest mb-3">What We Stand For</span>
            <h2 className="text-display-sm font-display text-neutral-900">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, color: 'text-error-500', bg: 'bg-error-50', title: 'Pet-Centric', desc: "Every product is chosen with your dog's health, comfort, and happiness in mind." },
              { icon: Shield, color: 'text-primary-600', bg: 'bg-primary-50', title: 'Quality & Safety', desc: 'We only stock products that meet strict safety and quality standards.' },
              { icon: Users, color: 'text-info-500', bg: 'bg-info-50', title: 'Community First', desc: 'We support Indian dog parents with local expertise and personalized care.' },
              { icon: Leaf, color: 'text-success-600', bg: 'bg-success-50', title: 'Sustainability', desc: 'We prioritize eco-friendly products and sustainable business practices.' },
            ].map(({ icon: Icon, color, bg, title, desc }, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={24} className={color} />
                </div>
                <h3 className="text-heading-sm font-display text-neutral-900 mb-2">{title}</h3>
                <p className="text-body-md text-neutral-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" id="why">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-display-sm font-display text-neutral-900 mb-12">Why Choose PetopiaCare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '1000+', text: 'Happy pet parents across India trust us' },
              { num: '50+', text: 'Expert guides on pet care, training, and health' },
              { num: '100+', text: 'Premium products tested by our own dogs' },
              { num: '₹0', text: 'Free shipping on orders above ₹999' },
              { num: '24/7', text: 'Customer support for all your pet questions' },
              { num: '30 Days', text: 'Money-back guarantee on all products' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all group">
                <p className="text-display-sm font-display text-primary-600 mb-2 group-hover:text-primary-700 transition-colors">{item.num}</p>
                <p className="text-body-md text-neutral-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-neutral-50 py-20" id="team">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-label-sm font-medium text-primary-500 uppercase tracking-widest mb-3">The People Behind It</span>
            <h2 className="text-display-sm font-display text-neutral-900">Meet Our Team</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Abhishek & Neha', role: 'Co-Founders & Show Runners', bio: 'Dog lovers, designers, and builders. Passionate about creating products that dogs love.', img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80' },
              { name: 'Our Dogs', role: 'Chief Product Testers', bio: 'Every product we sell has been tested and approved by our furry quality-control team.', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=400&q=80' },
              { name: 'Community', role: 'Our Strength', bio: 'Thousands of pet parents helping us build the best pet care resource in India.', img: 'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&q=80' },
            ].map((member, i) => (
              <div key={i} className="text-center">
                <div className="relative h-48 rounded-2xl mb-4 overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-heading-md font-display text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-label text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-body-md text-neutral-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with image bg */}
      <section className="relative bg-forest-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ctaImg}
            alt="Dog on leash"
            fill className="object-cover opacity-20" unoptimized
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display font-bold italic text-white text-display-sm md:text-display-md mb-4">Ready to give your dog the best?</h2>
          <p className="text-body-lg text-white/70 mb-8">Explore our premium products and expert care guides</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-md">Shop Products</Link>
            <Link href="/blog" className="border-2 border-white/40 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-all">Read Guides</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
