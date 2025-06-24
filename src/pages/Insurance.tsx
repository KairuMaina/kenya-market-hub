
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
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
          <HeroSection
            title="Insurance Hub"
            subtitle="Protect What Matters Most"
            description="Comprehensive insurance coverage tailored to your needs."
            imageUrl="photo-1524230572899-a752b3835840"
            className="mb-8 h-64"
          />

          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search insurance plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 py-3 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl shadow-sm"
                />
              </div>
              
              <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 px-6 py-3 rounded-xl shadow-sm font-medium"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">Filter Insurance Plans</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold mb-3 block text-gray-700">Categories</label>
                      <div className="grid grid-cols-2 gap-3">
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
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md' 
                              : 'border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-gray-700'
                            }
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button 
                      onClick={() => setIsFilterModalOpen(false)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-3 rounded-xl font-medium shadow-md"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Total Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{plans.length}</div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Starting From</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    KSh {plans.length > 0 ? Math.min(...plans.map(p => p.premium)).toLocaleString() : '0'}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {new Set(plans.map(p => p.providerName)).size}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-600">Max Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    KSh {plans.length > 0 ? Math.max(...plans.map(p => p.coverageAmount)).toLocaleString() : '0'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <span className="ml-3 text-gray-600">Loading insurance plans...</span>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">No plans found</h3>
                <p className="text-gray-600">Try adjusting your search or filters to find more plans.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </FrontendLayout>
  );
};

export default Insurance;
