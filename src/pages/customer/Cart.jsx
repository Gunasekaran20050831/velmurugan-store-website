import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function CartPage({ onNavigate }) {
  const { language, t } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();

  const subtotal = getSubtotal();
  const deliveryEstimated = subtotal > 500 ? 0 : 40; // Simulated estimate before checkout map details
  const totalAmount = subtotal + deliveryEstimated;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10">
          <ShoppingBag className="w-8 h-8 text-accent" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-extrabold text-primary font-sans">{t('cartEmpty')}</h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            Explore our premium grocery selections and fill your kitchen with the best staples.
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
      
      {/* Back to Home */}
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('navHome')}</span>
      </button>

      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('myCart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-gray-150 flex items-center justify-between gap-4 shadow-sm"
            >
              <img 
                src={item.images[0]} 
                alt={item.name} 
                className="w-16 h-16 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0" 
              />
              
              <div className="flex-1 min-w-0 text-left">
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                  {language === 'ta' ? item.categoryTa : item.category}
                </span>
                <h4 className="text-xs font-extrabold text-primary truncate">
                  {language === 'ta' ? item.nameTa : item.name}
                </h4>
                <span className="text-xs font-black text-primary block mt-1">₹{item.price}</span>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center border border-gray-150 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-2 hover:bg-gray-150 text-gray-500 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-black text-primary">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-gray-150 text-gray-500 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Delete button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all duration-200"
                title={t('remove')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Cost Summary */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">{t('orderSummary')}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t('itemTotal')}</span>
              <span className="text-primary font-bold">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t('deliveryCharge')} (Est.)</span>
              <span className="text-primary font-bold">
                {deliveryEstimated === 0 ? (
                  <span className="text-green-600 uppercase font-black text-[10px] tracking-wider">{t('free')}</span>
                ) : (
                  `₹${deliveryEstimated}`
                )}
              </span>
            </div>

            <hr className="border-gray-150" />

            <div className="flex justify-between text-sm font-extrabold text-primary">
              <span>{t('totalAmount')}</span>
              <span className="text-accent-dark">₹{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('checkout')}
            className="w-full luxury-btn-gold py-4 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center space-x-2"
          >
            <span>{t('proceedToCheckout')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
