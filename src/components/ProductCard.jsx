import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Heart, Star, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, onNavigate }) {
  const { language, t } = useLanguage();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWish = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product);
      onNavigate('cart');
    }
  };

  return (
    <div 
      onClick={() => onNavigate('product-details', product)}
      className="glass-card group flex flex-col justify-between h-full rounded-3xl overflow-hidden cursor-pointer"
    >
      <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${isWish ? 'bg-red-50 text-red-500 scale-110' : 'bg-white/70 text-gray-400 hover:text-red-500 hover:bg-white'}`}
        >
          <Heart className={`w-4 h-4 ${isWish ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Out of Stock Banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
              {t('outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
            {language === 'ta' ? product.categoryTa : product.category}
          </span>
          
          {/* Product Name */}
          <h4 className="text-sm font-bold text-primary mt-1 line-clamp-1 group-hover:text-accent transition-colors duration-200">
            {language === 'ta' ? product.nameTa : product.name}
          </h4>

          {/* Product Description */}
          <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {language === 'ta' ? product.descriptionTa : product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mt-2.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-500 font-bold">
              {product.rating} ({product.ratingCount})
            </span>
          </div>
        </div>

        <div className="mt-4">
          {/* Price - Stock quantity is NEVER shown */}
          <div className="flex items-baseline space-x-1.5 mb-3">
            <span className="text-base font-extrabold text-primary">₹{product.price}</span>
            <span className="text-xs text-gray-400 line-through">₹{Math.floor(product.price * 1.25)}</span>
            <span className="text-[9px] text-green-600 font-bold uppercase tracking-wider">20% off</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={`py-2 rounded-xl text-[10px] font-bold transition-all duration-200 flex items-center justify-center space-x-1 border ${isOutOfStock ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary'}`}
            >
              <ShoppingBag className="w-3 h-3 shrink-0" />
              <span>{t('addToCart')}</span>
            </button>
            <button
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className={`py-2 rounded-xl text-[10px] font-bold transition-all duration-200 ${isOutOfStock ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white shadow-sm'}`}
            >
              {t('buyNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
