'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/Button';
import Image from 'next/image';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  const inputClass = 'w-full px-4 py-3 border border-neutral-300 rounded-lg text-body-md text-neutral-900 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-neutral-400';

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-forest-500 py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=1400&q=80"
            alt="Dog looking up at owner"
            fill className="object-cover opacity-20" unoptimized priority
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-primary-400 font-bold uppercase tracking-[0.12em] text-[11px] mb-4">We&apos;d love to hear from you</span>
          <h1 className="font-display font-bold italic text-white text-display-md md:text-display-lg mb-4">Get in Touch</h1>
          <p className="text-body-lg text-white/70">Have questions? We&apos;re here to help. Reach out anytime.</p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Info */}
            <div className="md:col-span-1">
              <h2 className="text-display-sm font-display text-neutral-900 mb-8">Contact Info</h2>

              {[
                {
                  Icon: Phone, title: 'Call & WhatsApp',
                  content: <a href="tel:+919667742377" className="text-primary-600 hover:text-primary-700 font-medium">+91 9667742377</a>,
                  sub: 'Available: Mon-Sun, 9 AM – 9 PM',
                },
                {
                  Icon: Mail, title: 'Email',
                  content: <a href="mailto:support@petopiacare.in" className="text-primary-600 hover:text-primary-700 font-medium">support@petopiacare.in</a>,
                  sub: 'Response within 24 hours',
                },
                {
                  Icon: MapPin, title: 'Location',
                  content: <p className="text-neutral-700">Indirapuram, Ghaziabad, NCR</p>,
                  sub: 'Visit us for boarding & consultation',
                },
                {
                  Icon: Clock, title: 'Hours',
                  content: <p className="text-neutral-700">Mon–Sun: 9 AM – 9 PM</p>,
                  sub: 'Holidays: 10 AM – 6 PM',
                },
              ].map(({ Icon, title, content, sub }, i) => (
                <div key={i} className="mb-7">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 text-body-md mb-0.5">{title}</h3>
                      {content}
                      <p className="text-body-sm text-neutral-500 mt-1">{sub}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <h2 className="text-display-sm font-display text-neutral-900 mb-6">Send us a Message</h2>

              {success && (
                <div className="bg-success-50 border border-success-500 text-success-700 px-4 py-3 rounded-lg mb-6 text-body-md flex items-center gap-2">
                  <span>✓</span> Thanks for reaching out! We&apos;ll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className={inputClass} />
                  <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="tel" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                  <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className={inputClass} />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`${inputClass} resize-none`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-300 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 text-body-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Sending...
                    </span>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
              <p className="text-body-sm text-neutral-500 mt-4 text-center">
                Or message us directly on WhatsApp: +91 9667742377
              </p>
            </div>
          </div>

          {/* Quick FAQ */}
          <div className="bg-neutral-50 rounded-xl p-8 border border-neutral-200">
            <h2 className="text-display-sm font-display text-neutral-900 mb-6">Quick FAQ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { q: 'What are your shipping times?', a: 'We ship within 24–48 hours. NCR: 2–3 days. Pan-India: 5–7 days.' },
                { q: 'Do you have a return policy?', a: '30-day money-back guarantee on all products. No questions asked.' },
                { q: 'Can I get a refund?', a: 'Yes! Return the product within 30 days for a full refund.' },
                { q: 'Do you offer dog boarding?', a: 'Yes! Premium dog boarding available in Indirapuram. Call us for details.' },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="font-medium text-neutral-900 text-body-lg mb-1">{item.q}</h3>
                  <p className="text-body-md text-neutral-600">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
