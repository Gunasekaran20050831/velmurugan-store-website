import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export default function WishlistPage({ onNavigate }) {
  const { t } = useLanguage();
  const { wishlistItems } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-400 border border-red-100 animate-pulse">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-primary font-sans">{t('cartEmpty')} (Wishlist)</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed px-6">
            Keep track of items you love. Tap the heart icon on any product card to save it here.
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-6">
      
      {/* Back button */}
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('navHome')}</span>
      </button>

      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('navWishlist')}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
        {wishlistItems.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onNavigate={onNavigate} 
          />
        ))}
      </div>

    </div>
  );
}
