import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { User, ClipboardList, MapPin, Settings, LogOut, ChevronRight, HelpCircle, Phone, MessageCircle, Moon, Sun, Monitor } from 'lucide-react';

export default function ProfilePage({ onNavigate }) {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
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
          <p className="text-xs text-muted font-semibold leading-relaxed">
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
      <div className="glass-card p-6 rounded-3xl flex items-center space-x-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center text-white text-lg font-black border border-white/20 shadow-md">
          {currentUser.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-primary font-sans">{currentUser.name}</h2>
          <p className="text-xs text-muted font-semibold mt-0.5">{currentUser.phone}</p>
          <p className="text-[10px] text-muted font-semibold">{currentUser.email}</p>
        </div>
      </div>

      {/* Orders List Accordion */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted uppercase tracking-wider pl-1">My Recent Orders</h3>
        {orders.length > 0 ? (
          <div className="space-y-2.5">
            {orders.map((ord) => (
              <div 
                key={ord.id}
                onClick={() => handleTrackOrder(ord)}
                className="glass-card p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-surface transition-colors duration-150"
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
                  <span className="text-[10px] text-muted block mt-1">{ord.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-primary">₹{ord.total}</span>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface/40 p-4 rounded-2xl border border-border text-center text-xs text-muted">
            No orders found.
          </div>
        )}
      </div>

      {/* Profile Navigation Menus */}
      <div className="glass-card rounded-3xl overflow-hidden p-0">
        
        {/* Saved Addresses */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <MapPin className="w-5 h-5 text-muted" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('savedAddresses')}</span>
              <span className="text-[10px] text-muted block mt-0.5">Manage home, office and store delivery points</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </div>

        {/* Language Toggle */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <Settings className="w-5 h-5 text-muted" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('settings')}</span>
              <span className="text-[10px] text-muted block mt-0.5">Configure language preferences</span>
            </div>
          </div>
          <div className="flex bg-background p-0.5 rounded-lg border border-border">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md ${language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ta')}
              className={`px-2.5 py-1 text-[10px] font-black rounded-md ${language === 'ta' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
            >
              தமிழ்
            </button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <Moon className="w-5 h-5 text-muted" />
            <div>
              <span className="text-xs font-bold text-primary block">App Theme</span>
              <span className="text-[10px] text-muted block mt-0.5">Choose your visual aesthetic</span>
            </div>
          </div>
          <div className="flex bg-background p-0.5 rounded-lg border border-border">
            <button onClick={setLightTheme} className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}>
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button onClick={setDarkTheme} className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}>
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button onClick={setSystemTheme} className={`p-1.5 rounded-md ${theme === 'system' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150">
          <div className="flex items-center space-x-3 text-left">
            <HelpCircle className="w-5 h-5 text-muted" />
            <div>
              <span className="text-xs font-bold text-primary block">{t('helpSupport')}</span>
              <span className="text-[10px] text-muted block mt-0.5">Contact customer helpline or browse FAQs</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted" />
        </div>

        {/* Contact Shop - Call */}
        <div 
          onClick={() => window.open('tel:+919876543210', '_self')}
          className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150 group"
        >
          <div className="flex items-center space-x-3 text-left">
            <Phone className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
            <div>
              <span className="text-xs font-bold text-primary block">Call Shop</span>
              <span className="text-[10px] text-muted block mt-0.5">Talk to our store representative</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        </div>

        {/* Contact Shop - WhatsApp */}
        <div 
          onClick={() => window.open('https://wa.me/919876543210', '_blank')}
          className="px-5 py-4 flex items-center justify-between border-b border-border hover:bg-surface cursor-pointer transition-colors duration-150 group"
        >
          <div className="flex items-center space-x-3 text-left">
            <MessageCircle className="w-5 h-5 text-green-600 opacity-70 group-hover:opacity-100 transition-opacity" />
            <div>
              <span className="text-xs font-bold text-green-600 block">WhatsApp Us</span>
              <span className="text-[10px] text-muted block mt-0.5">Chat instantly for fast support</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
        </div>

        {/* Logout */}
        <div 
          onClick={handleLogout}
          className="px-5 py-4 flex items-center justify-between hover:bg-red-50 cursor-pointer transition-colors duration-150 group"
        >
          <div className="flex items-center space-x-3 text-left">
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" />
            <div>
              <span className="text-xs font-bold text-red-500 block">Logout</span>
              <span className="text-[10px] text-red-400/70 block mt-0.5">End your current session securely</span>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
