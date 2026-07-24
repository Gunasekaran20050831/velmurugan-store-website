import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Home, Grid, ClipboardList, Heart, User } from 'lucide-react';

export default function BottomNavigation({ onNavigate, currentPage }) {
  const { t } = useLanguage();
  const { cartItems, wishlistItems } = useCart();

  const navItems = [
    { id: 'home', label: 'navHome', icon: Home },
    { id: 'categories', label: 'navCategories', icon: Grid },
    { id: 'orders', label: 'navOrders', icon: ClipboardList },
    { id: 'wishlist', label: 'navWishlist', icon: Heart, badge: 'wishlist' },
    { id: 'profile', label: 'navProfile', icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-t border-gray-100 shadow-lg px-4 py-2 flex justify-around items-center">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        
        let badgeCount = 0;
        if (item.badge === 'wishlist') {
          badgeCount = wishlistItems.length;
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center py-1 relative w-16"
          >
            <div className={`p-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-primary/5 text-accent scale-110' : 'text-gray-400'}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
            <span className={`text-[9px] font-bold mt-0.5 tracking-wider ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              {t(item.label)}
            </span>
            
            {badgeCount > 0 && (
              <span className="absolute top-0 right-3 bg-accent text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {badgeCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
