
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, Filter } from 'lucide-react';
import { useInsurancePlans } from '@/modules/insurance/hooks/useInsurance';
import { useInsuranceOperations } from '@/modules/insurance/hooks/useInsuranceOperations';
import InsuranceCard from '@/modules/insurance/components/InsuranceCard';
import { InsuranceFilters } from '@/modules/insurance/types';
import { useAuth } from '@/hooks/useAuth';

const Insurance: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<InsuranceFilters>({
    categories: [],
    providers: [],
    premiumRange: { min: 0, max: 100000 },
    coverageTypes: []
  });

  const { data: plans = [], isLoading } = useInsurancePlans(filters);
  const { purchasePolicy } = useInsuranceOperations();

  // Filter plans based on search
  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(search.toLowerCase()) ||
    plan.providerName.toLowerCase().includes(search.toLowerCase()) ||
    plan.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      console.log('User must be logged in to purchase insurance');
      return;
    }

    // Create policy data
    const policyData = {
      userId: user.id,
      planId,
      // Additional policy creation logic would go here
    };

    await purchasePolicy.mutateAsync(policyData);
  };

  const handleComparePlan = (planId: string) => {
    // Compare functionality would go here
    console.log('Compare plan:', planId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Insurance Hub</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Protect what matters most with comprehensive insurance coverage tailored to your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search insurance plans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {['Medical', 'Motor', 'Life/Accident', 'Business/Property'].map(category => (
              <Button
                key={category}
                variant={filters.categories.includes(category) ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.includes(category)
                      ? prev.categories.filter(c => c !== category)
                      : [...prev.categories, category]
                  }));
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Starting From</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSh {Math.min(...plans.map(p => p.premium)).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(plans.map(p => p.providerName)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Max Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSh {Math.max(...plans.map(p => p.coverageAmount)).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insurance Plans Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading insurance plans...</span>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No plans found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find more plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <InsuranceCard
                key={plan.id}
                plan={plan}
                onSelect={() => handleSelectPlan(plan.id)}
                onCompare={() => handleComparePlan(plan.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insurance;
