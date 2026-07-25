import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { Search, MapPin, Globe, Heart, ShoppingCart, User, ChevronDown, Check, Bell, Mic } from 'lucide-react';
import logoImage from '@/assets/images/velmurugan_logo.jpg';

export default function Header({ onNavigate, currentPage }) {
  const { language, setLanguage, t } = useLanguage();
  const { cartItems, wishlistItems } = useCart();
  const { deliveryLocation, products, updatePinnedLocation } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const notifications = [
    { id: 1, title: 'Order Confirmed', message: 'Your order #VS1024 has been confirmed.', time: '10 mins ago', read: false },
    { id: 2, title: 'Preparing', message: 'Your items are being packed.', time: '5 mins ago', read: false },
  ];
  
  const suggestionsRef = useRef(null);
  const langDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Address lookup options
  const [addressSearch, setAddressSearch] = useState('');
  const [mockAddresses] = useState([
    { name: "Anna Nagar, Chennai", lat: 13.0850, lng: 80.2101, dist: 1.2 },
    { name: "Nungambakkam, Chennai", lat: 13.0620, lng: 80.2400, dist: 3.5 },
    { name: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341, dist: 5.8 },
    { name: "Adyar, Chennai", lat: 13.0063, lng: 80.2574, dist: 9.4 },
    { name: "Velachery, Chennai", lat: 12.9815, lng: 80.2196, dist: 11.2 },
  ]);

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLangDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for suggestions
  const suggestions = searchQuery.trim() === '' ? [] : products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const nameTaMatch = product.nameTa.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || nameTaMatch || catMatch;
  }).slice(0, 5);

  const handleSuggestionClick = (product) => {
    setSearchQuery('');
    setShowSuggestions(false);
    onNavigate('product-details', product);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLangDropdown(false);
  };

  const handleSelectAddress = (addr) => {
    updatePinnedLocation(addr.lat, addr.lng, addr.name + ", Tamil Nadu", addr.dist);
    setShowLocationModal(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel shadow-premium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo Crest */}
            <div 
              className="flex items-center cursor-pointer space-x-3 shrink-0" 
              onClick={() => onNavigate('home')}
            >
              {/* Golden Shield Crest SVG */}
              <div className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark shadow-md border border-accent/30 overflow-hidden">
                <img src={logoImage} alt="Velmurugan Store Logo" className="w-full h-full object-contain bg-white" />
                {/* Glow Ring */}
                <div className="absolute inset-0 rounded-xl border border-accent/20 animate-pulse pointer-events-none"></div>
              </div>
              <div className="hidden sm:block">
                <span className="block text-lg font-extrabold tracking-tight text-primary leading-none font-sans">{t('brandName')}</span>
                <span className="block text-[10px] font-bold text-accent uppercase tracking-widest mt-0.5">{t('tagline')}</span>
              </div>
            </div>

            {/* Rapido Style Location Selector */}
            <div 
              className="hidden md:flex items-center space-x-2 bg-primary/5 hover:bg-primary/10 transition-colors duration-200 px-4 py-2.5 rounded-full cursor-pointer border border-primary/10 max-w-xs truncate"
              onClick={() => setShowLocationModal(true)}
            >
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <div className="text-left text-xs truncate">
                <span className="block text-[10px] text-gray-500 font-medium uppercase leading-none">{t('deliverTo')}</span>
                <span className="font-bold text-primary truncate block mt-0.5 max-w-[150px]">{deliveryLocation.address}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-primary shrink-0" />
            </div>

            {/* Search Bar with Autocomplete Suggestions */}
            <div className="relative flex-1 max-w-md mx-2" ref={suggestionsRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full pl-10 pr-12 py-2.5 rounded-full text-sm glass-input text-gray-900 placeholder-gray-500 focus:outline-none"
                />
                <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                <button 
                  onClick={() => setIsListening(!isListening)}
                  className={`absolute right-2.5 top-2 p-1 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-400'}`}
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions Panel */}
              {showSuggestions && searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-premium border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-2 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    {t('searchSuggested')}
                  </div>
                  {suggestions.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {suggestions.map((prod) => (
                        <div
                          key={prod.id}
                          className="px-4 py-3 hover:bg-primary/5 cursor-pointer flex items-center space-x-3 transition-colors duration-150"
                          onClick={() => handleSuggestionClick(prod)}
                        >
                          <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 rounded-lg object-cover bg-gray-100 border border-gray-100" />
                          <div className="text-xs text-left">
                            <span className="font-bold text-primary block">{language === 'ta' ? prod.nameTa : prod.name}</span>
                            <span className="text-[10px] text-accent font-semibold">{language === 'ta' ? prod.categoryTa : prod.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-xs text-gray-400 text-center">
                      No results for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Switch / Wishlist / Cart / Profile */}
            <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
              
              {/* Instant Language Toggle Globe */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                  className="p-2.5 hover:bg-primary/5 rounded-full text-primary hover:text-accent transition-all duration-200 border border-transparent hover:border-primary/10"
                  aria-label="Toggle language"
                >
                  <Globe className="w-5 h-5" />
                </button>

                {showLangDropdown && (
                  <div className="absolute right-0 mt-2.5 w-40 bg-white/95 backdrop-blur-md rounded-xl shadow-premium border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full px-4 py-2.5 text-xs text-left flex items-center justify-between hover:bg-primary/5 font-semibold ${language === 'en' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
                    >
                      <span className="flex items-center">🇬🇧 {t('english')}</span>
                      {language === 'en' && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                    <button
                      onClick={() => handleLanguageChange('ta')}
                      className={`w-full px-4 py-2.5 text-xs text-left flex items-center justify-between hover:bg-primary/5 font-semibold ${language === 'ta' ? 'text-primary bg-primary/5' : 'text-gray-600'}`}
                    >
                      <span className="flex items-center">🇮🇳 {t('tamil')}</span>
                      {language === 'ta' && <Check className="w-3.5 h-3.5 text-accent" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 hover:bg-primary/5 rounded-full text-primary hover:text-accent transition-all duration-200 border border-transparent hover:border-primary/10 relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-premium border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Notifications</span>
                    </div>
                    <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-primary/5 cursor-pointer transition-colors">
                          <p className="text-sm font-bold text-primary">{notif.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button 
                onClick={() => onNavigate('wishlist')}
                className={`p-2.5 hover:bg-primary/5 rounded-full text-primary transition-all duration-200 border border-transparent hover:border-primary/10 relative ${currentPage === 'wishlist' ? 'bg-primary/5 text-accent border-primary/10' : ''}`}
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-bounce">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button 
                onClick={() => onNavigate('cart')}
                className={`p-2.5 hover:bg-primary/5 rounded-full text-primary transition-all duration-200 border border-transparent hover:border-primary/10 relative ${currentPage === 'cart' ? 'bg-primary/5 text-accent border-primary/10' : ''}`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* Profile */}
              <button 
                onClick={() => onNavigate('profile')}
                className={`p-2.5 hover:bg-primary/5 rounded-full text-primary transition-all duration-200 border border-transparent hover:border-primary/10 ${currentPage === 'profile' ? 'bg-primary/5 text-accent border-primary/10' : ''}`}
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Rapido Location Selection Modal Overlay */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-primary font-sans">{t('selectLocation')}</h3>
                <button 
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-sm font-semibold p-1 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              {/* Location search bar */}
              <div className="relative mb-5">
                <input 
                  type="text"
                  placeholder={t('searchLocPlaceholder')}
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:bg-white"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {mockAddresses
                  .filter(addr => addr.name.toLowerCase().includes(addressSearch.toLowerCase()))
                  .map((addr, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleSelectAddress(addr)}
                      className="flex items-start space-x-3 p-3 hover:bg-primary/5 rounded-2xl cursor-pointer transition-colors duration-150 group"
                    >
                      <MapPin className="w-4 h-4 text-gray-400 group-hover:text-accent mt-0.5 shrink-0" />
                      <div className="text-left text-xs">
                        <span className="font-bold text-primary block">{addr.name}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{addr.dist} km from Velmurugan Store</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => {
                  // Simulate GPS geolocation loading
                  updatePinnedLocation(13.0827, 80.2707, "T Nagar, Chennai, Tamil Nadu 600017", 1.8);
                  setShowLocationModal(false);
                }}
                className="luxury-btn-secondary px-4 py-2 rounded-xl text-xs font-bold w-full"
              >
                📡 {t('detectCurrentLoc')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
