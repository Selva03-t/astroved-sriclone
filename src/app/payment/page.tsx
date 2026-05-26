"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { QRCodeSVG } from "qrcode.react";

function PaymentContent() {
  const { currencySymbol } = useCurrency();
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = searchParams?.get("amount") || "0";
  const title = searchParams?.get("title") || "Sacred Puja";
  const name = searchParams?.get("name") || "";
  const wa = searchParams?.get("wa") || "";

  const [activeTab, setActiveTab] = useState<"upi" | "cards" | "netbanking" | "wallet">("upi");
  const [processing, setProcessing] = useState(false);
  
  // Timer state for UPI (starts at 10:00)
  const [timeLeft, setTimeLeft] = useState(600); 

  useEffect(() => {
    if (activeTab === "upi" && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [activeTab, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const simPaymentId = `pay_${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
      const simOrderId = `order_${Math.random().toString(36).slice(2, 12).toUpperCase()}`;
      const params = new URLSearchParams({
        paymentId: simPaymentId,
        orderId: simOrderId,
        title,
        amount,
        name,
      });
      router.push(`/payment/success?${params.toString()}`);
    }, 2000);
  };

  // Generate a functional UPI string for the QR code
  const upiString = `upi://pay?pa=astroved@razorpay&pn=AstroVed&am=${amount}&cu=INR`;

  return (
    <div className="min-h-screen bg-black/40 flex items-center justify-center p-4">
      {/* ── Main Modal Container ── */}
      <div className="w-full max-w-[900px] bg-white rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative min-h-[550px]">
        
        {/* Close Button (Top Right) */}
        <button 
          onClick={() => router.back()} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ── LEFT PANEL (Orange Gradient) ── */}
        <div className="w-full md:w-[35%] bg-gradient-to-br from-[#f26e4e] to-[#e4512e] p-6 text-white flex flex-col relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center p-1 shrink-0">
               <img src="/images/logo.svg" alt="AstroVed" className="h-full w-full object-contain" />
            </div>
            <div>
              <h2 className="font-bold text-[17px] leading-tight">AstroVed</h2>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-300 bg-white/10 px-1.5 py-0.5 rounded-sm mt-0.5 w-fit border border-green-300/30">
                <i className="fa-solid fa-shield-halved"></i>
                Razorpay Trusted Business
              </div>
            </div>
          </div>

          {/* Price Summary Card */}
          <div className="bg-white rounded-xl p-4 text-[#1f1f1f] shadow-lg mb-3 relative z-10">
            <p className="text-sm font-medium text-gray-600 mb-1">Price Summary</p>
            <p className="text-3xl font-bold">{currencySymbol}{amount}</p>
          </div>

          {/* User Info Card */}
          <div className="bg-white rounded-xl p-3 flex items-center justify-between text-[#1f1f1f] shadow-lg relative z-10 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <i className="fa-regular fa-user text-[#e4512e]"></i>
              Using as +91 {wa || "XXXXXX"}
            </div>
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
          </div>

          <div className="flex-grow"></div>

          {/* Bottom Illustration & Footer */}
          <div className="relative z-10 mt-10">
            <div className="h-32 w-full opacity-80 mb-4 relative">
               <div className="absolute bottom-0 left-4 w-12 h-16 bg-white/20 rounded-sm transform -rotate-12"></div>
               <div className="absolute bottom-2 left-10 w-4 h-24 bg-green-400/90 rounded-full transform rotate-12"></div>
               <div className="absolute bottom-0 right-4 w-16 h-12 bg-white/20 rounded-full"></div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-medium opacity-90">
              Secured by <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-3 brightness-0 invert" alt="Razorpay" />
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[30px] border-white/5 rounded-full pointer-events-none"></div>
          <div className="absolute top-40 -left-10 w-32 h-32 border-[15px] border-white/5 rounded-full pointer-events-none"></div>
        </div>

        {/* ── RIGHT PANEL (White Content) ── */}
        <div className="w-full md:w-[65%] flex flex-col bg-white relative">
          
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-700 text-sm">Payment Options</h3>
            <div className="w-6 h-1"></div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            
            {/* Payment Method Tabs */}
            <div className="w-[180px] bg-gray-50/50 border-r border-gray-100 flex flex-col pt-2">
              <button
                onClick={() => setActiveTab("upi")}
                className={`text-left px-5 py-4 flex justify-between items-center text-[13px] font-bold border-l-4 transition-all ${activeTab === "upi" ? "bg-[#fff5f2] border-[#e4512e] text-[#e4512e]" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                UPI
                <div className="flex gap-0.5">
                  <i className="fa-brands fa-google-pay text-xs"></i>
                  <i className="fa-brands fa-alipay text-xs"></i>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("cards")}
                className={`text-left px-5 py-4 flex justify-between items-center text-[13px] font-bold border-l-4 transition-all ${activeTab === "cards" ? "bg-[#fff5f2] border-[#e4512e] text-[#e4512e]" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                Cards
                <div className="flex gap-1 text-[10px]">
                   <i className="fa-brands fa-cc-visa text-blue-800"></i>
                   <i className="fa-brands fa-cc-mastercard text-red-600"></i>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab("netbanking")}
                className={`text-left px-5 py-4 flex justify-between items-center text-[13px] font-bold border-l-4 transition-all ${activeTab === "netbanking" ? "bg-[#fff5f2] border-[#e4512e] text-[#e4512e]" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                Netbanking
                <div className="flex gap-1 text-[10px] text-blue-500">
                   <i className="fa-solid fa-building-columns"></i>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("wallet")}
                className={`text-left px-5 py-4 flex justify-between items-center text-[13px] font-bold border-l-4 transition-all ${activeTab === "wallet" ? "bg-[#fff5f2] border-[#e4512e] text-[#e4512e]" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                Wallet
                <div className="flex gap-1 text-[10px] text-purple-600">
                   <i className="fa-solid fa-wallet"></i>
                </div>
              </button>
            </div>

            {/* Tab Content Areas */}
            <div className="flex-1 p-6 overflow-y-auto bg-white relative">
              
              {/* Overlay while processing */}
              {processing && (
                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e4512e] mb-4"></div>
                    <p className="font-bold text-gray-700">Processing Payment...</p>
                 </div>
              )}

              {/* ── UPI Tab ── */}
              {activeTab === "upi" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-semibold text-gray-700">UPI QR</h4>
                     <span className="text-xs text-gray-500 font-bold flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md">
                       <i className="fa-regular fa-clock"></i> {formatTime(timeLeft)}
                     </span>
                  </div>
                  
                  <div className="bg-[#fafafa] border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm shrink-0 flex items-center justify-center">
                       <QRCodeSVG value={upiString} size={110} level={"Q"} />
                    </div>
                    <div className="text-center md:text-left">
                       <p className="text-[13px] text-gray-600 font-bold mb-3">Scan the QR using any UPI App</p>
                       <div className="flex gap-3 justify-center md:justify-start opacity-70">
                          <i className="fa-brands fa-google-pay text-2xl text-gray-800"></i>
                          <i className="fa-brands fa-amazon-pay text-2xl text-gray-800"></i>
                       </div>
                    </div>
                  </div>

                  <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="shrink-0 mx-4 text-gray-400 text-xs font-medium">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden flex bg-white focus-within:border-[#e4512e] transition-colors">
                     <input type="text" placeholder="Enter UPI ID (e.g. name@bank)" className="w-full px-4 py-3.5 text-sm outline-none" />
                  </div>
                  
                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full bg-[#18100c] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-black transition-colors mt-6"
                  >
                    Pay Now
                  </button>
                </div>
              )}

              {/* ── Cards Tab ── */}
              {activeTab === "cards" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Add a new card</h4>
                  
                  <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white focus-within:border-gray-400 transition-colors">
                    <input 
                      type="text" 
                      placeholder="Card Number" 
                      className="w-full px-4 py-3.5 text-sm outline-none border-b border-gray-200"
                    />
                    <div className="flex">
                      <input 
                        type="text" 
                        placeholder="MM / YY" 
                        className="w-1/2 px-4 py-3.5 text-sm outline-none border-r border-gray-200"
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        className="w-1/2 px-4 py-3.5 text-sm outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer mb-8">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-[#e4512e] focus:ring-[#e4512e]" />
                    <span className="text-[13px] text-gray-500 font-medium">Save this card as per RBI guidelines</span>
                  </label>

                  <button 
                    onClick={handleSimulatePayment}
                    className="w-full bg-[#18100c] text-white font-bold py-3.5 rounded-xl text-sm hover:bg-black transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* ── Netbanking Tab ── */}
              {activeTab === "netbanking" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="relative mb-6">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                     <input type="text" placeholder="Search for Banks" className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#e4512e] transition-colors" />
                  </div>

                  <h4 className="text-xs font-semibold text-gray-500 mb-3">Suggested Banks</h4>
                  
                  <div className="space-y-3">
                     {[
                        { name: "State Bank of India", icon: "fa-building-columns", color: "text-blue-600", error: "State Bank of India payments are currently facing issues. Please try with other payment options." },
                        { name: "Bank of Baroda - Retail Banking", desc: "For Individuals", icon: "fa-building-columns", color: "text-orange-500", error: "Bank of Baroda - Retail Banking payments are currently facing issues. Please try with other payment options." },
                        { name: "HDFC Bank", icon: "fa-building-columns", color: "text-blue-800" },
                        { name: "ICICI Bank", icon: "fa-building-columns", color: "text-orange-600" },
                     ].map((bank, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors cursor-pointer" onClick={handleSimulatePayment}>
                           <div className="px-4 py-3.5 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className={`w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center ${bank.color}`}>
                                    <i className={`fa-solid ${bank.icon} text-xs`}></i>
                                 </div>
                                 <div>
                                    <p className="text-sm font-semibold text-gray-700">{bank.name}</p>
                                    {bank.desc && <p className="text-[10px] text-gray-400">{bank.desc}</p>}
                                 </div>
                              </div>
                              <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                           </div>
                           {bank.error && (
                              <div className="bg-red-50/50 px-4 py-2 border-t border-gray-100">
                                 <p className="text-[10px] text-red-500 font-medium leading-tight flex gap-1.5 items-start">
                                    <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
                                    {bank.error}
                                 </p>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
                </div>
              )}

              {/* ── Wallet Tab ── */}
              {activeTab === "wallet" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center py-10">
                   <i className="fa-solid fa-wallet text-gray-200 text-6xl mb-4"></i>
                   <p className="text-gray-500 text-sm font-medium">Select a wallet provider to continue</p>
                   
                   <div className="grid grid-cols-2 gap-4 mt-6">
                      {['PhonePe', 'Amazon Pay', 'MobiKwik', 'Freecharge'].map(w => (
                         <button key={w} onClick={handleSimulatePayment} className="border border-gray-200 rounded-xl py-4 font-bold text-gray-700 text-sm hover:border-[#e4512e] hover:text-[#e4512e] transition-colors">
                            {w}
                         </button>
                      ))}
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black/40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
