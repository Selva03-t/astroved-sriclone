"use client";

import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: 'Special Pujas', value: '0', key: 'specialPujas' },
    { name: 'Pujas', value: '0', key: 'puja' },
    { name: 'Temples', value: '0', key: 'temples' },
    { name: 'Chadhava', value: '0', key: 'chadhava' },
    { name: 'Library', value: '0', key: 'library' },
    { name: 'Panchang', value: '0', key: 'panchang' },
    { name: 'Astro Tools', value: '0', key: 'astroTools' },
    { name: 'Store', value: '0', key: 'store' },
    { name: 'Reviews', value: '0', key: 'reviews' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats(prev => prev.map(s => ({
            ...s,
            value: data[s.key]?.toString() || '0'
          })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#241a46]">Admin Dashboard</h1>
      
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg border border-[#e8e2ff] bg-white px-4 py-5 shadow-sm transition-all hover:shadow-md sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-[#5657e8]">
              {loading ? (
                <span className="inline-block h-8 w-12 animate-pulse bg-gray-200 rounded"></span>
              ) : (
                stat.value
              )}
            </dd>
          </div>
        ))}
      </div>
    
      <div className="mt-8">
        <div className="rounded-lg border border-[#e8e2ff] bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-[#241a46]">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a href="/admin/pujas" className="flex items-center justify-center rounded-md border border-transparent bg-[#6869F9] px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#5657e8]">
              Add New Puja
            </a>
            <a href="/admin/temples" className="flex items-center justify-center rounded-md border border-[#d8ceff] bg-white px-4 py-3 text-sm font-medium text-[#5657e8] shadow-sm transition-all hover:bg-[#f3f0ff]">
              Manage Temples
            </a>
            <a href="/admin/panchang" className="flex items-center justify-center rounded-md border border-[#d8ceff] bg-white px-4 py-3 text-sm font-medium text-[#5657e8] shadow-sm transition-all hover:bg-[#f3f0ff]">
              Update Panchang
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
