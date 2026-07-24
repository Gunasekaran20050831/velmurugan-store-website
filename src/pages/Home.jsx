import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, Flame, Star, Sparkles, Clock, ArrowRight } from 'lucide-react';

export default function Home({ onNavigate }) {
  const { language, t } = useLanguage();
  const { cartItems, getSubtotal } = useCart();
  const { products } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories list
  const categories = [
    { id: 'All', label: 'All', labelTa: 'அனைத்தும்', icon: '🛍️' },
    { id: 'Fruits & Veg', label: 'Fruits & Veg', labelTa: 'பழங்கள் & காய்', icon: '🍎' },
    { id: 'Dairy & Eggs', label: 'Dairy & Eggs', labelTa: 'பால் & முட்டை', icon: '🥛' },
    { id: 'Staples', label: 'Staples', labelTa: 'மளிகை', icon: '🌾' },
    { id: 'Personal Care', label: 'Personal Care', labelTa: 'பராமரிப்பு', icon: '🧼' }
  ];

  // Filtering products by category
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Grouped products for sections
  const featured = products.filter(p => p.rating >= 4.5 && p.stock > 0).slice(0, 3);
  const bestSellers = products.filter(p => p.ratingCount >= 100).slice(0, 3);
  const recentlyAdded = products.filter(p => p.id >= 3).slice(0, 3);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Premium Hero Banner Carousel Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-[#051438] text-white p-8 sm:p-10 border border-primary/20 shadow-premium">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary-light/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-left">
          <span className="inline-flex items-center space-x-1 bg-accent/20 border border-accent/30 text-accent text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{t('megaSale')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
            {t('upTo50Off')}
          </h2>
          <p className="text-xs text-gray-300 font-semibold mt-2 max-w-xs leading-relaxed">
            {t('onAllProducts')}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('categories')}
              className="luxury-btn-gold px-5 py-2.5 rounded-full text-xs font-bold flex items-center space-x-1.5"
            >
              <span>{t('shopNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Abstract Artwork in Hero representing premium catalog */}
        <div className="absolute right-8 bottom-0 top-0 hidden md:flex items-center justify-center pointer-events-none">
          <svg className="w-64 h-64 text-accent/10 animate-spin" style={{ animationDuration: '30s' }} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <path d="M100 10V190" stroke="currentColor" strokeWidth="1" />
            <path d="M10 100H190" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Categories Row */}
      <section className="text-left">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-base font-extrabold text-primary font-sans">{t('categoriesTitle')}</h3>
          <button onClick={() => onNavigate('categories')} className="text-xs font-bold text-accent hover:underline flex items-center space-x-1">
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-bold shrink-0 transition-all duration-250 border ${
                activeCategory === cat.id 
                  ? 'bg-primary text-white border-primary shadow-premium' 
                  : 'bg-white text-gray-500 border-gray-150/80 hover:bg-gray-50'
              }`}
            >
              <span className="text-base leading-none">{cat.icon}</span>
              <span>{language === 'ta' ? cat.labelTa : cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Dynamic Products Grid based on selected category */}
      {activeCategory !== 'All' && (
        <section className="text-left animate-in fade-in duration-300">
          <h3 className="text-base font-extrabold text-primary mb-4 font-sans capitalize">
            {language === 'ta' 
              ? categories.find(c => c.id === activeCategory)?.labelTa 
              : activeCategory}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Standard Home Page Sections (when category is 'All') */}
      {activeCategory === 'All' && (
        <>
          {/* Featured Products */}
          <section className="text-left">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <h3 className="text-base font-extrabold text-primary font-sans">{t('featuredProducts')}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          {/* Best Sellers */}
          <section className="text-left">
            <div className="flex items-center space-x-2 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="text-base font-extrabold text-primary font-sans">{t('bestSellers')}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </section>

          {/* Recently Added */}
          <section className="text-left">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-accent" />
              <h3 className="text-base font-extrabold text-primary font-sans">{t('recentlyAdded')}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recentlyAdded.map(product => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Swiggy Style Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 z-40 max-w-xl mx-auto animate-in slide-in-from-bottom-8 duration-300">
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-5 py-4 rounded-2xl flex items-center justify-between shadow-2xl border border-white/10">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-2 bg-white/10 rounded-xl">
                <ShoppingCart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <span className="block text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
                <span className="block text-sm font-extrabold">₹{getSubtotal()}</span>
              </div>
            </div>
            <button 
              onClick={() => onNavigate('cart')}
              className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 transition-colors duration-150"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
