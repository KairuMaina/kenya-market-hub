
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import SoundEffects from "@/components/SoundEffects";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import VendorDashboard from "./pages/VendorDashboard";
import NewAdminDashboard from "./pages/NewAdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import AdminReports from "./pages/AdminReports";
import EmailConfirmation from "./pages/EmailConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Rides from "./pages/Rides";
import Services from "./pages/Services";
import RealEstate from "./pages/RealEstate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <SoundEffects />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Main Landing Page */}
              <Route path="/" element={<Index />} />
              
              {/* Shop Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/products" element={<Products />} />
              <Route path="/shop/cart" element={<Cart />} />
              <Route path="/shop/checkout" element={<Checkout />} />
              <Route path="/shop/wishlist" element={<Wishlist />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              
              {/* New Service Routes */}
              <Route path="/rides" element={<Rides />} />
              <Route path="/services" element={<Services />} />
              <Route path="/real-estate" element={<RealEstate />} />
              
              {/* User Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/vendor" element={<VendorDashboard />} />
              <Route path="/confirm" element={<EmailConfirmation />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <NewAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/customers" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminCustomers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminReports />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
