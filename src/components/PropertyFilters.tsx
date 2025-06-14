
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyFilters as FiltersType } from '@/hooks/useProperties';
import { Filter, X } from 'lucide-react';

interface PropertyFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onClearFilters: () => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleFilterChange = (key: keyof FiltersType, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const counties = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Machakos', 'Meru'
  ];

  const cities = [
    'Nairobi', 'Westlands', 'Karen', 'Kilimani', 'Lavington', 'Kileleshwa', 
    'Parklands', 'Mombasa', 'Kisumu', 'Nakuru'
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Properties
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="property-type">Property Type</Label>
            <Select value={filters.property_type || 'all'} onValueChange={(value) => handleFilterChange('property_type', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Type</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="listing-type">Listing Type</Label>
            <Select value={filters.listing_type || 'all'} onValueChange={(value) => handleFilterChange('listing_type', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sale or Rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min-price">Min Price (KES)</Label>
            <Input
              id="min-price"
              type="number"
              value={filters.min_price || ''}
              onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
            />
          </div>

          <div>
            <Label htmlFor="max-price">Max Price (KES)</Label>
            <Input
              id="max-price"
              type="number"
              value={filters.max_price || ''}
              onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="No limit"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Select value={filters.bedrooms?.toString() || 'all'} onValueChange={(value) => handleFilterChange('bedrooms', value === 'all' ? undefined : Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Select value={filters.bathrooms?.toString() || 'all'} onValueChange={(value) => handleFilterChange('bathrooms', value === 'all' ? undefined : Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="1">1+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="county">County</Label>
            <Select value={filters.county || 'all'} onValueChange={(value) => handleFilterChange('county', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any County" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any County</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="city">City/Area</Label>
            <Select value={filters.city || 'all'} onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any City</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyFilters;
