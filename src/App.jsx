import React, { useState, Suspense, lazy } from 'react';

// Shared Components
import Header from '@/components/Navbar/Navbar';
import BottomNavigation from '@/components/Navbar/BottomNavigation';
import Footer from '@/components/Footer/Footer';
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

// Info Pages
const About = lazy(() => import('@/pages/info/About'));
const Contact = lazy(() => import('@/pages/info/Contact'));
const FAQ = lazy(() => import('@/pages/info/FAQ'));
const PolicyPage = lazy(() => import('@/pages/info/PolicyPage'));

export default function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [pageData, setPageData] = useState(null);

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
    <div className="flex flex-col min-h-screen bg-background text-text select-none md:select-text pb-12 md:pb-0 transition-colors duration-300">
      
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

        {/* Info Pages */}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FAQ />}
        {['privacy', 'terms', 'shipping', 'refunds'].includes(currentPage) && (
          <PolicyPage policyKey={currentPage} />
        )}
        </Suspense>
      </main>

      {/* Shared Premium Footer (Desktop Viewports only, except splash) */}
      {!isSplash && (
        <div className="hidden md:block">
          <Footer onNavigate={handleNavigate} />
        </div>
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
