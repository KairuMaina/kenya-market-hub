
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import EmailConfirmation from './pages/EmailConfirmation';
import Shop from './pages/Shop';
import RealEstate from './pages/RealEstate';
import PropertyDetail from './pages/PropertyDetail';
import Rides from './pages/Rides';
import Services from './pages/Services';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import NotFound from './pages/NotFound';
import AdvancedProductSearch from './pages/AdvancedProductSearch';
import Products from './pages/Products';
import VendorAnalyticsPage from './pages/VendorAnalyticsPage';
import { Toaster } from '@/components/ui/toaster';
import VendorDashboard from './pages/VendorDashboard';
import ServiceProviderHub from './pages/ServiceProviderHub';
import VendorApp from './pages/VendorApp';
import DriverApp from './pages/DriverApp';
import PropertyOwnerApp from './pages/PropertyOwnerApp';
import ServicesApp from './pages/ServicesApp';
import ServiceProviderApp from './components/ServiceProviderApp';
import PerformanceMonitor from './components/PerformanceMonitor';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="App">
              <ErrorBoundary>
                <PerformanceMonitor />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/real-estate" element={<RealEstate />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/rides" element={<Rides />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/search" element={<Search />} />
                  
                  {/* Protected User Routes */}
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  
                  {/* Service Provider Hub */}
                  <Route path="/service-provider-hub" element={<ServiceProviderHub />} />
                  <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                  
                  {/* Service Provider Apps */}
                  <Route path="/vendor/*" element={<VendorApp />} />
                  <Route path="/driver/*" element={<DriverApp />} />
                  <Route path="/property-owner/*" element={<PropertyOwnerApp />} />
                  <Route path="/services-app/*" element={<ServicesApp />} />
                  
                  {/* Service Provider Type Apps */}
                  <Route path="/plumber" element={<ServiceProviderApp serviceType="plumber" />} />
                  <Route path="/electrician" element={<ServiceProviderApp serviceType="electrician" />} />
                  <Route path="/painter" element={<ServiceProviderApp serviceType="painter" />} />
                  <Route path="/carpenter" element={<ServiceProviderApp serviceType="carpenter" />} />
                  <Route path="/barber" element={<ServiceProviderApp serviceType="barber" />} />
                  <Route path="/doctor" element={<ServiceProviderApp serviceType="doctor" />} />
                  <Route path="/tutor" element={<ServiceProviderApp serviceType="tutor" />} />
                  <Route path="/photographer" element={<ServiceProviderApp serviceType="photographer" />} />
                  <Route path="/caterer" element={<ServiceProviderApp serviceType="caterer" />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
                  <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
                  <Route path="/admin/vendors" element={<ProtectedAdminRoute><AdminVendors /></ProtectedAdminRoute>} />
                  <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
                  <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminAnalytics /></ProtectedAdminRoute>} />
                  <Route path="/admin/reports" element={<ProtectedAdminRoute><AdminReports /></ProtectedAdminRoute>} />
                  <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
                  
                  {/* Advanced Search Routes */}
                  <Route path="/advanced-search" element={<AdvancedProductSearch />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/vendor-analytics" element={<ProtectedRoute><VendorAnalyticsPage /></ProtectedRoute>} />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </ErrorBoundary>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
