import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Filter, X } from 'lucide-react';
import { InsuranceFilters as InsuranceFiltersType } from '../types';

interface InsuranceFiltersProps {
  filters: InsuranceFiltersType;
  onFiltersChange: (filters: InsuranceFiltersType) => void;
  className?: string;
}

const InsuranceFilters: React.FC<InsuranceFiltersProps> = ({
  filters,
  onFiltersChange,
  className = ''
}) => {
  const categories = [
    'Medical',
    'Motor',
    'Life/Accident',
    'Business/Property'
  ];

  const providers = [
    'Britam',
    'Jubilee',
    'ICEA Lion',
    'AAR',
    'CIC'
  ];

  const coverageTypes = [
    'Comprehensive',
    'Third Party',
    'Basic',
    'Premium'
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleProviderChange = (provider: string, checked: boolean) => {
    const newProviders = checked
      ? [...filters.providers, provider]
      : filters.providers.filter(p => p !== provider);
    
    onFiltersChange({
      ...filters,
      providers: newProviders
    });
  };

  const handleCoverageTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.coverageTypes, type]
      : filters.coverageTypes.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      coverageTypes: newTypes
    });
  };

  const handlePremiumRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      premiumRange: {
        min: value[0],
        max: value[1]
      }
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      providers: [],
      premiumRange: {
        min: 0,
        max: 100000
      },
      coverageTypes: []
    });
  };

  const getActiveFiltersCount = () => {
    return (
      filters.categories.length +
      filters.providers.length +
      filters.coverageTypes.length +
      (filters.premiumRange.min > 0 || filters.premiumRange.max < 100000 ? 1 : 0)
    );
  };

  const renderFilterSection = (
    title: string,
    items: string[],
    selectedItems: string[],
    onChange: (item: string, checked: boolean) => void
  ) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${item}`}
              checked={selectedItems.includes(item)}
              onCheckedChange={(checked) => onChange(item, checked as boolean)}
            />
            <label
              htmlFor={`${title}-${item}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {item}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
          </div>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderFilterSection(
          'Categories',
          categories,
          filters.categories,
          handleCategoryChange
        )}

        {renderFilterSection(
          'Providers',
          providers,
          filters.providers,
          handleProviderChange
        )}

        {renderFilterSection(
          'Coverage Types',
          coverageTypes,
          filters.coverageTypes,
          handleCoverageTypeChange
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Premium Range</h4>
          <div className="px-2">
            <Slider
              defaultValue={[filters.premiumRange.min, filters.premiumRange.max]}
              max={100000}
              step={1000}
              onValueChange={handlePremiumRangeChange}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>KSh {filters.premiumRange.min.toLocaleString()}</span>
              <span>KSh {filters.premiumRange.max.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceFilters;
