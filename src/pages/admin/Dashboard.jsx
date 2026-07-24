import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, Package, ClipboardList, Users, ShieldAlert, 
  Map, ArrowLeft, RefreshCw
} from 'lucide-react';

import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminDelivery from './AdminDelivery';

export default function AdminPanel({ onNavigate }) {
  const { language, t } = useLanguage();
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, orders, products, delivery

  // Force Admin Authorization Mock
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldAlert className="w-16 h-16 text-red-500 animate-pulse" />
        <h2 className="text-xl font-black text-primary">Access Denied</h2>
        <p className="text-sm text-gray-500">You must be logged in as an administrator to view this portal.</p>
        <button onClick={() => onNavigate('home')} className="luxury-btn-primary px-6 py-2 rounded-full text-xs font-bold mt-4">
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-4 pb-20 md:pb-8 flex flex-col md:flex-row gap-6 lg:gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 relative">
        <div className="md:sticky md:top-24 space-y-2">
          
          {/* Header Info */}
          <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary">{t('adminTitle')}</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Control Center</span>
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all duration-200 border ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md border-primary/20' : 'bg-white/60 backdrop-blur-md text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-primary'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>{t('dashboard')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all duration-200 border ${activeTab === 'orders' ? 'bg-primary text-white shadow-md border-primary/20' : 'bg-white/60 backdrop-blur-md text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-primary'}`}
          >
            <ClipboardList className="w-5 h-5" />
            <span>{t('totalOrders')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all duration-200 border ${activeTab === 'products' ? 'bg-primary text-white shadow-md border-primary/20' : 'bg-white/60 backdrop-blur-md text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-primary'}`}
          >
            <Package className="w-5 h-5" />
            <span>{t('products')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('delivery')}
            className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-xs font-bold transition-all duration-200 border ${activeTab === 'delivery' ? 'bg-primary text-white shadow-md border-primary/20' : 'bg-white/60 backdrop-blur-md text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-primary'}`}
          >
            <Map className="w-5 h-5" />
            <span>Delivery Fees</span>
          </button>
          
          <button 
            onClick={() => {
              // Force window reload to reset app state mock
              window.location.reload();
            }}
            className="w-full mt-6 flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === 'dashboard' && <AdminOverview />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'delivery' && <AdminDelivery />}
      </div> 
    </div>
  );
}
