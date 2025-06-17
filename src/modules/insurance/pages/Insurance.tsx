import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Shield, Car, Heart, Building, FileText, Clock, CheckCircle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { InsuranceFilters as InsuranceFiltersType, InsurancePlan } from '../types';
import InsuranceCard from '../components/InsuranceCard';
import InsuranceFilters from '../components/InsuranceFilters';

const Insurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('medical');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<InsuranceFiltersType>({
    categories: [],
    providers: [],
    premiumRange: {
      min: 0,
      max: 100000
    },
    coverageTypes: []
  });

  // Mock data for demonstration
  const mockPlans: InsurancePlan[] = [
    {
      id: '1',
      providerId: 'britam',
      providerName: 'Britam',
      category: 'Medical',
      name: 'Comprehensive Health Cover',
      description: 'Complete medical coverage for individuals and families',
      coverageType: 'Comprehensive',
      premium: 15000,
      coverageAmount: 2000000,
      features: [
        'Inpatient & Outpatient Cover',
        'Maternity Benefits',
        'Dental & Optical',
        '24/7 Emergency Services'
      ],
      terms: 'Annual renewable policy',
      isActive: true
    },
    {
      id: '2',
      providerId: 'jubilee',
      providerName: 'Jubilee',
      category: 'Motor',
      name: 'Motor Comprehensive',
      description: 'Full protection for your vehicle',
      coverageType: 'Comprehensive',
      premium: 25000,
      coverageAmount: 1500000,
      features: [
        'Accident Coverage',
        'Theft Protection',
        'Third Party Liability',
        'Windscreen Cover'
      ],
      terms: 'Annual renewable policy',
      isActive: true
    }
  ];

  const categories = [
    { id: 'medical', name: 'Medical Insurance', icon: Shield },
    { id: 'motor', name: 'Motor Insurance', icon: Car },
    { id: 'life', name: 'Life/Accident Insurance', icon: Heart },
    { id: 'business', name: 'Business/Property Insurance', icon: Building },
  ];

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Protect What Matters Most
            </h1>
            <p className="text-lg mb-6 opacity-90">
              Find and compare insurance plans from Kenya's top providers
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search insurance plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/90 border-0 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Insurance Categories */}
        <section>
          <Tabs defaultValue="medical" className="w-full">
            <TabsList className="grid grid-cols-4 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex flex-col items-center p-4 data-[state=active]:bg-blue-50"
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span>{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-80">
                    <InsuranceFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                    />
                  </div>
                  <div className="flex-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>{category.name} Plans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {mockPlans
                            .filter(plan => plan.category === category.name.split(' ')[0])
                            .map((plan) => (
                              <InsuranceCard
                                key={plan.id}
                                plan={plan}
                                onSelect={() => console.log('Selected plan:', plan.id)}
                                onCompare={() => console.log('Compare plan:', plan.id)}
                              />
                            ))}
                          {mockPlans.filter(plan => plan.category === category.name.split(' ')[0]).length === 0 && (
                            <div className="col-span-2 text-center py-12">
                              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold mb-2">No plans available</h3>
                              <p className="text-gray-600 mb-4">
                                {category.name} plans will be available soon.
                              </p>
                              <Button>Get Notified</Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* My Policies Section */}
        <section>
          <Tabs defaultValue="active" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Insurance</h2>
              <TabsList>
                <TabsTrigger value="active">Active Policies</TabsTrigger>
                <TabsTrigger value="claims">Claims</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active">
              <Card>
                <CardHeader>
                  <CardTitle>Active Policies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Policies</h3>
                    <p className="text-gray-600 mb-4">
                      You don't have any active insurance policies yet.
                    </p>
                    <Button>Browse Plans</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="claims">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Claims Filed</h3>
                    <p className="text-gray-600 mb-4">
                      You haven't filed any insurance claims yet.
                    </p>
                    <Button>File a Claim</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Policy Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Documents</h3>
                    <p className="text-gray-600 mb-4">
                      Your policy documents will appear here.
                    </p>
                    <Button>Upload Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Easy Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Compare insurance plans from different providers side by side
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Digital Documents</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload and manage your policy documents securely online
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-lg">Quick Claims</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                File and track insurance claims with ease
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg">Instant Approval</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get instant policy approval and coverage activation
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Insurance;
