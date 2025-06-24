
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Search, Filter } from 'lucide-react';
import { useInsurancePlans } from '@/modules/insurance/hooks/useInsurance';
import { useInsuranceOperations } from '@/modules/insurance/hooks/useInsuranceOperations';
import InsuranceCard from '@/modules/insurance/components/InsuranceCard';
import { InsuranceFilters } from '@/modules/insurance/types';
import { useAuth } from '@/contexts/AuthContext';
import FrontendLayout from '@/components/layouts/FrontendLayout';
import HeroSection from '@/components/shared/HeroSection';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Insurance: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<InsuranceFilters>({
    categories: [],
    providers: [],
    premiumRange: { min: 0, max: 100000 },
    coverageTypes: []
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { data: plans = [], isLoading } = useInsurancePlans(filters);
  const { createPolicy } = useInsuranceOperations();

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(search.toLowerCase()) ||
    plan.providerName.toLowerCase().includes(search.toLowerCase()) ||
    plan.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      console.log('User must be logged in to purchase insurance');
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === planId);
    if (!selectedPlan) return;

    const policyData = {
      userId: user.id,
      providerId: selectedPlan.providerId,
      providerName: selectedPlan.providerName,
      category: selectedPlan.category,
      policyNumber: `POL-${Date.now()}`,
      policyName: selectedPlan.name,
      coverageType: selectedPlan.coverageType,
      premium: selectedPlan.premium,
      coverageAmount: selectedPlan.coverageAmount,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active' as const,
      documents: [],
      claims: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await createPolicy.mutateAsync(policyData);
  };

  const handleComparePlan = (planId: string) => {
    console.log('Compare plan:', planId);
  };

  return (
    <FrontendLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <HeroSection
          title="Insurance Hub"
          subtitle="Protect What Matters Most"
          description="Comprehensive insurance coverage tailored to your needs."
          imageUrl="photo-1524230572899-a752b3835840"
          className="mb-0 rounded-b-2xl h-64"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="mb-4">
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search insurance plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 py-2 text-sm border-orange-200 focus:border-orange-500 rounded-lg"
                />
              </div>
              
              <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 text-sm rounded-lg"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Filter Insurance Plans</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categories</label>
                      <div className="grid grid-cols-2 gap-2">
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
                            className={filters.categories.includes(category) 
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs' 
                              : 'border-orange-200 hover:bg-orange-50 text-xs'
                            }
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => setIsFilterModalOpen(false)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-sm"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-gray-600">Total Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">{plans.length}</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-gray-600">Starting From</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">
                  KSh {plans.length > 0 ? Math.min(...plans.map(p => p.premium)).toLocaleString() : '0'}
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-gray-600">Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">
                  {new Set(plans.map(p => p.providerName)).size}
                </div>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-gray-600">Max Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">
                  KSh {plans.length > 0 ? Math.max(...plans.map(p => p.coverageAmount)).toLocaleString() : '0'}
                </div>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600 mx-auto"></div>
              <span className="ml-2 text-sm">Loading insurance plans...</span>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <h3 className="text-base font-semibold mb-1">No plans found</h3>
              <p className="text-sm text-gray-600">Try adjusting your search or filters to find more plans.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </FrontendLayout>
  );
};

export default Insurance;
