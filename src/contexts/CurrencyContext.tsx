"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CurrencyType = "INR" | "USD" | "MYR";

interface CurrencyContextType {
  currency: CurrencyType;
  currencySymbol: string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "INR",
  currencySymbol: "₹",
  loading: true,
});

export const useCurrency = () => useContext(CurrencyContext);

const getSymbol = (curr: CurrencyType) => {
  if (curr === "USD") return "$";
  if (curr === "MYR") return "RM";
  return "₹";
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>("INR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        // 1. Check cookies first
        const match = document.cookie.match(new RegExp('(^| )userCurrency=([^;]+)'));
        if (match && match[2]) {
          const savedCurr = match[2] as CurrencyType;
          if (["INR", "USD", "MYR"].includes(savedCurr)) {
            setCurrency(savedCurr);
            setLoading(false);
            return;
          }
        }

        // 2. Fetch IP Geolocation
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Failed to fetch IP data");
        const data = await res.json();
        
        let detectedCurrency: CurrencyType = "USD"; // Default fallback
        
        if (data.country_code === "IN") {
          detectedCurrency = "INR";
        } else if (data.country_code === "MY") {
          detectedCurrency = "MYR";
        }

        setCurrency(detectedCurrency);
        // Save to cookie for 30 days
        document.cookie = `userCurrency=${detectedCurrency}; path=/; max-age=${30 * 24 * 60 * 60}`;
      } catch (error) {
        console.error("Error detecting currency:", error);
        // Fallback to INR on error or keep default
      } finally {
        setLoading(false);
      }
    };

    fetchCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, currencySymbol: getSymbol(currency), loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};
