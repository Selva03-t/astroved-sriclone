"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-linear-to-br from-[#2b2d70] via-[#4647c4] to-[#1f1f1f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Logo and Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.png" 
                alt="DivineAlign Logo" 
                className="brightness-0 invert h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed text-white/90">
              DivineAlign has brought religious services to the masses in India by connecting devotees, pandits and temples. Partnering with over 100 renowned temples, we provide exclusive pujas and offerings performed by expert pandits and share videos of the completed puja rituals.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-6 text-xl font-bold">Company</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="/about" className="hover:opacity-80 transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:opacity-80 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="mb-6 text-xl font-bold">Our Services</h4>
            <ul className="flex flex-col gap-4 text-sm font-medium">
              <li><Link href="/puja" className="hover:opacity-80 transition">Puja</Link></li>
              <li><Link href="/chadhava" className="hover:opacity-80 transition">Chadhava</Link></li>
              <li><Link href="/panchang" className="hover:opacity-80 transition">Panchang</Link></li>
              <li><Link href="/temples" className="hover:opacity-80 transition">Temples</Link></li>
            </ul>
          </div>

          {/* Address and Socials */}
          <div>
            <h4 className="mb-6 text-xl font-bold">Our Address</h4>
            <p className="text-sm leading-relaxed mb-6">
              Firstprinciple AppsForBharat Pvt. Ltd. 2nd Floor, Urban Vault, No. 29/1, 27th Main Road, Somasundarapalya, HSR Post, Bangalore, Karnataka - 560102
            </p>
            <div className="flex flex-wrap gap-3">
              <SocialIcon platform="youtube" href="https://www.youtube.com/divinealign" />
              <SocialIcon platform="instagram" href="https://www.instagram.com/accounts/login/?next=%2Fdivinealign&source=omni_redirect" />
              <SocialIcon platform="linkedin" href="https://www.linkedin.com/company/divinealign-com/" />
              <SocialIcon platform="whatsapp" href="https://api.whatsapp.com/send/?phone=919677391108&text&type=phone_number&app_absent=0" />
              <SocialIcon platform="x" href="https://x.com/divinealign" />
              <SocialIcon platform="facebook" href="https://www.facebook.com/divinealign" />
            </div>
          </div>
        </div>

        {/* Bottom Part (Badges and Legal) */}
        <div className="mt-16 border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Download Badges */}
          <div id="download-app" className="flex scroll-mt-28 flex-wrap justify-center gap-4 md:justify-start">
             <a href="https://play.google.com/store/apps/details?id=com.divinealign.birthchartnew" target="_blank" rel="noopener noreferrer" aria-label="Download DivineAlign on Google Play" className="h-12 w-36 bg-black rounded-lg flex items-center px-3 text-[10px] gap-3 border border-white/20 cursor-pointer hover:bg-white/5 transition-all">
                <i className="fa-brands fa-google-play text-xl"></i>
                <div className="leading-tight">
                   <p className="font-medium text-[9px] opacity-80 uppercase">GET IT ON</p>
                   <p className="font-bold text-[15px]">Google Play</p>
                </div>
             </a>
             <a href="https://apps.apple.com/us/app/divinealign-astrology-remedies/id1406242342" target="_blank" rel="noopener noreferrer" aria-label="Download DivineAlign on the App Store" className="h-12 w-36 bg-black rounded-lg flex items-center px-3 text-[10px] gap-3 border border-white/20 cursor-pointer hover:bg-white/5 transition-all">
                <i className="fa-brands fa-apple text-2xl"></i>
                <div className="leading-tight">
                   <p className="font-medium text-[9px] opacity-80">Download on the</p>
                   <p className="font-bold text-[15px]">App Store</p>
                </div>
             </a>
          </div>

          {/* Compliance Logos */}
          <div className="flex items-center gap-6 opacity-90">
             <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-12 bg-white/20 rounded flex items-center justify-center text-xs font-bold italic">DI</div>
                <span className="text-[8px] font-bold">Digital India</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-12 bg-white/20 rounded flex items-center justify-center text-[10px] font-bold">ISO</div>
                <span className="text-[8px] font-bold">27001</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <div className="h-8 w-12 bg-white/20 rounded flex items-center justify-center text-[10px] font-bold">Razorpay</div>
                <span className="text-[8px] font-bold">Trusted Business</span>
             </div>
          </div>

          {/* Legal and Copyright */}
          <div className="text-center md:text-right">
             <div className="flex gap-4 text-xs font-semibold justify-center md:justify-end mb-1">
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:underline">Terms and Conditions</Link>
             </div>
             <p className="text-[10px] opacity-70">© 2026 DivineAlign, Inc. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ platform, href }: { platform: string; href: string }) {
  const icons: Record<string, string> = {
    youtube: "fa-brands fa-youtube",
    instagram: "fa-brands fa-instagram",
    linkedin: "fa-brands fa-linkedin-in",
    whatsapp: "fa-brands fa-whatsapp",
    x: "fa-brands fa-x-twitter",
    facebook: "fa-brands fa-facebook-f",
  };
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-[#1f1f1f] text-sm cursor-pointer hover:bg-gray-100 transition-all shadow-sm">
      <i className={icons[platform] || "fa-solid fa-share-nodes"}></i>
    </a>
  );
}

