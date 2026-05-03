"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

const navigationItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Puja", path: "/puja" },
  { label: "Chadhava", path: "/chadhava" },
  { label: "Panchang", path: "/panchang" },
  { label: "Temples", path: "/temples" },
  { label: "Library", path: "/library" },
  { label: "Astro Tools", path: "/astro-tools" },
    { label: "Store", path: "/store"},
];

const banners = [
  {
    id: 1,
    title: "Download Our App",
    subtitle: "Get access to exclusive offers and features on the go",
    buttonText: "Download Now",
    bgColor: "bg-gradient-to-r from-[#6969fa] to-[#5555e8]",
    textColor: "text-white",
    image: "/images/Ganesh-Chaturthi-Mahapuja.jpg",
    className:"object-cover",
  },
  {
    id: 2,
    title: "Special Puja",
    subtitle: "Book your sacred puja rituals with our expert priests",
    buttonText: "Book Now",
    bgColor: "bg-gradient-to-r from-[#f47820] to-[#e85e00]",
    textColor: "text-white",
    image:"/images/Navagraha-Shanti-Puja.jpg",
  },
  {
    id: 3,
    title: "Special Chadhava",
    subtitle: "Offer Chadhava at 100+ sacred temples across India",
    buttonText: "Book Chadhava",
    bgColor: "bg-gradient-to-r from-[#6969fa] via-[#f47820] to-[#6969fa]",
    textColor: "text-white",
    image: "/images/Lakshmi-Homam.jpg",
  },
  {
    id: 4,
    title: "Akshaya Tritiya",
    subtitle: "Participate in the most auspicious day of the year",
    buttonText: "",
    bgColor: "bg-white",
    textColor: "text-[#1f1f1f]",
    image: "/images/maa-kali.jpg",
    showContent: false,
  },
];

