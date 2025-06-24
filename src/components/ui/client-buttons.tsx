
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Eye, Heart, Phone, Calendar, Search, Filter } from 'lucide-react';

interface ClientButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const BookServiceButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Calendar className="h-4 w-4 mr-2" />}
    {children || 'Book Service'}
  </Button>
);

export const ContactProviderButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Phone className="h-4 w-4 mr-2" />}
    Contact
  </Button>
);

export const ViewDetailsButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
    View Details
  </Button>
);

export const AddToCartButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
    {children || 'Add to Cart'}
  </Button>
);

export const BuyNowButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
    {children || 'Buy Now'}
  </Button>
);

export const WishlistButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
  </Button>
);

export const GetStartedButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    size="lg"
    onClick={onClick}
    disabled={disabled || loading}
    className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-3 shadow-lg ${className}`}
  >
    {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : null}
    {children || 'Get Started'}
  </Button>
);

export const BrowseCategoriesButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    variant="outline"
    size="lg"
    onClick={onClick}
    disabled={disabled || loading}
    className={`text-lg px-8 py-3 border-2 border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}
    {children || 'Browse Categories'}
  </Button>
);

export const FilterButton: React.FC<ClientButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    variant="outline"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
    {children || 'Filter'}
  </Button>
);
