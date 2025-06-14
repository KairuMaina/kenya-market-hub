
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, X, Tag, Star, MapPin, Truck } from 'lucide-react';

interface ShopAdvancedSearchProps {
  onFiltersChange: (filters: any) => void;
  onSearch: (query: string) => void;
  className?: string;
}

const ShopAdvancedSearch = ({ onFiltersChange, onSearch, className }: ShopAdvancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [freeShipping, setFreeShipping] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 
    'Automotive', 'Health & Beauty', 'Toys', 'Food & Beverages'
  ];

  const brands = [
    'Samsung', 'Apple', 'Nike', 'Adidas', 'Sony', 'LG', 'HP', 'Dell'
  ];

  const locations = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  const handleSearch = () => {
    onSearch(searchQuery);
    onFiltersChange({
      category: selectedCategory,
      brand: selectedBrand,
      condition: selectedCondition,
      location: selectedLocation,
      priceRange,
      minRating,
      inStock,
      freeShipping,
      hasDiscount
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 100000]);
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setSelectedLocation('all');
    setMinRating(0);
    setInStock(false);
    setFreeShipping(false);
    setHasDiscount(false);
    onFiltersChange({});
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Advanced Product Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products, brands, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={inStock}
              onCheckedChange={(checked) => setInStock(checked === true)}
            />
            <label htmlFor="inStock" className="text-sm">In Stock Only</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="freeShipping"
              checked={freeShipping}
              onCheckedChange={(checked) => setFreeShipping(checked === true)}
            />
            <label htmlFor="freeShipping" className="text-sm flex items-center">
              <Truck className="h-3 w-3 mr-1" />
              Free Shipping
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDiscount"
              checked={hasDiscount}
              onCheckedChange={(checked) => setHasDiscount(checked === true)}
            />
            <label htmlFor="hasDiscount" className="text-sm flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              On Sale
            </label>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Condition</label>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Condition</SelectItem>
                {conditions.map((condition) => (
                  <SelectItem key={condition} value={condition.toLowerCase()}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              Location
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location.toLowerCase()}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Minimum Rating: {minRating} stars
          </label>
          <Slider
            value={[minRating]}
            onValueChange={(value) => setMinRating(value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search Products
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopAdvancedSearch;
