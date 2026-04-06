import Image from 'next/image';
import Link from 'next/link';
import { Heart, Shield, Users, Leaf } from 'lucide-react';

export const metadata = {
  title: 'About PetopiaCare | Pet Products & Education',
  description: 'Learn about PetopiaCare - India\'s trusted source for premium dog products and expert pet care education.',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About PetopiaCare
          </h1>
          <p className="text-xl text-gray-600">
            India&apos;s trusted destination for premium dog products and expert pet care education
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                At PetopiaCare, we believe every dog deserves premium care. Founded by passionate dog parents, we started with a simple goal: provide India with high-quality pet products and reliable pet care education.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                We&apos;ve grown from a small pet shop in Indirapuram to serving thousands of dog parents across NCR and India. Today, we offer:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Premium dog products (harnesses, leashes, beds, grooming tools)</li>
                <li>✅ Expert pet care guides and educational content</li>
                <li>✅ Dog training resources and behavioral tips</li>
                <li>✅ Personalized pet care consultation</li>
                <li>✅ Dog boarding services in Indirapuram</li>
              </ul>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/hero-bg.jpg"
                alt="About PetopiaCare"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow">
              <Heart size={32} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Pet-Centric Approach
              </h3>
              <p className="text-gray-700">
                Every product is chosen with your dog&apos;s health, comfort, and happiness in mind.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <Shield size={32} className="text-teal-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Quality & Safety
              </h3>
              <p className="text-gray-700">
                We only stock products that meet strict safety and quality standards.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <Users size={32} className="text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community First
              </h3>
              <p className="text-gray-700">
                We support Indian dog parents with local expertise and personalized care.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow">
              <Leaf size={32} className="text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sustainability
              </h3>
              <p className="text-gray-700">
                We prioritize eco-friendly products and sustainable business practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Why Choose PetopiaCare?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: '1000+',
                text: 'Happy pet parents across India trust us',
              },
              {
                num: '50+',
                text: 'Expert guides on pet care, training, and health',
              },
              {
                num: '100+',
                text: 'Premium products tested by our own dogs',
              },
              {
                num: '₹0',
                text: 'Free shipping on orders above ₹999',
              },
              {
                num: '24/7',
                text: 'Customer support for all your pet questions',
              },
              {
                num: '30 Days',
                text: 'Money-back guarantee on all products',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-6 border rounded-lg hover:shadow-lg transition"
              >
                <p className="text-4xl font-bold text-teal-600 mb-2">
                  {item.num}
                </p>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Abhishek & Neha',
                role: 'Co-Founders & Show Runners',
                bio: 'Dog lovers, designers, and builders. Passionate about creating products that dogs love.',
              },
              {
                name: 'Our Dogs',
                role: 'Product Testers',
                bio: 'Every product we sell has been tested and approved by our furry team members.',
              },
              {
                name: 'Community',
                role: 'Our Strength',
                bio: 'Thousands of pet parents helping us build the best pet care resource in India.',
              },
            ].map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-gradient-to-b from-teal-200 to-blue-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <p className="text-6xl">🐕</p>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-teal-600 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to give your dog the best care?
          </h2>
          <p className="text-lg mb-8">
            Explore our collection of premium products and expert guides
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/products"
              className="bg-white text-teal-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Shop Products
            </Link>
            <Link
              href="/blog"
              className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-teal-600 transition"
            >
              Read Guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
