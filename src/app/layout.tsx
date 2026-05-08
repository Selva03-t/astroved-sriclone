import "./globals.css";
import type { ReactNode } from "react";
import Script from "next/script";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/ui/AIAssistant";
import { Providers } from "./Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <div className="flex-1">
            {children}
          </div>
          <AIAssistant />
          <Footer />
        </Providers>
        {/* Webpushr push-notification SDK */}
        <Script
          id="webpushr-sdk"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(w,d,s,id){
  if(typeof(w.webpushr)!=='undefined') return;
  w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
  var js,fjs=d.getElementsByTagName(s)[0];
  js=d.createElement(s);js.id=id;js.async=1;
  js.src='https://cdn.webpushr.com/app.min.js';
  fjs.parentNode.appendChild(js);
}(window,document,'script','webpushr-jssdk'));
webpushr('setup',{'key':'BNsrcymsVOelI2pREYhpoosJ2U9yC8NsmsO7w-NKV6varJlkz9heYK0Ihh2muoKTsgJyQjE8GNR7rQamhQ0XlFI','integration':'popup'});
            `,
          }}
        />
      </body>
    </html>
  );
}