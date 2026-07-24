import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import LeafletMap from '../components/LeafletMap';
import { ArrowLeft, ShoppingBag, MapPin, Navigation, Truck, ClipboardCheck } from 'lucide-react';

export default function CheckoutPage({ onNavigate }) {
  const { language, t } = useLanguage();
  const { cartItems, getSubtotal } = useCart();
  const { deliveryLocation, updatePinnedLocation, calculateDeliveryFee } = useApp();

  const [deliveryOption, setDeliveryOption] = useState('delivery'); // pickup or delivery
  const [flatNumber, setFlatNumber] = useState('');
  const [landmark, setLandmark] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const subtotal = getSubtotal();
  const deliveryCharge = deliveryOption === 'pickup' ? 0 : deliveryLocation.charge;
  const totalAmount = subtotal + deliveryCharge;

  // Handle location update from map drag or search
  const handleLocationUpdate = (lat, lng, address, distance) => {
    updatePinnedLocation(lat, lng, address, distance);
  };

  const handleProceedToPayment = () => {
    if (deliveryOption === 'delivery') {
      if (!flatNumber.trim()) {
        setErrorMsg("Please enter flat/house number details.");
        return;
      }
    }
    setErrorMsg('');
    // Save metadata in session to generate order
    localStorage.setItem('vstore_checkout_meta', JSON.stringify({
      deliveryOption,
      flatNumber,
      landmark,
      deliveryCharge
    }));
    onNavigate('payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-6">
      
      {/* Back to Cart */}
      <button 
        onClick={() => onNavigate('cart')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('myCart')}</span>
      </button>

      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('checkoutTitle')}</h1>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Form Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Option Selector */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">{t('deliveryOption')}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pickup Option */}
              <div 
                onClick={() => setDeliveryOption('pickup')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryOption === 'pickup' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className={`p-2 rounded-xl ${deliveryOption === 'pickup' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-primary">{t('storePickup')}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-relaxed">{t('storePickupDesc')}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Option */}
              <div 
                onClick={() => setDeliveryOption('delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${deliveryOption === 'delivery' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}
              >
                <div className="flex items-center space-x-3 text-left">
                  <div className={`p-2 rounded-xl ${deliveryOption === 'delivery' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-primary">{t('homeDelivery')}</h4>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-relaxed">{t('homeDeliveryDesc')}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Location Map Selection (if Delivery Selected) */}
          {deliveryOption === 'delivery' ? (
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-4 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">{t('pinnedLocation')}</h3>
              
              {/* Interactive OpenStreetMap Map component */}
              <LeafletMap 
                onLocationSelected={handleLocationUpdate}
                initialLat={deliveryLocation.lat}
                initialLng={deliveryLocation.lng}
              />

              {/* Distance details */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-150/70">
                <div className="text-xs">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">{t('distanceFromStore')}</span>
                  <span className="text-sm font-extrabold text-primary block mt-0.5">{deliveryLocation.distance} km</span>
                </div>
                <div className="text-xs">
                  <span className="text-[10px] text-gray-400 font-bold block uppercase">{t('deliveryCharge')}</span>
                  <span className="text-sm font-extrabold text-accent-dark block mt-0.5">₹{deliveryLocation.charge}</span>
                </div>
              </div>

              {/* Address Form Details */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Flat / House No. / Building Name *</label>
                  <input 
                    type="text"
                    placeholder="e.g. Flat 3A, Golden Crest Apartments"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs glass-input text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Landmark / Directions (Optional)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Near Murugan Temple"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs glass-input text-gray-900"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Pickup Instructions */
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-4 shadow-sm animate-in fade-in duration-200">
              <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">Pickup Details</h3>
              <div className="p-4 bg-accent/5 rounded-2xl border border-accent/20 space-y-3">
                <div className="flex items-start space-x-3 text-xs">
                  <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-primary block">Velmurugan Store HQ</span>
                    <span className="text-gray-500 block mt-0.5 leading-relaxed">
                      12, Usman Road, T. Nagar, Chennai, Tamil Nadu 600017
                    </span>
                  </div>
                </div>
                <hr className="border-accent/15" />
                <div className="flex items-start space-x-3 text-[11px] text-primary/70 leading-relaxed font-semibold">
                  <ClipboardCheck className="w-5 h-5 text-primary shrink-0" />
                  <span>
                    Your order will be packed and ready for collection within 45 minutes of order confirmation. Please present your Order ID at the counter to retrieve it.
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Cost Summary Panel */}
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-6 shadow-sm">
          <h3 className="text-sm font-extrabold text-primary uppercase tracking-wider">{t('orderSummary')}</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t('itemTotal')}</span>
              <span className="text-primary font-bold">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{t('deliveryCharge')}</span>
              <span className="text-primary font-bold">
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 uppercase font-black text-[10px] tracking-wider">{t('free')}</span>
                ) : (
                  `₹${deliveryCharge}`
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
            onClick={handleProceedToPayment}
            className="w-full luxury-btn-gold py-4 rounded-2xl text-xs font-extrabold text-white"
          >
            {t('continueCheckout')}
          </button>
        </div>

      </div>
    </div>
  );
}
