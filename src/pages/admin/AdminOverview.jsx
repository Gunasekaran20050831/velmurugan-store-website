import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { TrendingUp, Package } from 'lucide-react';

export default function AdminOverview() {
  const { t } = useLanguage();
  const { products } = useApp();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat: Orders */}
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Orders</span>
            <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+12%</span>
          </div>
          <h3 className="text-xl font-extrabold text-primary mt-2">1,245</h3>
          <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span>vs previous week</span>
          </div>
        </div>

        {/* Stat: Revenue */}
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Revenue</span>
            <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+18%</span>
          </div>
          <h3 className="text-xl font-extrabold text-primary mt-2">₹2,45,680</h3>
          <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span>vs previous month</span>
          </div>
        </div>

        {/* Stat: Customers */}
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customers</span>
            <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-black">+4.2%</span>
          </div>
          <h3 className="text-xl font-extrabold text-primary mt-2">856</h3>
          <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span>Active customers</span>
          </div>
        </div>

        {/* Stat: Products */}
        <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Products</span>
            <span className="text-[9px] bg-primary/5 text-primary px-2 py-0.5 rounded font-black">Active</span>
          </div>
          <h3 className="text-xl font-extrabold text-primary mt-2">{products.length}</h3>
          <div className="flex items-center space-x-1 mt-2 text-[9px] text-gray-400 font-semibold">
            <Package className="w-3.5 h-3.5 text-primary" />
            <span>Items in catalog</span>
          </div>
        </div>
      </div>

      {/* Sales chart representation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales overview */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-primary font-sans">{t('salesOverview')}</h3>
          
          {/* Premium abstract SVG mock chart graph */}
          <div className="h-56 w-full relative flex items-end">
            <svg className="w-full h-full text-primary" viewBox="0 0 500 150">
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(10, 35, 92, 0.05)" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(10, 35, 92, 0.05)" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(10, 35, 92, 0.05)" />
              
              {/* Gradient Area Fill */}
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0 130 C 50 110, 100 140, 150 90 C 200 40, 250 85, 300 50 C 350 15, 400 65, 450 30 C 480 10, 500 15, 500 15 L 500 150 L 0 150 Z" fill="url(#chartGlow)" />
              
              {/* Spline line */}
              <path d="M 0 130 C 50 110, 100 140, 150 90 C 200 40, 250 85, 300 50 C 350 15, 400 65, 450 30 C 480 10, 500 15, 500 15" fill="none" stroke="#D4AF37" strokeWidth="2.5" />
            </svg>

            {/* X labels */}
            <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 text-[9px] text-gray-400 font-bold uppercase">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Pie Chart: Status break */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-extrabold text-primary font-sans">{t('orderStatus')}</h3>
          
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            {/* SVG circular donut segment visual */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Empty base */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="rgba(10, 35, 92, 0.05)" strokeWidth="3" />
              {/* Segment: Delivered 60% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#0A235C" strokeWidth="3.2" strokeDasharray="60 40" strokeDashoffset="0" />
              {/* Segment: Pending 25% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#D4AF37" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-60" />
              {/* Segment: Cancelled/Returned 15% */}
              <circle cx="18" cy="18" r="15.91" fill="none" stroke="#F87171" strokeWidth="3.2" strokeDasharray="15 85" strokeDashoffset="-85" />
            </svg>
            <div className="absolute text-center">
              <span className="block text-xs font-black text-primary">85%</span>
              <span className="block text-[8px] text-gray-400 font-black uppercase">Success</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-primary"></span><span className="text-gray-500">Delivered</span></span>
              <span className="text-primary">60%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-accent"></span><span className="text-gray-500">In Progress</span></span>
              <span className="text-primary">25%</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center space-x-1.5"><span className="w-2 h-2 rounded bg-red-400"></span><span className="text-gray-500">Cancelled</span></span>
              <span className="text-primary">15%</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
