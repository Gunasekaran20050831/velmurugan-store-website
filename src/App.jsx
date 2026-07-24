import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLanguage } from './context/LanguageContext';
import { useApp } from './context/AppContext';

// Shared Components
import Header from '@/components/Navbar/Navbar';
import BottomNavigation from '@/components/Navbar/BottomNavigation';
import { ScreenLoader } from '@/components/Loader/Loader';

// Lazy Loaded Pages
const SplashScreen = lazy(() => import('@/pages/customer/SplashScreen'));
const Home = lazy(() => import('@/pages/customer/Home'));
const CategoriesPage = lazy(() => import('@/pages/customer/Categories'));
const ProductDetails = lazy(() => import('@/pages/customer/ProductDetails'));
const Auth = lazy(() => import('@/pages/auth/Login'));
const CartPage = lazy(() => import('@/pages/customer/Cart'));
const CheckoutPage = lazy(() => import('@/pages/customer/Checkout'));
const PaymentPage = lazy(() => import('@/pages/customer/Payment'));
const OrderSuccess = lazy(() => import('@/pages/customer/OrderSuccess'));
const OrderTracking = lazy(() => import('@/pages/customer/OrderTracking'));
const ProfilePage = lazy(() => import('@/pages/customer/Profile'));
const AdminPanel = lazy(() => import('@/pages/admin/Dashboard'));

export default function App() {
  const { t } = useLanguage();
  const { currentUser } = useApp();

  const [currentPage, setCurrentPage] = useState('splash');
  const [pageData, setPageData] = useState(null);
  
  // Shared active category to sync between CategoriesPage and Home
  const [activeCategory, setActiveCategory] = useState('All');

  // Handle routing with optional metadata
  const handleNavigate = (page, data = null) => {
    setPageData(data);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hide header and bottom navigation on specific views
  const isSplash = currentPage === 'splash';
  const isMinimalLayout = ['splash', 'payment', 'order-success', 'auth'].includes(currentPage);

  return (
    <div className="flex flex-col min-h-screen bg-luxury-light text-luxury-dark select-none md:select-text pb-12 md:pb-0">
      
      {/* Header Sticky Navigation (Hidden on Splash) */}
      {!isSplash && (
        <Header 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
        />
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-0 sm:px-4 md:px-0">
        <Suspense fallback={<ScreenLoader />}>
        {/* Splash View */}
        {currentPage === 'splash' && (
          <SplashScreen onComplete={() => handleNavigate('home')} />
        )}

        {/* Home Page View */}
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} />
        )}

        {/* Category catalog List View */}
        {currentPage === 'categories' && (
          <CategoriesPage 
            onNavigate={handleNavigate} 
            setActiveCategory={handleNavigate} // Trick categories page to sync category state
          />
        )}

        {/* Product Details Sheet View */}
        {currentPage === 'product-details' && pageData && (
          <ProductDetails 
            product={pageData} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* Authentication View */}
        {currentPage === 'auth' && (
          <Auth onNavigate={handleNavigate} />
        )}

        {/* Shopping Cart Drawer View */}
        {currentPage === 'cart' && (
          <CartPage onNavigate={handleNavigate} />
        )}

        {/* Map Checkout Pinning View */}
        {currentPage === 'checkout' && (
          <CheckoutPage onNavigate={handleNavigate} />
        )}

        {/* Payments redirects mock View */}
        {currentPage === 'payment' && (
          <PaymentPage onNavigate={handleNavigate} />
        )}

        {/* Celebratory Order Success View */}
        {currentPage === 'order-success' && pageData && (
          <OrderSuccess 
            order={pageData} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* Swiggy Timeline Delivery Tracking View */}
        {currentPage === 'orders' && (
          <OrderTracking 
            order={pageData} 
            onNavigate={handleNavigate} 
          />
        )}

        {/* User profile View */}
        {currentPage === 'profile' && (
          <ProfilePage onNavigate={handleNavigate} />
        )}

        {/* Admin Command Dashboard View */}
        {currentPage === 'admin' && (
          <AdminPanel onNavigate={handleNavigate} />
        )}
        </Suspense>
      </main>

      {/* Shared Footer (Desktop Viewports only, except splash) */}
      {!isSplash && (
        <footer className="hidden md:block py-10 bg-primary-dark text-white border-t border-primary/20 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <span className="font-extrabold text-sm tracking-wide text-accent">{t('brandName')}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('tagline')}</span>
            </div>
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
              &copy; {new Date().getFullYear()} Velmurugan Store. All Rights Reserved. Built with Apple-level spacing standards and premium glassmorphism layout values.
            </p>
          </div>
        </footer>
      )}

      {/* Bottom Nav Bar (Mobile Viewports only, except splash/minimal screens) */}
      {!isMinimalLayout && (
        <BottomNavigation 
          onNavigate={handleNavigate} 
          currentPage={currentPage}
        />
      )}

    </div>
  );
}
