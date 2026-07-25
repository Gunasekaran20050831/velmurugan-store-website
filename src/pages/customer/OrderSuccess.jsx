import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import muruganImg from '@/assets/images/velmurugan_logo.jpg';
import confetti from 'canvas-confetti';

export default function OrderSuccess({ order, onNavigate }) {
  const { t } = useLanguage();

  useEffect(() => {
    // Launch gold & blue confetti explosion on load
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#0A235C', '#E6C35C']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#0A235C', '#E6C35C']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const handleTrack = () => {
    onNavigate('orders', order);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 text-center max-w-md mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Murugan Artwork with gold frame glow */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-accent via-accent-light to-accent-dark opacity-30 blur-md animate-pulse"></div>
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-3 border-accent/70 shadow-2xl bg-white flex items-center justify-center">
          <img 
            src={muruganImg} 
            alt="Lord Murugan Success Artwork" 
            className="w-full h-full object-contain p-2"
          />
        </div>
      </div>

      {/* Success Messages */}
      <div className="space-y-3">
        <h1 className="text-xl sm:text-2xl font-black text-primary font-sans leading-none">
          {t('orderPlacedSuccess')}
        </h1>
        <p className="text-xs text-gray-400 font-semibold leading-relaxed px-4">
          {t('orderSuccessDesc')}
        </p>
      </div>

      {/* Order Reference Card */}
      {order && (
        <div className="w-full bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-gray-150 shadow-sm text-left space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Order Reference</span>
            <span className="text-primary font-mono font-bold">#{order.id}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Total Charged</span>
            <span className="text-accent-dark font-bold">₹{order.total}</span>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-400">Payment Status</span>
            <span className="text-green-600 font-bold bg-green-50 px-2.5 py-0.5 rounded-full">{order.paymentStatus}</span>
          </div>
        </div>
      )}

      {/* Pathways */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <button
          onClick={handleTrack}
          className="flex-1 luxury-btn-primary py-3.5 rounded-xl text-xs font-bold"
        >
          {t('trackOrder')}
        </button>
        <button
          onClick={() => onNavigate('home')}
          className="flex-1 luxury-btn-secondary py-3.5 rounded-xl text-xs font-bold"
        >
          {t('continueShopping')}
        </button>
      </div>

    </div>
  );
}
