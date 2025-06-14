
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Search from "./pages/Search";
import Shop from "./pages/Shop";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import RealEstate from "./pages/RealEstate";
import PropertyDetail from "./pages/PropertyDetail";
import Services from "./pages/Services";
import Rides from "./pages/Rides";
import VendorDashboard from "./pages/VendorDashboard";
import VendorAnalyticsPage from "./pages/VendorAnalyticsPage";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import NewAdminDashboard from "./pages/NewAdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminRides from "./pages/admin/AdminRides";
import AdminServiceProviders from "./pages/admin/AdminServiceProviders";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";
import AdvancedProductSearch from "./pages/AdvancedProductSearch";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedVendorRoute from "./components/ProtectedVendorRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import PerformanceMonitor from "./components/PerformanceMonitor";
import SoundEffects from "./components/SoundEffects";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/advanced-search" element={<AdvancedProductSearch />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/real-estate" element={<RealEstate />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/rides" element={<Rides />} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="/vendor-dashboard" element={<ProtectedVendorRoute><VendorDashboard /></ProtectedVendorRoute>} />
                  <Route path="/vendor-analytics" element={<ProtectedVendorRoute><VendorAnalyticsPage /></ProtectedVendorRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminCustomers />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/vendors" element={<NewAdminDashboard />} />
                  <Route path="/admin/transactions" element={<NewAdminDashboard />} />
                  <Route path="/admin/properties" element={<AdminProperties />} />
                  <Route path="/admin/rides" element={<AdminRides />} />
                  <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
                  
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner />
              <SoundEffects />
              <PerformanceMonitor />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
