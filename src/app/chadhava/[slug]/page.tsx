"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

interface Offering {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface ChadhavaRecord {
  _id: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroTitle?: string;
  content?: string;
  imageUrl?: string;
  location?: string;
  slug: string;
  offerings: Offering[];
  faqs: Faq[];
}

export default function ChadhavaDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [data, setData] = useState<ChadhavaRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Cart State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Review, 3: Completed
  const [userInfo, setUserInfo] = useState({ whatsapp: "", name: "" });

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/chadhava?slug=${slug}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const toggleOffering = (off: Offering) => {
    setCart((prev) => {
      const current = prev[off.id] || 0;
      if (current > 0) {
        const next = { ...prev };
        delete next[off.id];
        return next;
      }
      return { ...prev, [off.id]: 1 };
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: next };
    });
  };

  const selectedCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const selectedTotal = data?.offerings
    ? Object.entries(cart).reduce((total, [id, qty]) => {
        const off = data.offerings.find((o) => o.id === id);
        return total + (off?.price || 0) * qty;
      }, 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e915f]"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="text-center py-40">
          <h2 className="text-2xl font-bold text-gray-800">Chadhava offering not found</h2>
          <Link href="/chadhava" className="text-[#0e915f] font-bold mt-4 inline-block underline">Back to Chadhava</Link>
        </div>
      </div>
    );
  }

  // Final Review Booking UI
  if (step === 2) {
    const selectedItems = data.offerings.filter(o => cart[o.id]);
    const unselectedItems = data.offerings.filter(o => !cart[o.id]);

    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <Navbar />
        {/* Review Breadcrumbs */}
        <div className="bg-white border-b border-gray-100 py-3 px-6">
           <div className="mx-auto max-w-7xl flex items-center justify-between">
              <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-[#0e915f]">
                 <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-[#0e915f] text-white flex items-center justify-center text-[8px]">1</div> Add Details</div>
                 <div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-[#0e915f] text-white flex items-center justify-center text-[8px]">2</div> Review Booking</div>
                 <div className="flex items-center gap-2 opacity-30"><div className="h-5 w-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-[8px]">3</div> Make Payment</div>
                 <div className="flex items-center gap-2 opacity-30"><div className="h-5 w-5 rounded-full bg-gray-300 text-white flex items-center justify-center text-[8px]">4</div> View Certificate</div>
              </div>
           </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Left Column: Review Items */}
           <div className="lg:col-span-2 space-y-6">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-sm font-bold text-[#1f1f1f] hover:text-[#0e915f] transition-colors mb-6"
              >
                <i className="fa-solid fa-arrow-left"></i> Review Booking
              </button>

              <div className="space-y-4">
                 {selectedItems.map(item => (
                   <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className="font-bold text-[#1f1f1f]">{item.name}</h3>
                            <p className="text-gray-900 font-bold mt-1 text-sm">₹ {item.price}</p>
                         </div>
                         <div className="flex items-center gap-4 bg-[#0e915f] text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                            <button onClick={() => updateQuantity(item.id, -1)} className="hover:scale-125">-</button>
                            <span className="min-w-[12px] text-center">{cart[item.id]}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="hover:scale-125">+</button>
                         </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                         <div className="flex items-center gap-2 text-[#0e915f] text-[10px] font-bold">
                            <i className="fa-brands fa-whatsapp text-sm"></i>
                            <span>+{userInfo.whatsapp} (Your WhatsApp Number)</span>
                         </div>
                         <button onClick={() => setShowModal(true)} className="text-[10px] font-bold text-gray-400 italic hover:text-[#0e915f]">
                            ✏️ Edit
                         </button>
                      </div>
                   </div>
                 ))}
                 
                 <div className="bg-orange-50/50 rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:bg-orange-50 transition-colors">
                    <div className="flex items-center gap-3">
                       <span className="text-xl">🏷️</span>
                       <span className="font-bold text-sm text-[#1f1f1f]">Apply Coupon</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
                 </div>

                 <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-[#1f1f1f] mb-6">Bill details</h3>
                    <div className="space-y-4 text-sm font-medium text-gray-500">
                       {selectedItems.map(item => (
                         <div key={item.id} className="flex justify-between">
                            <span>{item.name}</span>
                            <span>₹ {item.price * cart[item.id]}.0</span>
                         </div>
                       ))}
                       <div className="pt-4 border-t border-gray-100 flex justify-between text-lg font-extrabold text-[#1f1f1f]">
                          <span>Total Amount</span>
                          <span>₹ {selectedTotal}.0</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Upsell Items */}
           <div>
              <h3 className="font-bold text-[#1f1f1f] mb-6">Add more offering items</h3>
              <div className="space-y-4">
                 {unselectedItems.map(item => (
                   <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4 group">
                      <div className="h-16 w-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                         <img src={item.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=200&q=80"} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-[13px] text-[#1f1f1f] truncate w-32">{item.name}</h4>
                         <p className="text-gray-400 text-[10px] mt-0.5">{item.description.slice(0, 30)}...</p>
                         <p className="text-[#0e915f] font-bold text-[13px] mt-1">₹ {item.price}</p>
                      </div>
                      <button 
                        onClick={() => toggleOffering(item)}
                        className="bg-white text-[#0e915f] border border-[#0e915f] h-8 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#0e915f] hover:text-white transition-all active:scale-95"
                      >
                         + Add
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Floating Cart Bar (Review Page) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:p-6 z-50">
           <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#0e915f] text-white p-4 rounded-2xl shadow-xl shadow-[#0e915f]/20">
              <div className="flex items-center gap-4 text-sm font-bold">
                 <span>{selectedCount} Offerings</span>
                 <span className="opacity-50">•</span>
                 <span>₹ {selectedTotal}</span>
              </div>
              <button 
                onClick={async () => {
                   setLoading(true);
                   try {
                      const res = await fetch("/api/auth/me");
                      const authData = await res.json();
                      
                      if (!authData.authenticated) {
                         const currentUrl = encodeURIComponent(window.location.href);
                         window.location.href = `/auth/login?callbackUrl=${currentUrl}`;
                         return;
                      }

                      // Proceed to payment
                      window.location.href = `/payment?amount=${selectedTotal}&type=chadhava&title=${encodeURIComponent(data.title)}`;
                   } catch (err) {
                      console.error(err);
                      alert("Authentication error. Please try again.");
                   } finally {
                      setLoading(false);
                   }
                }}
                className="flex items-center gap-2 font-bold hover:gap-4 transition-all uppercase tracking-widest text-sm"
              >
                 {loading ? "Checking Session..." : "Proceed to Payment"} <i className="fa-solid fa-arrow-right"></i>
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf9] pb-32">
      <Navbar />

      {/* Breadcrumbs */}
      <nav className="bg-[#fff5e9] py-3 px-6">
        <div className="mx-auto max-w-7xl text-[12px] font-medium text-gray-400 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
          <Link href="/chadhava" className="hover:text-gray-600">AstroVed Chadhava Seva</Link>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
          <span className="text-[#f47820] truncate max-w-[200px]">{data.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-12 lg:py-16 border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
             <img 
               src={data.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80"} 
               alt={data.title} 
               className="w-full h-[400px] object-cover"
             />
          </div>
          <div className="lg:pl-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1f1f1f] leading-tight mb-8">
              {data.heroTitle || data.title}
            </h1>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-10">
              {data.content ? <p>{data.content}</p> : <p>{data.description}</p>}
            </div>
            <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                   {[...Array(5)].map((_, i) => (
                     <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src={`https://i.pravatar.cc/32?u=${i}`} alt="user" /></div>
                   ))}
                </div>
                <p className="text-sm font-medium text-gray-700 leading-tight">
                   Till now <span className="text-[#f47820] font-extrabold">1,50,000+ Devotees</span> have participated in Chadhava conducted by AstroVed Chadhava Seva.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings Selector */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-[#1f1f1f] mb-12">Choose an offering</h2>
          
          <div className="space-y-6">
            {data.offerings.map((off) => {
              const qty = cart[off.id] || 0;
              return (
                <div key={off.id} className={`bg-white rounded-[20px] p-4 lg:p-5 flex flex-col md:flex-row items-center gap-6 border transition-all duration-300 ${qty > 0 ? 'border-[#0e915f] shadow-lg shadow-[#0e915f]/5' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-[#1f1f1f] mb-1 leading-snug">{off.name}</h3>
                    <p className="text-gray-400 text-[12px] mb-3 leading-relaxed">{off.description}</p>
                    <div className="text-xl font-bold text-[#0e915f]">₹ {off.price}</div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative h-20 w-28 rounded-xl overflow-hidden shadow-sm">
                      <img src={off.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80"} alt={off.name} className="w-full h-full object-cover" />
                    </div>
                    {qty === 0 ? (
                      <button 
                        onClick={() => toggleOffering(off)}
                        className="bg-white text-[#0e915f] border border-[#0e915f] px-8 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#0e915f] hover:text-white transition-all active:scale-95 flex items-center gap-2"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i> Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-4 bg-[#0e915f] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-[#0e915f]/20">
                         <button onClick={() => updateQuantity(off.id, -1)} className="hover:scale-125 transition-transform">−</button>
                         <span className="min-w-[20px] text-center">{qty}</span>
                         <button onClick={() => updateQuantity(off.id, 1)} className="hover:scale-125 transition-transform">+</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
           <h2 className="text-2xl font-bold text-[#1f1f1f] mb-12">Frequently asked Questions</h2>
           <div className="text-left space-y-4">
              {data.faqs.map((faq, i) => (
                <details key={i} className="group bg-white rounded-2xl p-6 border border-gray-100 transition-all cursor-pointer open:ring-1 open:ring-[#f47820]">
                  <summary className="flex items-center justify-between font-bold text-gray-900 group-open:text-[#f47820] list-none">
                     {faq.question}
                     <i className="fa-solid fa-chevron-down text-xs transition-transform group-open:rotate-180"></i>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed text-sm pr-10">{faq.answer}</p>
                </details>
              ))}
           </div>
        </div>
      </section>

      {/* Cart Bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 lg:p-6 z-50 animate-in slide-in-from-bottom duration-500">
           <div className="mx-auto max-w-7xl flex items-center justify-between bg-[#0e915f] text-white p-4 lg:p-5 rounded-[24px] shadow-2xl shadow-[#0e915f]/30">
              <div className="flex items-center gap-4 text-sm lg:text-base font-bold pl-4">
                 <span>{selectedCount} Offerings</span>
                 <span className="opacity-40">•</span>
                 <span>₹ {selectedTotal}</span>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all active:scale-95 group"
              >
                 Next <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
              </button>
           </div>
        </div>
      )}

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="p-8 pb-4 flex items-center gap-4">
                 <button onClick={() => setShowModal(false)} className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
                    <i className="fa-solid fa-arrow-left"></i>
                 </button>
                 <h3 className="text-xl font-bold text-[#1f1f1f]">Add Details</h3>
              </div>
              
              <div className="p-8 pt-4 space-y-8">
                 <div>
                    <label className="block text-gray-900 font-bold text-sm mb-4">Enter Your Whatsapp Mobile Number</label>
                    <p className="text-xs text-gray-400 mb-4">All your order details will be sent on WhatsApp on below number.</p>
                    <div className="relative">
                       <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 text-[#0e915f] font-bold">
                          <i className="fa-brands fa-whatsapp text-lg"></i>
                          <span>+91</span>
                       </div>
                       <input 
                         type="tel" 
                         maxLength={10}
                         value={userInfo.whatsapp}
                         onChange={(e) => {
                           const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                           setUserInfo(prev => ({ ...prev, whatsapp: val }));
                         }}
                         className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0e915f] outline-none rounded-2xl py-4 pl-24 pr-12 font-bold text-gray-900 transition-all"
                         placeholder="8727121883"
                       />
                       {userInfo.whatsapp && <button onClick={() => setUserInfo(p => ({...p, whatsapp: ''}))} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500">✕</button>}
                    </div>
                 </div>

                 <div>
                    <label className="block text-gray-900 font-bold text-sm mb-4">Enter your complete name for the offering</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         value={userInfo.name}
                         onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                         className="w-full bg-gray-50 border-2 border-transparent focus:border-[#0e915f] outline-none rounded-2xl py-4 px-6 text-gray-900 transition-all placeholder:text-gray-300"
                         placeholder="e.g. Rahul Sharma"
                       />
                       <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 uppercase">{userInfo.name.length}/64</div>
                    </div>
                 </div>

                 <button 
                   onClick={() => {
                     if (userInfo.name && userInfo.whatsapp) {
                       setShowModal(false);
                       setStep(2);
                       window.scrollTo({ top: 0, behavior: 'smooth' });
                     }
                   }}
                   disabled={!userInfo.name || !userInfo.whatsapp}
                   className="w-full bg-[#0e915f] text-white py-5 rounded-2xl font-extrabold uppercase tracking-widest text-sm shadow-xl shadow-[#0e915f]/20 hover:bg-[#0b7c50] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                 >
                    Next
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
