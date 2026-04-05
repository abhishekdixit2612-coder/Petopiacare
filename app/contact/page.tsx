export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="font-primary text-4xl font-bold text-gray-900 mb-4">Contact <span className="text-[#F2A65A]">Us</span></h1>
        <p className="text-gray-600">Got questions? We're here to help you and your furry friends!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="font-primary text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-2 border" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-2 border" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows={4} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-2 border" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-[#1A7D80] text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-800 transition-colors">Send Message</button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-2xl flex flex-col justify-center text-center">
          <h2 className="font-primary text-2xl font-bold mb-6">Reach out Instantly</h2>
          <p className="text-gray-600 mb-8">Need immediate assistance? Chat with our support team on WhatsApp.</p>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="inline-flex justify-center items-center bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors shadow-lg">
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
