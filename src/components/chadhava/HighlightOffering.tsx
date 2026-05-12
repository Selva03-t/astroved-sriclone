"use client";
import React from 'react';
import { AddButton } from './AddButton';
import { Offering } from './OfferingCard';

interface HighlightOfferingProps {
  offering: Offering;
  qty: number;
  onToggle: (off: Offering) => void;
  onUpdateQty: (id: string, delta: number) => void;
}

export function HighlightOffering({ offering, qty, onToggle, onUpdateQty }: HighlightOfferingProps) {
  return (
    <div className="py-6 px-4 md:px-8 flex flex-row items-center justify-between gap-6 border border-[#f4dbb2] bg-[#fff4e8] rounded-xl group transition-colors duration-300 mt-6 shadow-sm mx-4 md:mx-0">
      <div className="flex-1 pr-2 md:pr-6">
        <div className="text-xs font-bold text-[#d97706] uppercase tracking-wider mb-2 flex items-center gap-1.5">
           <i className="fa-solid fa-star"></i> Special Combo
        </div>
        <h3 className="text-lg font-semibold text-[#111827] mb-1.5">{offering.name}</h3>
        <p className="text-[#6b7280] text-sm mb-3 leading-relaxed">
           <span className="opacity-90">{offering.description.startsWith('✓') ? '' : '✓ '}{offering.description}</span>
        </p>
        <div className="text-lg font-bold text-[#0f8f62]">₹{offering.price}</div>
      </div>
      <div className="flex flex-col items-center shrink-0 relative pb-3 w-[100px]">
        <div className="relative h-[86px] w-[86px] bg-white rounded-xl flex items-center justify-center p-2 border border-[#ececec]">
          <img src={offering.imageUrl || "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=200&q=80"} alt={offering.name} className="w-full h-full object-contain rounded-md shadow-sm mix-blend-multiply" />
        </div>
        <div className="absolute -bottom-1 z-10">
          <AddButton 
            qty={qty} 
            onAdd={() => onToggle(offering)} 
            onIncrement={() => onUpdateQty(offering.id, 1)} 
            onDecrement={() => onUpdateQty(offering.id, -1)} 
          />
        </div>
      </div>
    </div>
  );
}
