
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RidesAdvancedSearch from '@/components/rides/RidesAdvancedSearch';

interface RidesSearchSectionProps {
  showAdvancedSearch: boolean;
  onToggleAdvancedSearch: () => void;
  onFiltersChange: (filters: any) => void;
}

const RidesSearchSection = ({ 
  showAdvancedSearch, 
  onToggleAdvancedSearch, 
  onFiltersChange 
}: RidesSearchSectionProps) => {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Find Your Ride</h2>
          <Button 
            variant="outline" 
            onClick={onToggleAdvancedSearch}
            size="sm"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            {showAdvancedSearch ? 'Hide Search' : 'Advanced Search'}
          </Button>
        </div>
        
        {showAdvancedSearch && (
          <RidesAdvancedSearch 
            onFiltersChange={onFiltersChange}
            className="animate-fade-in"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RidesSearchSection;
