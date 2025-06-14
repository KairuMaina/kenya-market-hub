
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { DollarSign } from 'lucide-react';

interface PriceRangeSliderProps {
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
}

const PriceRangeSlider = ({ priceRange, onPriceRangeChange }: PriceRangeSliderProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center">
        <DollarSign className="h-3 w-3 mr-1" />
        Budget Range: KSh {priceRange[0]} - KSh {priceRange[1]}
      </label>
      <Slider
        value={priceRange}
        onValueChange={onPriceRangeChange}
        max={5000}
        min={0}
        step={100}
        className="w-full"
      />
    </div>
  );
};

export default PriceRangeSlider;
