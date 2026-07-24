import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ShieldCheck, Landmark, Smartphone, DollarSign, Loader2 } from 'lucide-react';

export default function PaymentPage({ onNavigate }) {
  const { t } = useLanguage();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { createOrder } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('UPI_GPAY'); // COD, UPI_GPAY, UPI_PHONEPE, UPI_PAYTM
  const [checkoutMeta, setCheckoutMeta] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  
  // UPI PIN states
  const [pinInputs, setPinInputs] = useState(['', '', '', '']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    // Generate order ID
    setOrderId(`VMS${Math.floor(10000 + Math.random() * 90000)}`);
    const savedMeta = localStorage.getItem('vstore_checkout_meta');
    if (savedMeta) {
      setCheckoutMeta(JSON.parse(savedMeta));
    }
  }, []);

  const subtotal = getSubtotal();
  const deliveryCharge = checkoutMeta ? checkoutMeta.deliveryCharge : 0;
  const totalAmount = subtotal + deliveryCharge;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === 'COD') {
      // Direct success for Cash On Delivery
      setIsProcessing(true);
      setTimeout(() => {
        const order = createOrder(
          cartItems, 
          subtotal, 
          checkoutMeta?.deliveryOption || 'delivery', 
          'COD'
        );
        clearCart();
        setIsProcessing(false);
        onNavigate('order-success', order);
      }, 1500);
    } else {
      // Trigger UPI Pin entry simulator
      setShowPinModal(true);
    }
  };

  const handlePinChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setPinInputs([...pinInputs.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleAuthorizePayment = () => {
    const pin = pinInputs.join('');
    if (pin.length < 4) return;

    setIsProcessing(true);
    setShowPinModal(false);

    // Simulated network latency
    setTimeout(() => {
      let upiBrand = 'UPI';
      if (paymentMethod === 'UPI_GPAY') upiBrand = 'Google Pay';
      if (paymentMethod === 'UPI_PHONEPE') upiBrand = 'PhonePe';
      if (paymentMethod === 'UPI_PAYTM') upiBrand = 'Paytm';

      const order = createOrder(
        cartItems, 
        subtotal, 
        checkoutMeta?.deliveryOption || 'delivery', 
        `UPI (${upiBrand})`
      );
      clearCart();
      setIsProcessing(false);
      onNavigate('order-success', order);
    }, 2200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-left space-y-6">
      
      {/* Back button */}
      <button 
        onClick={() => onNavigate('checkout')}
        className="flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors duration-150 py-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">{t('checkoutTitle')}</span>
      </button>

      <h1 className="text-2xl font-extrabold text-primary font-sans">{t('paymentTitle')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Payment Methods Form */}
        <form onSubmit={handlePaymentSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-4 shadow-sm">
            
            {/* UPI Options */}
            <div className="space-y-3 text-left">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">UPI Applications</label>
              
              {/* Google Pay */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'UPI_GPAY' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI_GPAY"
                    checked={paymentMethod === 'UPI_GPAY'}
                    onChange={() => setPaymentMethod('UPI_GPAY')}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block">Google Pay</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('upiDesc')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">₹{totalAmount}</span>
              </label>

              {/* PhonePe */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'UPI_PHONEPE' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI_PHONEPE"
                    checked={paymentMethod === 'UPI_PHONEPE'}
                    onChange={() => setPaymentMethod('UPI_PHONEPE')}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block">PhonePe</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('upiDesc')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">₹{totalAmount}</span>
              </label>

              {/* Paytm */}
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'UPI_PAYTM' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="UPI_PAYTM"
                    checked={paymentMethod === 'UPI_PAYTM'}
                    onChange={() => setPaymentMethod('UPI_PAYTM')}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <Smartphone className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block">Paytm</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('upiDesc')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">₹{totalAmount}</span>
              </label>
            </div>

            <hr className="border-gray-150 my-4" />

            {/* COD Option */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Offline payment</label>
              
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <DollarSign className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block">{t('cod')}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('codDesc')}</span>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">₹{totalAmount}</span>
              </label>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full luxury-btn-gold py-4.5 rounded-2xl text-xs font-extrabold text-white flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('processingPayment')}</span>
              </>
            ) : (
              <span>{t('payNow')}</span>
            )}
          </button>
        </form>

        {/* Cost breakdown */}
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

          <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-bold justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>256-Bit SSL Secured Encryption Gateway</span>
          </div>
        </div>

      </div>

      {/* UPI PIN secure authentication overlay modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden text-center animate-in zoom-in-95 duration-200">
            <div className="bg-primary text-white p-6 text-left">
              <span className="text-[10px] text-accent font-bold uppercase tracking-wider">{t('upiSimTitle')}</span>
              <h3 className="text-base font-extrabold font-sans mt-0.5">{t('upiSimSubtitle')}</h3>
            </div>

            <div className="p-6 space-y-5 text-left">
              {/* Receipt details */}
              <div className="bg-gray-50 p-4 rounded-2xl space-y-2 border border-gray-150">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">{t('merchantName')}</span>
                  <span className="text-primary">{t('brandName')}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">{t('merchantUpi')}</span>
                  <span className="text-primary font-mono text-[10px]">velmuruganstore@upi</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-500">{t('orderId')}</span>
                  <span className="text-primary font-mono text-[10px]">{orderId}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xs font-black">
                  <span className="text-gray-500">{t('amountToPay')}</span>
                  <span className="text-accent-dark">₹{totalAmount}</span>
                </div>
              </div>

              {/* Pin inputs */}
              <div className="text-center">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">{t('enterUpiPin')}</label>
                <div className="flex justify-center gap-3">
                  {pinInputs.map((data, index) => (
                    <input
                      key={index}
                      type="password"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handlePinChange(e.target, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-10 h-10 text-center text-lg font-black border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-gray-50"
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-500 text-center"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizePayment}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-xs font-bold shadow-md text-center"
                >
                  {t('upiConfirmBtn')}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
