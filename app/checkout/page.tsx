"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, Verified } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

  const [formData, setFormData] = useState({
    name: 'Abhishek Dixit',
    email: 'abhishek@example.com',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.dataset.field!]: e.target.value });
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulatePayment = () => {
    setLoading(true);
    setTimeout(() => {
      clearCart();
      router.push('/order-confirmation?order_id=ORD-' + Math.floor(Math.random() * 1000000));
    }, 2000);
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-8 pb-24">
      {/* Premium minimal header for checkout */}
      <div className="max-w-5xl mx-auto px-4 mb-8 flex justify-center">
        <Image src="/logos/primary.png" alt="Petopia" width={120} height={40} className="object-contain" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-4 mb-12 relative max-w-lg mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 translate-y-[-50%]"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-[#1A7D80] -z-10 translate-y-[-50%] transition-all duration-500`} style={{ width: step === 1 ? '50%' : '100%' }}></div>
          
          <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#1A7D80]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#1A7D80] text-white shadow-md' : 'bg-gray-200'}`}>1</div>
            <span className="text-xs font-bold uppercase tracking-wider bg-gray-50 px-2">Shipping</span>
          </div>
          
          <div className="flex-1"></div>
          
          <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#1A7D80]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#1A7D80] text-white shadow-md' : 'bg-gray-200'}`}>2</div>
            <span className="text-xs font-bold uppercase tracking-wider bg-gray-50 px-2">Payment</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Area */}
          <div className="lg:w-2/3">
            {step === 1 && (
              <form id="shipping-form" onSubmit={handleContinueToPayment} className="bg-white p-8 md:p-10 rounded-3xl shadow-premium border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="font-primary text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4 flex items-center gap-3">
                  Shipping Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input required type="text" data-field="name" value={formData.name} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input required type="email" data-field="email" value={formData.email} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
                  <input required type="text" data-field="address" value={formData.address} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" placeholder="Flat, House no., Building, Company, Apartment" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Town/City</label>
                    <input required type="text" data-field="city" value={formData.city} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input required type="text" data-field="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" pattern="[0-9]{6}" title="6 digit pincode" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <select required data-field="state" value={formData.state} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50">
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input required type="tel" data-field="phone" value={formData.phone} onChange={handleInputChange} className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#1A7D80] focus:ring-[#1A7D80] px-4 py-3 border bg-gray-50/50" placeholder="+91" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#1A7D80] hover:bg-teal-800 text-white font-bold py-4 rounded-xl transition-premium shadow-premium flex items-center justify-center gap-2 text-lg">
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-premium border border-gray-100 animate-in fade-in duration-500">
                 <h2 className="font-primary text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lock className="w-6 h-6 text-[#1A7D80]" /> Secure Payment
                </h2>
                
                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Ship to:</h3>
                    <button onClick={()=>setStep(1)} className="text-sm font-semibold text-[#1A7D80] hover:underline">Edit</button>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {formData.name}<br/>
                    {formData.address}<br/>
                    {formData.city}, {formData.state} {formData.pincode}<br/>
                    {formData.phone}
                  </p>
                </div>

                <div className="p-8 border-2 border-green-500 bg-green-50 rounded-2xl text-center mb-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                    <Verified className="w-3 h-3" /> Razorpay Verified
                  </div>
                  <h3 className="text-2xl font-primary font-bold text-gray-900 mb-2">₹{cartTotal().toFixed(2)}</h3>
                  <p className="text-green-800 text-sm font-medium">All prices inclusive of GST. Free Shipping.</p>
                </div>

                <button 
                  onClick={handleSimulatePayment}
                  disabled={loading}
                  className="w-full bg-[#1C1C1C] hover:bg-black text-white font-bold py-5 rounded-xl transition-premium shadow-premium flex items-center justify-center gap-2 text-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                       <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span> Processing...
                    </span>
                  ) : "Pay Now securely"}
                </button>
                <p className="text-center text-xs text-gray-400 mt-6 font-medium flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" /> SSL Encrypted Checkout
                </p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-10">
              <h2 className="font-primary text-xl font-bold mb-6">Order Details</h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 relative">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                       <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                         {item.quantity}
                       </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{item.name}</h4>
                      <div className="text-xs text-gray-500 mt-1">₹{item.price.toFixed(2)} each</div>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-wide text-xs">Free</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-lg">
                <span className="font-primary font-bold text-gray-900">Total</span>
                <span className="font-primary font-bold text-2xl text-[#1A7D80]">₹{cartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            {/* Money back guarantee widget */}
            <div className="mt-6 flex gap-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl items-start">
               <ShieldCheck className="w-8 h-8 text-[#F2A65A] flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-gray-900 text-sm mb-1">30-Day Guarantee</h4>
                 <p className="text-xs text-gray-600 leading-relaxed">If you or your dog aren't fully satisfied, return it within 30 days for a full refund. No questions asked.</p>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
