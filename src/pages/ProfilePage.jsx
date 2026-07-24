import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { User, ClipboardList, MapPin, Settings, LogOut, ChevronRight, HelpCircle } from 'lucide-react';

export default function ProfilePage({ onNavigate }) {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, logout, orders } = useApp();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const handleTrackOrder = (order) => {
    onNavigate('orders', order);
  };

  // If not logged in, show a simple prompt to login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10">
          <User className="w-6 h-6 text-accent" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-primary font-sans">Account Profile</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            Login or create a secure account to track orders, manage saved locations, and view invoices.
          </p>
        </div>
        <button
          onClick={() => onNavigate('auth')}
          className="luxury-btn-primary px-8 py-3.5 rounded-xl text-xs font-bold w-full"
        >
          {t('loginBtn')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-left space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Profile Header */}
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white text-lg font-black border border-white/20 shadow-md">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-primary font-sans">{currentUser.name}</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">{currentUser.phone}</p>
          <p className="text-[10px] text-gray-400 font-semibold">{currentUser.email}</p>
        </div>
      </div>

      {/* Orders List Accordion */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">My Recent Orders</h3>
        {orders.length > 0 ? (
          <div className="space-y-2.5">
            {orders.map((ord) => (
              <div 
                key={ord.id}
                onClick={() => handleTrackOrder(ord)}
                className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-gray-150 shadow-sm flex justify-between items-center cursor-pointer hover:bg-white transition-colors duration-150"
              >
                <div className="text-left text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-primary">#{ord.id}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ord.status === 'Delivered' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-primary/5 text-primary'
                    }`}>
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-1">{ord.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-primary">₹{ord.total}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/40 p-4 rounded-2xl border border-gray-150 text-center text-xs text-gray-400">
            No orders found.
          </div>
        )}
      </div>

      {/* Profile Navigation Menus */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
        
        {/* Saved Addresses */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-white cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('savedAddresses')}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Manage home, office and store delivery points</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Language Switches */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center space-x-3 text-left">
            <Settings className="w-5 h-5 text-gray-400" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('settings')}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Configure language preferences</span>
            </div>
          </div>
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md ${language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md ${language === 'ta' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-white cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <HelpCircle className="w-5 h-5 text-gray-400" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('helpSupport')}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Contact customer helpline or browse FAQs</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="px-5 py-4 flex items-center justify-between hover:bg-red-50/50 cursor-pointer transition-colors duration-150 group"
        >
          <div className="flex items-center space-x-3 text-left">
            <LogOut className="w-5 h-5 text-red-500 group-hover:scale-105 transition-transform shrink-0" />
            <div>
              <span className="text-xs font-bold text-red-500 block">{t('logoutBtn')}</span>
              <span className="text-[10px] text-gray-400 block mt-0.5">Sign out from your active device</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

      </div>

    </div>
  );
}
