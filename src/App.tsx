import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { validateReactModule } from '@/utils/reactValidation';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import EmailConfirmation from '@/pages/EmailConfirmation';
import Profile from '@/pages/Profile';
import Products from '@/pages/Products';
import AdvancedProductSearch from '@/pages/AdvancedProductSearch';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Shop from '@/pages/Shop';
import Rides from '@/pages/Rides';
import Services from '@/pages/Services';
import ServiceProviderHub from '@/pages/ServiceProviderHub';
import ServiceHubUnified from '@/pages/ServiceHubUnified';
import ChatForums from '@/pages/ChatForums';
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
import Insurance from './modules/insurance/pages/Insurance';
import AdminInsurance from './modules/insurance/pages/AdminInsurance';
import FoodDelivery from './pages/FoodDelivery';
import Events from './pages/Events';
import CityLandingPage from '@/components/seo/CityLandingPage';
import AdvancedSitemapGenerator from '@/components/seo/AdvancedSitemapGenerator';
import PerformanceOptimizer from '@/components/seo/PerformanceOptimizer';

function App() {
  // Validate React before doing anything else
  React.useEffect(() => {
    try {
      validateReactModule();
      console.log('App initialized successfully with React validation');
    } catch (error) {
      console.error('React validation failed:', error);
    }
  }, []);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  // Add global structured data for the organization
  React.useEffect(() => {
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Soko Smart",
      "url": window.location.origin,
      "logo": `${window.location.origin}/lovable-uploads/563ee6fb-f94f-43f3-a4f3-a61873a1b491.png`,
      "description": "Kenya's premier marketplace for products, real estate, rides, services and jobs",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "KE",
        "addressRegion": "Nairobi",
        "addressLocality": "Nairobi"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Kenya"
      },
      "sameAs": [
        "https://facebook.com/sokosmart",
        "https://twitter.com/sokosmart",
        "https://instagram.com/sokosmart"
      ],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'organization-schema';
    script.textContent = JSON.stringify(organizationData);
    
    const existing = document.getElementById('organization-schema');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<div>Auth system error. Please refresh the page.</div>}>
          <AuthProvider>
            <ErrorBoundary fallback={<div>Cart system error. Please refresh the page.</div>}>
              <CartProvider>
                <TooltipProvider delayDuration={300}>
                  <Toaster />
                  <SoundEffects />
                  <PerformanceMonitor />
                  <AdvancedSitemapGenerator />
                  <PerformanceOptimizer />
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
                        <Route path="/shop/*" element={<Shop />} />
                        <Route path="/rides/*" element={<Rides />} />
                        <Route path="/services/*" element={<Services />} />
                        <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                        <Route path="/service-hub" element={<ServiceHubUnified />} />
                        <Route path="/chat-forums" element={<ChatForums />} />
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
                        <Route path="/insurance" element={<Insurance />} />
                        <Route path="/food" element={<FoodDelivery />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/jobs" element={<Jobs />} />
                        <Route path="/jobs/:id" element={<JobDetail />} />
                        <Route path="/city/:cityName" element={<CityLandingPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Router>
                  </ErrorBoundary>
                </TooltipProvider>
              </CartProvider>
            </ErrorBoundary>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
