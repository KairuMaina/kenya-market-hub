
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Briefcase, MapPin, Star, Clock, DollarSign, Search, X, Filter, Calendar, Shield } from 'lucide-react';

interface ServicesAdvancedSearchProps {
  onFiltersChange: (filters: any) => void;
  className?: string;
}

const ServicesAdvancedSearch = ({ onFiltersChange, className }: ServicesAdvancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceCategory, setServiceCategory] = useState('all');
  const [location, setLocation] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('any');
  const [verified, setVerified] = useState(false);
  const [insured, setInsured] = useState(false);
  const [emergency, setEmergency] = useState(false);
  const [homeVisit, setHomeVisit] = useState(false);

  const serviceCategories = [
    'Home Cleaning', 'Plumbing', 'Electrical', 'Carpentry', 'Painting',
    'Gardening', 'Pest Control', 'Appliance Repair', 'Beauty & Wellness',
    'Tutoring', 'IT Support', 'Moving Services', 'Security Services'
  ];

  const locations = [
    'Nairobi CBD', 'Westlands', 'Karen', 'Kileleshwa', 'Kasarani',
    'Mombasa Island', 'Nyali', 'Kisumu Central', 'Nakuru Town',
    'Eldoret', 'Thika', 'Machakos'
  ];

  const availabilityOptions = [
    'Available Today', 'Available This Week', 'Available This Month',
    'Flexible Schedule', 'Emergency Available'
  ];

  const handleSearch = () => {
    onFiltersChange({
      searchQuery,
      serviceCategory,
      location,
      priceRange,
      minRating,
      availability,
      verified,
      insured,
      emergency,
      homeVisit
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setServiceCategory('all');
    setLocation('all');
    setPriceRange([0, 20000]);
    setMinRating(0);
    setAvailability('any');
    setVerified(false);
    setInsured(false);
    setEmergency(false);
    setHomeVisit(false);
    onFiltersChange({});
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Find Professional Services
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search for services, professionals, or specific needs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Options */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={verified}
              onCheckedChange={setVerified}
            />
            <label htmlFor="verified" className="text-sm flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Verified Professionals
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="insured"
              checked={insured}
              onCheckedChange={setInsured}
            />
            <label htmlFor="insured" className="text-sm">Insured</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emergency"
              checked={emergency}
              onCheckedChange={setEmergency}
            />
            <label htmlFor="emergency" className="text-sm">Emergency Services</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="homeVisit"
              checked={homeVisit}
              onCheckedChange={setHomeVisit}
            />
            <label htmlFor="homeVisit" className="text-sm">Home/Office Visit</label>
          </div>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Briefcase className="h-3 w-3 mr-1" />
              Service Category
            </label>
            <Select value={serviceCategory} onValueChange={setServiceCategory}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                    {category}
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
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc.toLowerCase()}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              Availability
            </label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Any Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Time</SelectItem>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase().replace(/\s+/g, '-')}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            Budget Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
          </label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={20000}
            min={0}
            step={500}
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
          <Button onClick={handleSearch} className="flex-1 bg-purple-600 hover:bg-purple-700">
            <Search className="h-4 w-4 mr-2" />
            Find Services
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

export default ServicesAdvancedSearch;
