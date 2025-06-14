
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Shop from "./pages/Shop";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import RealEstate from "./pages/RealEstate";
import PropertyDetail from "./pages/PropertyDetail";
import Rides from "./pages/Rides";
import Services from "./pages/Services";
import Search from "./pages/Search";
import AdvancedProductSearch from "./pages/AdvancedProductSearch";
import Wishlist from "./pages/Wishlist";
import VendorDashboard from "./pages/VendorDashboard";
import VendorAnalyticsPage from "./pages/VendorAnalyticsPage";
import EmailConfirmation from "./pages/EmailConfirmation";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminRides from "./pages/admin/AdminRides";
import AdminDrivers from "./pages/admin/AdminDrivers";
import AdminServiceProviders from "./pages/admin/AdminServiceProviders";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminPropertyInquiries from "./pages/admin/AdminPropertyInquiries";
import AdminPropertyViewings from "./pages/admin/AdminPropertyViewings";
import AdminRidePricing from "./pages/admin/AdminRidePricing";
import AdminServiceBookings from "./pages/admin/AdminServiceBookings";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <PerformanceMonitor />
            <BrowserRouter>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/email-confirmation" element={<EmailConfirmation />} />
                  
                  {/* Shop Routes */}
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/advanced-search" element={<AdvancedProductSearch />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  
                  {/* Real Estate Routes */}
                  <Route path="/real-estate" element={<RealEstate />} />
                  <Route path="/real-estate/:id" element={<PropertyDetail />} />
                  
                  {/* Transportation Routes */}
                  <Route path="/rides" element={<Rides />} />
                  
                  {/* Services Routes */}
                  <Route path="/services" element={<Services />} />
                  
                  {/* User Routes */}
                  <Route path="/profile" element={<Profile />} />
                  
                  {/* Vendor Routes */}
                  <Route path="/vendor" element={<VendorDashboard />} />
                  <Route path="/vendor/analytics" element={<VendorAnalyticsPage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                  <Route path="/admin/settings" element={<AdminSettings />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  
                  {/* Admin User Management */}
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/vendors" element={<AdminVendors />} />
                  <Route path="/admin/drivers" element={<AdminDrivers />} />
                  
                  {/* Admin E-commerce */}
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  
                  {/* Admin Real Estate */}
                  <Route path="/admin/properties" element={<AdminProperties />} />
                  <Route path="/admin/agents" element={<AdminAgents />} />
                  <Route path="/admin/property-inquiries" element={<AdminPropertyInquiries />} />
                  <Route path="/admin/property-viewings" element={<AdminPropertyViewings />} />
                  
                  {/* Admin Transportation */}
                  <Route path="/admin/rides" element={<AdminRides />} />
                  <Route path="/admin/ride-pricing" element={<AdminRidePricing />} />
                  
                  {/* Admin Services */}
                  <Route path="/admin/service-providers" element={<AdminServiceProviders />} />
                  <Route path="/admin/service-bookings" element={<AdminServiceBookings />} />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
