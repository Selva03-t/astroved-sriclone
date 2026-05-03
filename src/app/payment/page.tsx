"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

function PaymentContent() {
  const searchParams = useSearchParams();
  const amount = searchParams ? searchParams.get("amount") : "0";
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Generate stable order ID on client
    setOrderId("AV_" + Math.random().toString(36).substr(2, 9).toUpperCase());
    // Simulate loading payment gateway
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = async () => {
    setLoading(true);
    
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create booking in database
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: searchParams?.get("type") || "puja",
          title: searchParams?.get("title") || "",
          amount: amount,
          orderId: orderId,
          items: [] // In real app, pass items from cart
        })
      });

      if (!res.ok) throw new Error("Failed to save booking");

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong with the booking.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-md mt-20 p-10 text-center space-y-6">
           <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl">
              ✓
           </div>
           <h1 className="text-3xl font-bold text-gray-900">Payment Successful!</h1>
           <p className="text-gray-500">Your Chadhava offering has been booked successfully. You will receive updates on WhatsApp.</p>
           <button 
             onClick={() => window.location.href = '/dashboard'}
             className="w-full bg-[#0e915f] text-white py-4 rounded-xl font-bold uppercase transition-all hover:bg-[#0b7c50]"
           >
              Back to Dashboard
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-20 flex flex-col lg:flex-row gap-10 items-start">
         {/* Left Side: Merchant Info */}
         <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-3 border border-gray-100">
                  <img src="https://cdn.astroved.com/images/images-av/AstroVed-Logo.svg" alt="AstroVed" className="w-full" />
               </div>
               <div>
                  <h2 className="text-lg font-bold text-gray-900">AstroVed Chadhava Seva</h2>
                  <p className="text-sm text-gray-400">Payment for Spiritual Offerings</p>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
               <div className="flex justify-between items-center text-sm text-gray-500 font-medium">
                  <span>Standard Checkout</span>
                  <span>Order ID: {orderId || "AV_LOADING..."}</span>
               </div>
               <div className="flex justify-between items-end">
                  <span className="text-4xl font-extrabold text-gray-900">₹{amount}</span>
                  <span className="text-sm text-blue-600 font-bold hover:underline cursor-pointer">View Details</span>
               </div>
            </div>

            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-widest text-center">
               Secured by AstroPay Gateway
            </div>
         </div>

         {/* Right Side: Payment Methods (Razorpay style) */}
         <div className="w-full lg:w-[400px] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-[#1c2e4a] p-6 text-white flex justify-between items-center">
               <span className="font-bold text-sm">Pay with QR / Cards / UPI</span>
               <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4 brightness-0 invert" alt="Razorpay" />
            </div>

            <div className="p-8 space-y-6">
               {loading ? (
                  <div className="py-20 text-center space-y-4">
                     <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
                     <p className="text-sm text-gray-500 font-bold animate-pulse">Initializing Secure Gateway...</p>
                  </div>
               ) : (
                  <>
                    <div className="space-y-4">
                       <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-qrcode"></i>
                             </div>
                             <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">UPI / QR</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Google Pay, PhonePe, Paytm</p>
                             </div>
                          </div>
                          <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                       </button>

                       <button className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-credit-card"></i>
                             </div>
                             <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">Card</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Visa, Mastercard, RuPay & More</p>
                             </div>
                          </div>
                          <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
                       </button>
                    </div>

                    <button 
                      onClick={handlePay}
                      className="w-full bg-[#3395ff] text-white py-5 rounded-2xl font-extrabold text-sm uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-[#2087f0] transition-all active:scale-95 mt-4"
                    >
                       Pay Now
                    </button>

                    <div className="text-center">
                       <p className="text-[10px] text-gray-300 font-bold uppercase tracking-tighter">Trusted by 10M+ businesses</p>
                    </div>
                  </>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

