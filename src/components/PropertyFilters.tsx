
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface PropertyFiltersProps {
  filters: {
    property_type?: string;
    listing_type?: string;
    min_price?: number;
    max_price?: number;
    city?: string;
    county?: string;
    bedrooms?: number;
    bathrooms?: number;
    search?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const PropertyFilters = ({ filters, onFiltersChange, onClearFilters }: PropertyFiltersProps) => {
  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key as keyof typeof newFilters];
    onFiltersChange(newFilters);
  };

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search properties..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        {/* Property Type */}
        <div>
          <Label>Property Type</Label>
          <Select value={filters.property_type || ''} onValueChange={(value) => handleFilterChange('property_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="office">Office</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Listing Type */}
        <div>
          <Label>Listing Type</Label>
          <Select value={filters.listing_type || ''} onValueChange={(value) => handleFilterChange('listing_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All listings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All listings</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range (KSH)</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label htmlFor="min_price" className="text-xs">Min Price</Label>
              <Input
                id="min_price"
                type="number"
                placeholder="0"
                value={filters.min_price || ''}
                onChange={(e) => handleFilterChange('min_price', Number(e.target.value) || undefined)}
              />
            </div>
            <div>
              <Label htmlFor="max_price" className="text-xs">Max Price</Label>
              <Input
                id="max_price"
                type="number"
                placeholder="No limit"
                value={filters.max_price || ''}
                onChange={(e) => handleFilterChange('max_price', Number(e.target.value) || undefined)}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="Enter city"
              value={filters.city || ''}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              placeholder="Enter county"
              value={filters.county || ''}
              onChange={(e) => handleFilterChange('county', e.target.value)}
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <Label>Bedrooms</Label>
          <Select value={filters.bedrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('bedrooms', value ? Number(value) : undefined)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bathrooms */}
        <div>
          <Label>Bathrooms</Label>
          <Select value={filters.bathrooms?.toString() || ''} onValueChange={(value) => handleFilterChange('bathrooms', value ? Number(value) : undefined)}>
            <SelectTrigger>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div>
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(filters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {key}: {String(value)}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(key)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={onClearFilters} className="w-full">
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;
