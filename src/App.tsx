import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import EmailConfirmation from '@/pages/EmailConfirmation';
import Profile from '@/pages/Profile';
import Products from '@/pages/Products';
import AdvancedProductSearch from '@/pages/AdvancedProductSearch';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Search from '@/pages/Search';
import Shop from '@/pages/Shop';
import Rides from '@/pages/Rides';
import Services from '@/pages/Services';
import ServiceProviderHub from '@/pages/ServiceProviderHub';
import ServicesApp from '@/pages/ServicesApp';
import RealEstate from '@/pages/RealEstate';
import PropertyDetail from '@/pages/PropertyDetail';
import PropertyOwnerApp from '@/pages/PropertyOwnerApp';
import VendorApp from '@/pages/VendorApp';
import VendorDashboard from '@/pages/vendor/VendorDashboard';
import NotFound from '@/pages/NotFound';
import DriverApp from '@/pages/DriverApp';
import SoundEffects from '@/components/SoundEffects';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ErrorBoundary from '@/components/ErrorBoundary';
import AdminApp from './pages/AdminApp';
import ServiceProviderRegistrationPage from './pages/ServiceProviderRegistrationPage';
import MedicalPage from './pages/Medical';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider delayDuration={300}>
            <Toaster />
            <SoundEffects />
            <PerformanceMonitor />
            <ErrorBoundary>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product-search" element={<AdvancedProductSearch />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/shop/*" element={<Shop />} />
                  <Route path="/rides/*" element={<Rides />} />
                  <Route path="/services/*" element={<Services />} />
                  <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                  <Route path="/services-app/*" element={<ServicesApp />} />
                  <Route path="/real-estate/*" element={<RealEstate />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/property-owner/*" element={<PropertyOwnerApp />} />
                  <Route path="/vendor/*" element={<VendorApp />} />
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                  <Route path="/admin/*" element={<AdminApp />} />
                  <Route path="/driver/*" element={<DriverApp />} />
                  <Route path="/service-provider-registration" element={<ServiceProviderRegistrationPage />} />
                  <Route path="/medical" element={<MedicalPage />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </ErrorBoundary>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
