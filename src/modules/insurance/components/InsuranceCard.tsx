import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { InsurancePlan } from '../types';

interface InsuranceCardProps {
  plan: InsurancePlan;
  onSelect?: () => void;
  onCompare?: () => void;
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ plan, onSelect, onCompare }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
            <Badge variant={plan.isActive ? 'default' : 'secondary'}>
              {plan.category}
            </Badge>
          </div>
          {plan.providerName && (
            <img 
              src={`/providers/${plan.providerName.toLowerCase()}.png`} 
              alt={plan.providerName}
              className="h-8 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">
              KSh {plan.premium.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <div className="text-sm text-gray-500">
              Coverage up to KSh {plan.coverageAmount.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            {plan.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              className="w-full" 
              onClick={onSelect}
            >
              Select Plan
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onCompare}
            >
              Compare
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsuranceCard;
