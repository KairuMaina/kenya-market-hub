
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Filter, Grid, List } from 'lucide-react';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import { useProducts } from '@/hooks/useProducts';
import OptimizedProductCard from '@/components/OptimizedProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: products, isLoading } = useProducts({
    searchQuery: searchTerm,
    category: category
  });

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Automotive',
    'Beauty',
    'Toys'
  ];

  const handleSearch = () => {
    // Search is reactive, no need for explicit search action
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-orange-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <SearchIcon className="h-16 w-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Find Anything
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Search through thousands of products and services
              </p>
              
              {/* Advanced Search Bar */}
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search for products, services, or anything..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-gray-900 border-gray-200"
                    />
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-md text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <Button 
                    onClick={handleSearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm || category ? 'Search Results' : 'All Products'}
              </h2>
              <p className="text-gray-600">
                {isLoading ? 'Searching...' : `Found ${products?.length || 0} results`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-200 hover:bg-purple-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : products && products.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {products.map((product) => (
                <OptimizedProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <SearchIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || category ? 'No Results Found' : 'Start Your Search'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || category 
                  ? 'Try adjusting your search terms or browse different categories.'
                  : 'Use the search bar above to find products, services, and more.'
                }
              </p>
            </div>
          )}

          {/* Search Tips */}
          {(!searchTerm && !category) && (
            <Card className="mt-12 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg">Search Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Product Search</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use specific product names for better results</li>
                      <li>• Include brand names when possible</li>
                      <li>• Try different spellings or synonyms</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Category Filtering</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Select a category to narrow down results</li>
                      <li>• Combine keywords with categories</li>
                      <li>• Browse by popular categories</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </FrontendLayout>
  );
};

export default Search;
