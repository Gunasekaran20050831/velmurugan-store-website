import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard/ProductCard';
import { Heart, Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw, Share2 } from 'lucide-react';

export default function ProductDetails({ product, onNavigate }) {
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { products } = useApp();

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const isWish = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  // Filter related products in the same category (excluding current product)
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product);
      onNavigate('cart');
    }
  };

  const handleShare = () => {
    alert("Share Modal: Share via WhatsApp, Facebook, Instagram, or Copy Link");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-8">
      {/* Back Button */}
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('navHome')}</span>
      </button>

      {/* Main product display grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Images Gallery Panel */}
        <div className="space-y-4">
          <div className="relative pt-[80%] bg-gray-50 rounded-3xl overflow-hidden border border-gray-150 shadow-inner">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg">
                  {t('outOfStock')}
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnails list */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-18 h-18 rounded-2xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all ${activeImage === img ? 'border-accent shadow-md scale-105' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details info Panel */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {language === 'ta' ? product.categoryTa : product.category}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-gray-50 border border-gray-150 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-full border transition-all duration-200 ${isWish ? 'bg-red-50 border-red-100 text-red-500 scale-110' : 'bg-gray-50 border-gray-150 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart className={`w-5 h-5 ${isWish ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            <h1 className="text-2xl font-extrabold text-primary font-sans leading-snug">
              {language === 'ta' ? product.nameTa : product.name}
            </h1>

            {/* Rating summary */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-900">{product.rating}</span>
              <span className="text-xs text-gray-400 font-semibold">({product.ratingCount} {t('ratingCount')})</span>
            </div>
          </div>

          <hr className="border-gray-150" />

          {/* Pricing Details */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-primary">₹{product.price}</span>
              <span className="text-sm text-gray-400 line-through">₹{Math.floor(product.price * 1.25)}</span>
              <span className="text-xs text-green-600 font-bold uppercase tracking-wider">20% Off</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold">Inclusive of all local taxes</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">{t('productDesc')}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'ta' ? product.descriptionTa : product.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`flex-1 py-4.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 transition-all duration-200 border ${
                isOutOfStock 
                  ? 'bg-gray-100 text-gray-400 border-gray-150 cursor-not-allowed' 
                  : 'bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{t('addToCart')}</span>
            </button>
            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`flex-1 py-4.5 rounded-2xl text-xs font-extrabold text-white transition-all duration-200 ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'luxury-btn-gold'
              }`}
            >
              {t('buyNow')}
            </button>
          </div>

          {/* Delivery Policy Ribbons */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50/80 border border-gray-150/60 p-4 rounded-2xl text-center">
            <div className="flex flex-col items-center space-y-1">
              <Truck className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold text-primary">Express Delivery</span>
            </div>
            <div className="flex flex-col items-center space-y-1 border-x border-gray-150">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold text-primary">100% Quality Guarantee</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <RefreshCw className="w-4 h-4 text-primary" />
              <span className="text-[9px] font-bold text-primary">Easy Replacement</span>
            </div>
          </div>

        </div>
      </div>

      {/* Specifications details */}
      <section className="bg-white/50 backdrop-blur-sm border border-gray-150/85 p-6 rounded-3xl space-y-4">
        <h3 className="text-sm font-extrabold text-primary font-sans">{t('specifications')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {product.specifications.map((spec, index) => (
            <div key={index} className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-xs text-gray-500 font-medium">{spec.key}</span>
              <span className="text-xs text-primary font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Review details */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold text-primary font-sans">{t('reviews')}</h3>
        <div className="space-y-4">
          {product.reviews.map((rev) => (
            <div key={rev.id} className="bg-white/30 backdrop-blur-xs border border-gray-100 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary">{rev.user}</span>
                <span className="text-[10px] text-gray-400 font-semibold">{rev.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < rev.rating ? 'fill-current' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {t('verifiedPurchase')}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-extrabold text-primary font-sans">{t('relatedProducts')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
