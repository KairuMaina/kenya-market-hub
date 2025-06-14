
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation, useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 14', 'Nairobi to Mombasa', 'Apartment Westlands', 'Plumber'
  ]);
  const [popularSearches] = useState([
    'Electronics', 'Real Estate Nairobi', 'Taxi Services', 'Home Services'
  ]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    // Add to recent searches
    setRecentSearches(prev => [query, ...prev.filter(s => s !== query)].slice(0, 5));
    
    // Navigate based on current route or default to products
    if (location.pathname.startsWith('/real-estate')) {
      navigate(`/real-estate?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.startsWith('/rides')) {
      navigate(`/rides?search=${encodeURIComponent(query)}`);
    } else if (location.pathname.startsWith('/services')) {
      navigate(`/services?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
    
    setIsOpen(false);
    setSearchQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <div className="relative flex-1 max-w-xl mx-4" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search products, properties, rides, services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchQuery);
            }
          }}
          className="pl-10 pr-4 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-300 focus:ring-orange-200"
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg border-gray-200 bg-white">
          <CardContent className="p-4 space-y-4">
            {searchQuery && (
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left p-2 hover:bg-gray-50"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <Search className="h-4 w-4 mr-2 text-gray-400" />
                  Search for "{searchQuery}"
                </Button>
              </div>
            )}

            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Recent Searches
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left p-2 hover:bg-gray-50 text-sm"
                      onClick={() => handleSearch(search)}
                    >
                      <Clock className="h-3 w-3 mr-2 text-gray-400" />
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
