
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Star } from 'lucide-react';
import { useAdvancedSearch } from '@/hooks/useAdvancedSearch';

const AdvancedSearch = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    results,
    isLoading,
    categories,
    brands,
    totalResults
  } = useAdvancedSearch();

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Product Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              placeholder="Search by name, description, brand, or tags..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="text-base"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={filters.brand} onValueChange={(value) => updateFilter('brand', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Brands</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={filters.condition} onValueChange={(value) => updateFilter('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Condition</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                  <SelectItem value="refurbished">Refurbished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Newest First</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range: KSh {filters.minPrice.toLocaleString()} - KSh {filters.maxPrice.toLocaleString()}</Label>
            <div className="px-2">
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onValueChange={([min, max]) => {
                  updateFilter('minPrice', min);
                  updateFilter('maxPrice', max);
                }}
                max={1000000}
                step={1000}
                className="w-full"
              />
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilter('inStock', checked)}
              />
              <Label htmlFor="in-stock">In Stock Only</Label>
            </div>
            
            <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Badge variant="secondary" className="text-sm">
              {isLoading ? 'Searching...' : `${totalResults} products found`}
            </Badge>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Advanced filters applied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          results.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={product.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 right-2 bg-green-500">
                  {product.condition || 'New'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-gray-500">({product.reviews_count})</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-600">
                    KSh {Number(product.price).toLocaleString()}
                  </span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                
                {product.brand && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isLoading && results.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button onClick={resetFilters}>Reset All Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedSearch;