export default function DashboardPage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    },2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white text-[#1f1f1f]">
      <Navbar />
      <div className="h-px w-full bg-[#d5d8f5]" />

      {/* Banner Section */}
      <section className="w-full">
       <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentBanner ? "opacity-100" : "opacity-0"
              }`}
            >
              {banner.image ? (
                <div className="relative h-full w-full">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover object-top" 
                  
                    priority
                  />
                  {banner.showContent && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/20 px-6 py-16 text-center">
                      <h2 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl">
                        {banner.title}
                      </h2>
                      <p className="max-w-xl text-lg text-white opacity-90">
                        {banner.subtitle}
                      </p>
                      <button className="mt-4 rounded-full bg-white px-8 py-3 font-semibold text-[#6969fa] transition hover:bg-gray-100">
                        {banner.buttonText}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`flex h-full flex-col items-center justify-center gap-6 px-6 py-16 text-center ${banner.bgColor}`}>
                  <h2 className={`max-w-2xl text-4xl font-bold leading-tight ${banner.textColor} sm:text-5xl`}>
                    {banner.title}
                  </h2>
                  <p className={`max-w-xl text-lg ${banner.textColor} opacity-90`}>
                    {banner.subtitle}
                  </p>
                  <button className="mt-4 rounded-full bg-white px-8 py-3 font-semibold text-[#6969fa] transition hover:bg-gray-100">
                    {banner.buttonText}
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`h-2 w-2 rounded-full transition ${
                  index === currentBanner ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Marquee Section */}
      <div className="bg-primary-sunsetOrange-500 py-2 border-y border-orange-600 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {[
            "#1 Vedic Remedies & Astrological Insights Provider",
            "25+ Years of Expertise in Vedic Astrology",
            "10M+ Homas, Poojas & Remedies Performed",
            "7M Expert Consultations",
            "60M+ lives touched",
            "#1 Vedic Remedies & Astrological Insights Provider",
            "25+ Years of Expertise in Vedic Astrology",
            "10M+ Homas, Poojas & Remedies Performed",
            "7M Expert Consultations",
            "60M+ lives touched"
          ].map((item, idx) => (
            <div key={idx} className="inline-flex items-center mx-12">
              <span className="text-white text-lg mr-4 rotate-45">✦</span>
              <span className="text-[17px] text-white uppercase tracking-wide">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AstroVed Special Pujas Section */}
      <section className="bg-[#fffdf9] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-extrabold text-center mb-2">
            <span className="text-purple-700">AstroVed</span> Special Pujas
          </h2>
          <p className="text-center text-xl text-gray-600 mb-8">
            Begin 2026 with faith - get special pujas performed in your name at India’s powerful temples to achieve peace and protection for your family.
          </p>
          <PujaCardsSection />
        </div>
      </section>

      {/* Reviews & Ratings Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-5xl font-extrabold text-[#1f1f1f] mb-4">Reviews & Ratings</h2>
          <p className="text-xl text-gray-600 mb-16">Read to what our beloved devotees have to say about AstroVed.</p>
          
          <ReviewsSection />
        </div>
      </section>

      {/* Trust & Impact Section */}
      <section className="bg-[#101c3d] py-24 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Left Column */}
            <div>
              <p className="text-[#6969fa] font-bold text-lg mb-4">Trusted by Over 30 Million Devotees</p>
              <h2 className="text-5xl font-extrabold leading-tight mb-8">
                India's Largest Devotional Platform
              </h2>
              <p className="text-gray-300 text-xl leading-relaxed max-w-xl">
                We are committed to building the most trusted destination that serves the devotional needs of millions of devotees in India and abroad, providing them the access they always wanted.
              </p>
            </div>

            {/* Right Column: Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🙏</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">30M+ Devotees</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">have trusted us in their devotional journey</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl text-yellow-400">★</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">4.5 star rating</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">Over 1 Lakh devotees express their love for us on playstore</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🌍</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">30+ Countries</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">We help devotees globally reconnect with their devotional heritage</p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">3M+ Services</h3>
                  <p className="text-gray-400 leading-relaxed font-medium">Millions of devotees have commenced Pooja and Chadhava at famous temples of India with us to seek God's grace.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-extrabold text-[#1f1f1f] mb-6">One App for all your devotional needs</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              AstroVed brings these amazing features for you, get these features for free and start your devotional journey now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {/* Feature 1 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-black rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-black/20">🔔</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Divine Temple</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Set up your temple on your phone, dedicated to your beloved deities and seek their blessings, anytime, anywhere.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-[#8b4513] rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-orange-900/20">📖</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Hindu Literature</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Get specially curated books, articles and videos based on Sanatan Dharma.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-[#008080] rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-teal-900/20">🎵</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Devotional Music</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Get access to 5000+ Ad-Free Devotional Music. Listen to Aartis, Mantras, Bhajans, Chalisas and immerse yourself in the divine energy.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-[#f47820] rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-orange-500/20">✡</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Panchang, Horoscope & Festivals</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Get regular updates on Daily Horoscope, Panchang, and upcoming Fasts- Festivals.</p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-[#ffd700] rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20">☸</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Puja and Chadhava Seva</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Book personalized Puja and Chadhava Seva in your and your family's name at 1000+ renowned temples across India.</p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="flex flex-col gap-5">
              <div className="h-14 w-14 bg-[#ff4500] rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-red-500/20">🕉</div>
              <div>
                <h3 className="text-2xl font-bold text-[#1f1f1f] mb-3">Sanatani Community</h3>
                <p className="text-gray-600 text-[17px] leading-[1.6]">Be a part of India's largest devotional community and connect with Sanatanis worldwide.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section (Exactly as in Image) */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1f1f1f] mb-4">
              Read interesting articles about upcoming fasts, festivals, and everything around Sanatan Dharma.
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Read interesting articles about upcoming fasts, festivals, and everything around Sanatan Dharma.
            </p>
            <Link href="/library" className="inline-flex items-center text-[#f47820] font-bold text-sm hover:underline">
              Read All <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Aarti */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img 
                   src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Faarti_article_image.0d882263.webp&w=1920&q=75" 
                   alt="Aarti" 
                   className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">Aarti</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                Find complete lyrics of all the famous Aartis and easily worship your beloved God.
              </p>
              <Link href="/library?tab=aarti" className="text-[#f47820] font-bold text-xs uppercase tracking-wider hover:underline">
                Read All
              </Link>
            </div>

            {/* Card 2: Chalisa */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img 
                   src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchaalisa_article_image.940dd0a3.webp&w=1920&q=75" 
                   alt="Chalisa" 
                   className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">Chalisa</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                You will get complete Chalisa of all the deities. Read Chalisa during the Pooja of your beloved deities and seek their grace.
              </p>
              <Link href="/library?tab=chalisa" className="text-[#f47820] font-bold text-xs uppercase tracking-wider hover:underline">
                Read All
              </Link>
            </div>

            {/* Card 3: Mantra */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img 
                   src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmantra_article_image.c0b022ae.webp&w=1920&q=75" 
                   alt="Mantra" 
                   className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">Mantra</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                Here you will find all the powerful mantras for peace of mind. Chant these mantras and remove all the obstacles from life.
              </p>
              <Link href="/library?tab=mantra" className="text-[#f47820] font-bold text-xs uppercase tracking-wider hover:underline">
                Read All
              </Link>
            </div>

            {/* Card 4: Ayurvedic & Home Remedies */}
            <div className="flex flex-col">
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 shadow-md">
                <img 
                   src="https://www.srimandir.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fayurvedic_article_image.0a07e763.webp&w=1920&q=75" 
                   alt="Ayurvedic & Home Remedies" 
                   className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#1f1f1f] mb-3">Ayurvedic & Home Remedies</h3>
              <p className="text-gray-600 text-[15px] leading-relaxed mb-6 flex-1">
                We have brought the precious knowledge of Ayurveda for you, these remedies will help you lead a healthy life.
              </p>
              <Link href="/library?tab=remedies" className="text-[#f47820] font-bold text-xs uppercase tracking-wider hover:underline">
                Read All
              </Link>
            </div>
          </div>
        </div>
      </section>


    </main>
  );
}

// --- Reviews Components ---
type Review = {
  _id: string;
  name: string;
  location: string;
  content: string;
  type: 'text' | 'video';
  videoUrl?: string;
  avatarUrl?: string;
  rating?: number;
};

const ReviewCard = ({ review }: { review: Review }) => {
  const isVideo = review.type === 'video';
  
  return (
    <div className="flex flex-col items-center min-w-[320px] max-w-[380px] shrink-0">
      {isVideo ? (
        <div className="w-full h-[240px] rounded-[32px] overflow-hidden shadow-lg mb-8 bg-black relative border-4 border-white">
          <iframe 
            src={review.videoUrl?.replace('watch?v=', 'embed/')} 
            className="w-full h-full"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full h-[240px] bg-[#f3f4f6] rounded-[32px] px-10 py-10 shadow-sm mb-8 flex items-center justify-center text-center overflow-hidden">
          <div className="overflow-y-auto h-full flex items-center no-scrollbar">
            <p className="text-[#4b5563] italic text-[18px] leading-[1.8] font-medium py-4">
              "{review.content}"
            </p>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-5 w-full pl-4">
        <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
          <img 
            src={review.avatarUrl || `https://ui-avatars.com/api/?name=${review.name}&background=random`} 
            alt={review.name} 
            className="h-full w-full object-cover" 
          />
        </div>
        <div className="text-left">
          <h4 className="font-bold text-[#1f1f1f] text-xl leading-tight">{review.name}</h4>
          <p className="text-gray-500 text-[15px] font-medium mt-0.5">{review.location}</p>
        </div>
      </div>
    </div>
  );
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (reviews.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const nextIndex = (currentIndex + 1) % reviews.length;
        const scrollAmount = nextIndex * (380 + 32); // updated card width + gap
        
        container.scrollTo({
          left: scrollAmount,
          behavior: 'smooth'
        });
        setCurrentIndex(nextIndex);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [reviews, currentIndex]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = 380 + 32;
      const newIndex = direction === 'left' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(reviews.length - 1, currentIndex + 1);
      
      container.scrollTo({
        left: newIndex * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(newIndex);
    }
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading reviews...</div>;
  if (!reviews.length) return null;

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-10 snap-x snap-mandatory scrollbar-hide no-scrollbar"
        onScroll={(e) => {
          const scrollLeft = e.currentTarget.scrollLeft;
          const index = Math.round(scrollLeft / (380 + 32));
          if (index !== currentIndex) setCurrentIndex(index);
        }}
      >
        {reviews.map((review) => (
          <div key={review._id} className="snap-center">
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center items-center gap-6">
        <button 
          onClick={() => handleScroll('left')}
          className="h-12 w-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm active:scale-90"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 rotate-180 text-gray-600"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
        </button>
        
        <div className="flex gap-2">
           {reviews.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-2 rounded-full transition-all duration-300 ${
                 idx === currentIndex ? "w-8 bg-[#f47820]" : "w-2 bg-[#cbd5e1]"
               }`}
             ></div>
           ))}
        </div>

        <button 
          onClick={() => handleScroll('right')}
          className="h-12 w-12 rounded-full bg-primary-sunsetOrange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 active:scale-90 transition-all"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-white"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
        </button>
      </div>
    </div>
  );
}


  // --- Dynamic Puja Cards Section ---
  import React from "react";

  type Puja = {
    _id: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    buttonText: string;
    slug?: string;
    createdAt?: string;
  };

  const PujaCard = ({ puja }: { puja: Puja }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 border border-gray-100">
      <div className="relative h-60 w-full overflow-hidden">
        <img 
          src={puja.imageUrl || "https://images.unsplash.com/photo-1601024445121-e5b82f020549?auto=format&fit=crop&w=800&q=80"} 
          alt={puja.title} 
          className="w-full h-full object-fit transition-transform duration-500 hover:scale-110" 
        />
      </div>
      <div className="p-6 flex flex-col flex-1 text-center">
        <p className="text-[#f47820] text-sm font-bold uppercase tracking-wider mb-2">{puja.subtitle}</p>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{puja.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-1">{puja.description}</p>
        <Link href={`/puja/${puja.slug || String(puja.title || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')}`} className="w-full bg-gradient-to-r from-[#6969fa] to-[#5555e8] text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 text-center block">
          {puja.buttonText || "Book Now"}
        </Link>
      </div>
    </div>
  );

  export function PujaCardsSection() {
    const [pujas, setPujas] = React.useState<Puja[]>([]);
    React.useEffect(() => {
      fetch("/api/special-pujas")
        .then((res) => res.json())
        .then((data) => {
          if (!Array.isArray(data)) {
            setPujas([]);
            return;
          }

          const recentThree = [...(data as Puja[])]
            .sort((a, b) => {
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return timeB - timeA;
            })
            .slice(0, 3);

          setPujas(recentThree);
        });
    }, []);
    if (!pujas.length) return null;
    return (
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {pujas.map((puja) => (
            <PujaCard key={puja._id} puja={puja} />
          ))}
        </div>
        <div className="mt-12">
          <Link href="/puja" className="text-[#6969fa] text-xl hover:text-[#5555e8] transition-all flex items-center gap-2 group">
            view all pujas <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>
    );
  }

  // Insert the PujaCardsSection below the filters and input