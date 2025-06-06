
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Star, Filter, Grid, List, Search, ShoppingCart, Car, Calendar, Settings } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { mockProducts } from '@/utils/mockProducts';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Auto parts specific filters
  const [selectedMake, setSelectedMake] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  
  const itemsPerPage = 48; // Increased for smaller containers

  const categories = [
    { value: 'all', label: 'All Categories', icon: '🛍️' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'fashion', label: 'Fashion', icon: '👗' },
    { value: 'cosmetics', label: 'Cosmetics', icon: '💄' },
    { value: 'auto-parts', label: 'Auto Parts', icon: '🚗' },
    { value: 'home-kitchen', label: 'Home & Kitchen', icon: '🏠' },
    { value: 'health-beauty', label: 'Health & Beauty', icon: '💅' },
    { value: 'baby-kids', label: 'Baby & Kids', icon: '👶' },
    { value: 'sports', label: 'Sports & Outdoors', icon: '⚽' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'toys', label: 'Toys & Games', icon: '🧸' },
    { value: 'garden', label: 'Garden & Outdoor', icon: '🌱' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-5000', label: 'Under KSh 5,000' },
    { value: '5000-20000', label: 'KSh 5,000 - 20,000' },
    { value: '20000-50000', label: 'KSh 20,000 - 50,000' },
    { value: '50000-100000', label: 'KSh 50,000 - 100,000' },
    { value: '100000+', label: 'Over KSh 100,000' }
  ];

  // Get unique makes and years for auto parts
  const autoPartsData = useMemo(() => {
    const autoPartProducts = mockProducts.filter(p => p.category === 'auto-parts');
    const makes = [...new Set(autoPartProducts.map(p => p.make).filter(Boolean))].sort();
    const years = [...new Set(autoPartProducts.map(p => p.year).filter(Boolean))].sort((a, b) => b! - a!);
    return { makes, years };
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Auto parts specific filters
    if (selectedCategory === 'auto-parts') {
      if (selectedMake !== 'all') {
        filtered = filtered.filter(product => product.make === selectedMake);
      }
      if (selectedYear !== 'all') {
        filtered = filtered.filter(product => product.year?.toString() === selectedYear);
      }
    }

    // Filter by price range
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (priceRange) {
          case '0-5000': return price < 5000;
          case '5000-20000': return price >= 5000 && price <= 20000;
          case '20000-50000': return price >= 20000 && price <= 50000;
          case '50000-100000': return price >= 50000 && price <= 100000;
          case '100000+': return price > 100000;
          default: return true;
        }
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured - mix of rating and reviews
        filtered.sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
    }

    return filtered;
  }, [selectedCategory, searchQuery, priceRange, sortBy, selectedMake, selectedYear]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`;

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products, brands, vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 border-orange-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48 border-orange-200">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-orange-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600 mr-2">View:</span>
                <div className="flex border border-orange-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Auto Parts Specific Filters */}
            {selectedCategory === 'auto-parts' && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Car className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Vehicle Filters</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Make Filter */}
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <Select value={selectedMake} onValueChange={setSelectedMake}>
                      <SelectTrigger className="w-48 border-orange-200">
                        <SelectValue placeholder="Select make" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Makes</SelectItem>
                        {autoPartsData.makes.map(make => (
                          <SelectItem key={make} value={make!}>
                            {make}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Year Filter */}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-48 border-orange-200">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {autoPartsData.years.map(year => (
                          <SelectItem key={year} value={year!.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-gray-700">
            <span className="font-semibold text-orange-600">{filteredProducts.length.toLocaleString()}</span> products found
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory === 'auto-parts' && selectedMake !== 'all' && ` for ${selectedMake}`}
            {selectedCategory === 'auto-parts' && selectedYear !== 'all' && ` for year ${selectedYear}`}
          </p>
        </div>

        {/* Products Grid/List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3" 
            : "space-y-4"
          }>
            {paginatedProducts.map((product) => (
              <Card key={product.id} className={`hover:shadow-lg transition-shadow border border-gray-200 bg-white hover:border-orange-300 ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <CardContent className={`p-2 ${viewMode === 'list' ? 'flex flex-row w-full' : ''}`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-32 flex-shrink-0 mr-4' : 'mb-2'}`}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className={`object-cover rounded ${
                        viewMode === 'list' 
                          ? 'w-full h-24' 
                          : 'w-full h-20'
                      }`}
                    />
                    {product.originalPrice > product.price && (
                      <Badge className="absolute top-1 left-1 bg-red-500 text-xs px-1 py-0">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge className="absolute top-1 right-1 bg-gray-500 text-xs px-1 py-0">
                        Out
                      </Badge>
                    )}
                  </div>
                  
                  <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <h4 className={`font-medium text-gray-900 mb-1 line-clamp-2 ${viewMode === 'list' ? 'text-sm' : 'text-xs'}`}>
                        {product.name}
                      </h4>
                      {product.category === 'auto-parts' && product.year && (
                        <p className="text-xs text-blue-600 mb-1">{product.year} Model</p>
                      )}
                      <p className="text-xs text-gray-600 mb-1">{product.vendor}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-2 w-2 ${
                                i < Math.floor(product.rating) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                          <span className="text-xs text-gray-600 ml-1">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center ${
                      viewMode === 'list' ? 'justify-between mt-2' : 'justify-between'
                    }`}>
                      <div className="flex flex-col">
                        <span className={`font-bold text-gray-900 ${viewMode === 'list' ? 'text-base' : 'text-xs'}`}>
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        disabled={!product.inStock}
                        className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-xs px-1 py-1 h-6"
                      >
                        <ShoppingCart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum 
                        ? "bg-orange-600 hover:bg-orange-700" 
                        : "border-orange-200 text-orange-600 hover:bg-orange-50"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;
