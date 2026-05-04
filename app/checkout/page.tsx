"use client";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";

const inputClass =
  "w-full border border-neutral-300 rounded-lg px-4 py-3 text-body-md text-neutral-900 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all";

function getImageSrc(url: string): string {
  if (!url) return "";
  let match = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200`;
  match = url.match(/drive\.google\.com\/uc[^?]*\?.*[?&]id=([^&]+)/);
  if (match) return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w200`;
  return url;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Puducherry",
];

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.dataset.field!]: e.target.value });
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Create Razorpay order on server
      const orderRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: cartTotal(),
          receipt: `rcpt_${Date.now()}`,
          notes: { customer_name: formData.name, customer_email: formData.email },
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to create payment order. Try again.");
      }

      // 2. Load Razorpay checkout script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Payment gateway failed to load. Check your internet connection.");
      }

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "PetopiaCare",
        description: `${items.length} item${items.length !== 1 ? "s" : ""} — Premium Dog Gear`,
        image: "/logos/primary.png",
        order_id: orderData.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Save order to Supabase after successful payment
          try {
            const saveRes = await fetch("/api/save-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                total_amount: cartTotal(),
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                shipping_address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                cart_items: items,
              }),
            });
            const saveData = await saveRes.json();
            if (!saveRes.ok || saveData.error) {
              throw new Error(saveData.error || "Failed to save order.");
            }
            clearCart();
            router.push(`/order-confirmation?order_id=${saveData.order_id}`);
          } catch (saveErr) {
            setError(
              "Payment was received but order saving failed. Please contact support with your payment ID: " +
                response.razorpay_payment_id
            );
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          shipping_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
        },
        theme: { color: "#2B7A8F" },
        modal: {
          ondismiss: () => { setLoading(false); },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="bg-neutral-50 min-h-screen pt-8 pb-24">
      {/* Minimal header */}
      <div className="max-w-5xl mx-auto px-4 mb-8 flex justify-center">
        <Image
          src="/logos/primary.png"
          alt="PetopiaCare"
          width={120}
          height={40}
          className="object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-4 mb-12 relative max-w-lg mx-auto">
          <div className="absolute top-4 left-0 w-full h-0.5 bg-neutral-200 -z-10" />
          <div
            className="absolute top-4 left-0 h-0.5 bg-primary-500 -z-10 transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
          {[{ label: "Shipping", n: 1 }, { label: "Payment", n: 2 }].map(({ label, n }) => (
            <div
              key={n}
              className={`flex flex-col items-center gap-2 ${step >= n ? "text-primary-600" : "text-neutral-400"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-label ${
                  step >= n ? "bg-primary-500 text-white shadow-md" : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {n}
              </div>
              <span className="text-label-sm font-medium uppercase tracking-wider bg-neutral-50 px-2">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Area */}
          <div className="lg:w-2/3">
            {step === 1 && (
              <form
                onSubmit={handleContinueToPayment}
                className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-neutral-100"
              >
                <h2 className="font-display text-display-sm text-neutral-900 mb-8 border-b border-neutral-100 pb-4">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      data-field="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">Email Address</label>
                    <input
                      required
                      type="email"
                      data-field="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-label font-medium text-neutral-700 mb-2">Street Address</label>
                  <input
                    required
                    type="text"
                    data-field="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat / House no., Building, Street"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">Town / City</label>
                    <input
                      required
                      type="text"
                      data-field="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">Pincode</label>
                    <input
                      required
                      type="text"
                      data-field="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      pattern="[0-9]{6}"
                      title="6-digit pincode"
                      placeholder="6-digit pincode"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">State</label>
                    <select
                      required
                      data-field="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-label font-medium text-neutral-700 mb-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      data-field="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      pattern="[0-9+\s]{10,13}"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-4 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 text-body-lg"
                >
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-neutral-100">
                <h2 className="font-display text-display-sm text-neutral-900 mb-6 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary-500" /> Secure Payment
                </h2>

                {error && (
                  <div className="mb-6 rounded-xl border border-error-200 bg-error-50 p-4 text-body-sm text-error-700">
                    {error}
                  </div>
                )}

                {/* Shipping summary */}
                <div className="bg-neutral-50 p-5 rounded-xl mb-6 border border-neutral-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-neutral-900 text-body-md">Delivering to</h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-body-sm font-medium text-primary-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-neutral-600 text-body-sm leading-relaxed">
                    <span className="font-medium text-neutral-900">{formData.name}</span>
                    <br />
                    {formData.address}
                    <br />
                    {formData.city}, {formData.state} — {formData.pincode}
                    <br />
                    {formData.phone}
                  </p>
                </div>

                {/* Amount */}
                <div className="p-6 border-2 border-primary-200 bg-primary-50 rounded-xl text-center mb-8">
                  <p className="text-label font-medium text-primary-600 uppercase tracking-wider mb-1">
                    Order Total
                  </p>
                  <p className="font-display text-display-sm font-bold text-neutral-900">
                    ₹{cartTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-body-sm text-neutral-500 mt-1">
                    Incl. all taxes · Free shipping
                  </p>
                </div>

                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full bg-neutral-900 hover:bg-black text-white font-medium py-5 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-body-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Opening Payment...
                    </>
                  ) : (
                    <>Pay ₹{cartTotal().toLocaleString("en-IN")} via Razorpay</>
                  )}
                </button>

                <p className="text-center text-label-sm text-neutral-400 mt-4 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3" /> 256-bit SSL · Powered by Razorpay
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 sticky top-10">
              <h2 className="font-display text-heading-lg text-neutral-900 font-semibold mb-5 border-b border-neutral-100 pb-4">
                Order Summary
              </h2>
              <div className="space-y-4 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageSrc(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-neutral-900 leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-label-sm text-neutral-400 mt-0.5">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-body-sm font-semibold text-neutral-900 whitespace-nowrap">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3 text-body-sm text-neutral-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900">
                    ₹{cartTotal().toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 flex justify-between items-center">
                <span className="font-display font-semibold text-neutral-900 text-heading-sm">Total</span>
                <span className="font-display font-semibold text-display-sm text-primary-600">
                  ₹{cartTotal().toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl items-start">
              <ShieldCheck className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-900 text-body-sm mb-1">30-Day Guarantee</p>
                <p className="text-label-sm text-neutral-600 leading-relaxed">
                  Not satisfied? Return within 30 days for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
