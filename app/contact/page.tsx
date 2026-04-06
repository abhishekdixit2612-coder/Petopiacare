'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-r from-teal-50 to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Have questions? We're here to help. Reach out anytime.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Info</h2>

              <div className="mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <Phone size={24} className="text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Call & WhatsApp</h3>
                    <a
                      href="tel:+919667742377"
                      className="text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      +91 9667742377
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Available: Mon-Sun, 9 AM - 9 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-3">
                  <Mail size={24} className="text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Email</h3>
                    <a
                      href="mailto:support@petopiacare.in"
                      className="text-teal-600 hover:text-teal-700 font-semibold"
                    >
                      support@petopiacare.in
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Response within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-start gap-3">
                  <MapPin size={24} className="text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Location</h3>
                    <p className="text-gray-700">Indirapuram</p>
                    <p className="text-gray-700">Ghaziabad, NCR</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Visit us for dog boarding & consultation
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <Clock size={24} className="text-teal-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">Hours</h3>
                    <p className="text-gray-700">Mon-Sun: 9 AM - 9 PM</p>
                    <p className="text-gray-700">Holidays: 10 AM - 6 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  ✓ Thanks for reaching out! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <p className="text-sm text-gray-600 mt-4 text-center">
                Or message us directly on WhatsApp: +91 9667742377
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick FAQ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  q: 'What are your shipping times?',
                  a: 'We ship within 24-48 hours. Delivery in NCR: 2-3 days. Pan-India: 5-7 days.',
                },
                {
                  q: 'Do you have a return policy?',
                  a: '30-day money-back guarantee on all products. No questions asked.',
                },
                {
                  q: 'Can I get a refund?',
                  a: 'Yes! Return the product within 30 days for a full refund.',
                },
                {
                  q: 'Do you offer dog boarding?',
                  a: 'Yes! Premium dog boarding available in Indirapuram. Call us for details.',
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
                  <p className="text-gray-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
