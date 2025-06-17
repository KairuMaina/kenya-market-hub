import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface JobFiltersProps {
  onFiltersChange: (filters: JobFilters) => void;
  className?: string;
}

export interface JobFilters {
  jobTypes: string[];
  remoteOptions: string[];
  experienceLevels: string[];
  location?: string;
  category?: string;
}

const JobFilters: React.FC<JobFiltersProps> = ({ onFiltersChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    remoteOptions: [],
    experienceLevels: [],
  });

  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const remoteOptions = ['On-site', 'Remote', 'Hybrid'];
  const experienceLevelOptions = ['Entry-level', 'Mid-level', 'Senior', 'Director'];

  const handleFilterChange = (category: keyof JobFilters, value: string, checked: boolean) => {
    const newFilters = { ...filters };
    const currentArray = newFilters[category] as string[];
    
    if (checked) {
      if (!currentArray.includes(value)) {
        newFilters[category] = [...currentArray, value] as any;
      }
    } else {
      newFilters[category] = currentArray.filter(item => item !== value) as any;
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: JobFilters = {
      jobTypes: [],
      remoteOptions: [],
      experienceLevels: [],
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.jobTypes.length + filters.remoteOptions.length + filters.experienceLevels.length;
  };

  const renderFilterSection = (title: string, options: string[], category: keyof JobFilters) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm text-gray-700">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${category}-${option}`}
              checked={(filters[category] as string[]).includes(option)}
              onCheckedChange={(checked) => 
                handleFilterChange(category, option, checked as boolean)
              }
            />
            <label
              htmlFor={`${category}-${option}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs h-7 px-2"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderFilterSection('Job Type', jobTypeOptions, 'jobTypes')}
            {renderFilterSection('Remote Options', remoteOptions, 'remoteOptions')}
            {renderFilterSection('Experience Level', experienceLevelOptions, 'experienceLevels')}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default JobFilters;
