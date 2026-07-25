import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import { 
  BarChart3, Package, ClipboardList, Users, ShieldAlert, 
  Map, ArrowLeft, RefreshCw, FolderTree, Tag, PieChart, FileText, Settings 
} from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

import AdminOverview from './AdminOverview';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminDelivery from './AdminDelivery';

// New placeholders for CMS
const AdminCategories = () => <div className="p-8 text-center text-gray-500">Categories Module - Coming Soon</div>;
const AdminCustomers = () => <div className="p-8 text-center text-gray-500">Customers Module - Coming Soon</div>;
const AdminCoupons = () => <div className="p-8 text-center text-gray-500">Coupons Module - Coming Soon</div>;
const AdminAnalytics = () => <div className="p-8 text-center text-gray-500">Analytics Module - Coming Soon</div>;
const AdminReports = () => <div className="p-8 text-center text-gray-500">Reports Module - Coming Soon</div>;
const AdminSettings = () => <div className="p-8 text-center text-gray-500">Settings Module - Coming Soon</div>;

export default function AdminPanel({ onNavigate }) {
  const { language, t } = useLanguage();
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard');

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

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="relative min-h-screen pt-4 pb-20 md:pb-8 flex flex-col md:flex-row gap-6 lg:gap-8">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-2 relative">
        <div className="md:sticky md:top-24 space-y-2">
          
          {/* Header Info */}
          <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-100 shadow-sm p-0.5 overflow-hidden">
              <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-primary">Velmurugan Admin</h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Control Center</span>
            </div>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-1 custom-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 border ${activeTab === tab.id ? 'bg-primary text-white shadow-md border-primary/20' : 'bg-white/60 backdrop-blur-md text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-primary'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-1.5 text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === 'dashboard' && <AdminOverview />}
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'customers' && <AdminCustomers />}
        {activeTab === 'coupons' && <AdminCoupons />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'reports' && <AdminReports />}
        {activeTab === 'settings' && <AdminSettings />}
        {activeTab === 'delivery' && <AdminDelivery />}
      </div>
      
    </div>
  );
}
