import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useApp } from '@/context/AppContext';
import { ArrowLeft, ShieldCheck, CreditCard, DollarSign, Loader2 } from 'lucide-react';

export default function PaymentPage({ onNavigate }) {
  const { t } = useLanguage();
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { createOrder, currentUser } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // COD, RAZORPAY
  const [checkoutMeta, setCheckoutMeta] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  
  useEffect(() => {
    const savedMeta = localStorage.getItem('vstore_checkout_meta');
    if (savedMeta) {
      setCheckoutMeta(JSON.parse(savedMeta));
    }
  }, []);

  const subtotal = getSubtotal();
  const deliveryCharge = checkoutMeta ? checkoutMeta.deliveryCharge : 0;
  const totalAmount = subtotal + deliveryCharge;

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    setIsProcessing(true);

    if (paymentMethod === 'COD') {
      // Direct success for Cash On Delivery
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
    } else if (paymentMethod === 'RAZORPAY') {
      try {
        // 1. Create order on backend
        const response = await fetch('http://localhost:5000/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
          })
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to create payment order');
        }

        const razorpayOrderId = data.order_id;

        // 2. Open Razorpay Checkout Modal
        const options = {
          key: "rzp_test_mock_key_id", // Replace with real key in production frontend if needed, though usually signature handles it
          amount: data.amount,
          currency: data.currency,
          name: t('brandName'),
          description: "Premium Purchase",
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              setIsProcessing(true);
              const internalOrderId = `VMS${Math.floor(10000 + Math.random() * 90000)}`;

              // 3. Verify signature on backend
              const verifyRes = await fetch('http://localhost:5000/api/payment/verify-signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: totalAmount,
                  internal_order_id: internalOrderId,
                  customer_phone: currentUser ? currentUser.phone : "+91 98876 43210"
                })
              });

              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                // Success! Create order locally
                const order = createOrder(
                  cartItems, 
                  subtotal, 
                  checkoutMeta?.deliveryOption || 'delivery', 
                  'Razorpay (Paid)'
                );
                // Override the generated ID with the one we passed to backend
                order.id = internalOrderId; 
                order.paymentId = response.razorpay_payment_id;

                clearCart();
                setIsProcessing(false);
                onNavigate('order-success', order);
              } else {
                throw new Error("Payment Verification Failed.");
              }
            } catch (err) {
              setPaymentError(err.message || 'Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: currentUser ? currentUser.name : "Velmurugan Customer",
            email: currentUser ? currentUser.email : "user@example.com",
            contact: currentUser ? currentUser.phone : "9887643210"
          },
          theme: {
            color: "#0A235C"
          }
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response){
          setPaymentError(response.error.description || 'Payment failed. Please try again.');
          setIsProcessing(false);
        });

        rzp.open();

      } catch (err) {
        setPaymentError(err.message || 'Server error. Please try again later.');
        setIsProcessing(false);
      }
    }
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

      {paymentError && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-xs font-bold border border-red-100 flex justify-between items-center">
          <span>{paymentError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Payment Methods Form */}
        <form onSubmit={handlePaymentSubmit} className="lg:col-span-2 space-y-4">
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-gray-150 space-y-4 shadow-sm">
            
            {/* Online Payment Options */}
            <div className="space-y-3 text-left">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Secure Online Payment</label>
              
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-150 bg-white/40 hover:bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="RAZORPAY"
                    checked={paymentMethod === 'RAZORPAY'}
                    onChange={() => setPaymentMethod('RAZORPAY')}
                    className="text-primary focus:ring-primary w-4 h-4"
                  />
                  <CreditCard className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block">Razorpay Checkout</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">UPI, Credit/Debit Cards, NetBanking, Wallets</span>
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
              <span>{paymentMethod === 'RAZORPAY' ? 'Proceed to Pay' : t('payNow')}</span>
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
    </div>
  );
}
