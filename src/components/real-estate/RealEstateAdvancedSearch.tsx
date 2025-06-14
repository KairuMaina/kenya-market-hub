
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Building, MapPin, Bed, Bath, Car as ParkingIcon, Search, X, Filter, Home } from 'lucide-react';

interface RealEstateAdvancedSearchProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const RealEstateAdvancedSearch = ({ onFiltersChange, className }: RealEstateAdvancedSearchProps) => {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [listingType, setListingType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [bedrooms, setBedrooms] = useState('any');
  const [bathrooms, setBathrooms] = useState('any');
  const [minArea, setMinArea] = useState(0);
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [garden, setGarden] = useState(false);
  const [security, setSecurity] = useState(false);
  const [swimming, setSwimming] = useState(false);

  const propertyTypes = [
    'Apartment', 'House', 'Villa', 'Townhouse', 'Studio', 'Penthouse',
    'Land', 'Commercial', 'Office Space', 'Warehouse'
  ];

  const listingTypes = ['For Sale', 'For Rent', 'For Lease'];

  const locations = [
    'Nairobi - Westlands', 'Nairobi - Karen', 'Nairobi - Kileleshwa', 
    'Nairobi - Lavington', 'Nairobi - Runda', 'Mombasa - Nyali',
    'Mombasa - Diani', 'Kisumu Central', 'Nakuru Town'
  ];

  const roomOptions = ['Any', '1', '2', '3', '4', '5+'];

  const handleSearch = () => {
    onFiltersChange({
      location,
      propertyType,
      listingType,
      priceRange,
      bedrooms,
      bathrooms,
      minArea,
      furnished,
      parking,
      garden,
      security,
      swimming
    });
  };

  const clearFilters = () => {
    setLocation('');
    setPropertyType('all');
    setListingType('all');
    setPriceRange([0, 50000000]);
    setBedrooms('any');
    setBathrooms('any');
    setMinArea(0);
    setFurnished(false);
    setParking(false);
    setGarden(false);
    setSecurity(false);
    setSwimming(false);
    onFiltersChange({});
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Find Your Dream Property
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Search by location, neighborhood, or city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc.toLowerCase()}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Property Type and Listing Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Home className="h-3 w-3 mr-1" />
              Property Type
            </label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Property Type</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Listing Type</label>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Listing Type</SelectItem>
                {listingTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Bed className="h-3 w-3 mr-1" />
              Bedrooms
            </label>
            <Select value={bedrooms} onValueChange={setBedrooms}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {roomOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Bath className="h-3 w-3 mr-1" />
              Bathrooms
            </label>
            <Select value={bathrooms} onValueChange={setBathrooms}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {roomOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000000}
            min={0}
            step={500000}
            className="w-full"
          />
        </div>

        {/* Minimum Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Minimum Area: {minArea} sq ft
          </label>
          <Slider
            value={[minArea]}
            onValueChange={(value) => setMinArea(value[0])}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Amenities & Features</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={furnished}
                onCheckedChange={(checked) => setFurnished(checked === true)}
              />
              <label htmlFor="furnished" className="text-sm">Furnished</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="parking"
                checked={parking}
                onCheckedChange={(checked) => setParking(checked === true)}
              />
              <label htmlFor="parking" className="text-sm flex items-center">
                <ParkingIcon className="h-3 w-3 mr-1" />
                Parking
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="garden"
                checked={garden}
                onCheckedChange={(checked) => setGarden(checked === true)}
              />
              <label htmlFor="garden" className="text-sm">Garden</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="security"
                checked={security}
                onCheckedChange={(checked) => setSecurity(checked === true)}
              />
              <label htmlFor="security" className="text-sm">24/7 Security</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="swimming"
                checked={swimming}
                onCheckedChange={(checked) => setSwimming(checked === true)}
              />
              <label htmlFor="swimming" className="text-sm">Swimming Pool</label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleSearch} className="flex-1 bg-green-600 hover:bg-green-700">
            <Search className="h-4 w-4 mr-2" />
            Search Properties
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

export default RealEstateAdvancedSearch;
