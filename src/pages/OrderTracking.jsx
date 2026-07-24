import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { ClipboardList, CheckCircle2, ChevronRight, Phone, MessageSquare, MapPin } from 'lucide-react';

export default function OrderTracking({ order, onNavigate }) {
  const { t } = useLanguage();
  const { orders } = useApp();

  // If no order is directly passed, take the latest active order
  const activeOrder = order || orders[0];

  if (!activeOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10">
          <ClipboardList className="w-6 h-6 text-accent" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-primary font-sans">No Active Orders</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            You don't have any pending orders currently. Check out our catalog to place an order.
          </p>
        </div>
        <button
          onClick={() => onNavigate('home')}
          className="luxury-btn-primary px-8 py-3.5 rounded-xl text-xs font-bold w-full"
        >
          {t('startShopping')}
        </button>
      </div>
    );
  }

  // Define tracking timeline steps
  const steps = [
    { key: 'Pending', label: 'orderPlaced', time: '10:30 AM' },
    { key: 'Accepted', label: 'orderAccepted', time: '10:32 AM' },
    { key: 'Preparing', label: 'orderPreparing', time: '10:35 AM' },
    { key: 'Out For Delivery', label: 'outForDelivery', time: '10:50 AM' },
    { key: 'Delivered', label: 'delivered', time: '11:05 AM' }
  ];

  // Helper to determine active status in index comparison
  const getStatusIndex = (status) => {
    const statuses = ['Pending', 'Accepted', 'Preparing', 'Out For Delivery', 'Delivered'];
    return statuses.indexOf(status);
  };

  const currentIndex = getStatusIndex(activeOrder.status);

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-left space-y-6 pb-24">
      
      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('orderTrackingTitle')}</h1>

      {/* Order Info Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-5 rounded-3xl border border-primary/20 shadow-md flex justify-between items-center">
        <div>
          <span className="text-[10px] text-accent font-bold uppercase tracking-wider block">Active Tracking</span>
          <h4 className="text-sm font-extrabold font-sans mt-0.5">Order ID: #{activeOrder.id}</h4>
          <span className="text-[11px] text-gray-300 block mt-1">{activeOrder.date}</span>
        </div>
        <span className="text-xs font-black text-accent bg-white/10 px-3 py-1 rounded-full">
          ₹{activeOrder.total}
        </span>
      </div>

      {/* Swiggy Timeline UI */}
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 shadow-sm relative">
        
        {/* Vertical Timeline Background Line */}
        <div className="absolute top-8 bottom-8 left-[31px] w-0.5 bg-gray-200"></div>
        {/* Active Line Fill */}
        <div 
          className="absolute top-8 left-[31px] w-0.5 bg-primary transition-all duration-700 ease-in-out"
          style={{ 
            height: `${currentIndex === 4 ? 'calc(100% - 64px)' : `${(currentIndex / 4) * 100}%`}` 
          }}
        ></div>

        <div className="space-y-6">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isActive = idx === currentIndex;

            return (
              <div key={idx} className="flex items-start space-x-4 relative z-10">
                {/* Status Dot indicator */}
                <div className="shrink-0 flex items-center justify-center">
                  {isCompleted ? (
                    <div className={`w-8 h-8 rounded-full border-2 border-primary bg-white flex items-center justify-center text-primary ${isActive ? 'ring-4 ring-primary/10 animate-pulse' : ''}`}>
                      <CheckCircle2 className="w-4.5 h-4.5 fill-primary text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-gray-250 bg-white flex items-center justify-center text-gray-400">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
                    </div>
                  )}
                </div>

                {/* Text Description */}
                <div className="flex-1 pt-1">
                  <h4 className={`text-xs font-black font-sans ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                    {t(step.label)}
                  </h4>
                  {isCompleted && (
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                      Completed • {step.time}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Swiggy Style Delivery Agent Contact Card */}
      {activeOrder.status === 'Out For Delivery' && (
        <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
              {/* Ravi Kumar Avatar placeholder */}
              <span className="text-base font-extrabold text-primary font-sans">RK</span>
            </div>
            <div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">{t('deliveryPartner')}</span>
              <h4 className="text-xs font-extrabold text-primary">Ravi Kumar</h4>
              <span className="text-[10px] text-accent font-semibold block mt-0.5">⭐ 4.8 Rating</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a 
              href="tel:+919876543210" 
              className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-sm transition-colors"
              title={t('callPartner')}
            >
              <Phone className="w-4 h-4" />
            </a>
            <button 
              className="p-2.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
              title="Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delivery Address Review */}
      <div className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 shadow-sm text-left flex items-start space-x-3">
        <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div className="text-xs">
          <span className="text-[9px] text-gray-400 font-bold block uppercase">Delivery Address</span>
          <span className="text-primary font-bold block mt-0.5 leading-relaxed">{activeOrder.address}</span>
        </div>
      </div>

    </div>
  );
}
