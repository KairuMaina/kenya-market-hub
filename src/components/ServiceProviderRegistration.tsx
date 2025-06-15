import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingBag, 
  Car, 
  Building, 
  Wrench,
  Zap,
  Paintbrush,
  Hammer,
  Scissors,
  Stethoscope,
  GraduationCap,
  Camera,
  Utensils
} from 'lucide-react';
import { useVendorApplication } from '@/hooks/useVendors';
import { useServiceProviderRegistration } from '@/hooks/useServiceProviderRegistration';
import MedicalProviderRegistrationForm from './MedicalProviderRegistrationForm';

const ServiceProviderRegistration = ({ initialTab }: { initialTab?: string }) => {
  const serviceTypes = [
    { id: 'vendor', title: 'Product Vendor', icon: ShoppingBag, description: 'Sell products on our marketplace', color: 'from-orange-500 to-red-600' },
    { id: 'driver', title: 'Ride Driver', icon: Car, description: 'Provide taxi or motorbike rides', color: 'from-blue-500 to-indigo-600' },
    { id: 'property_owner', title: 'Property Owner', icon: Building, description: 'List properties for sale or rent', color: 'from-purple-500 to-violet-600' },
    { id: 'plumber', title: 'Plumber', icon: Wrench, description: 'Plumbing and water system services', color: 'from-blue-600 to-cyan-600' },
    { id: 'electrician', title: 'Electrician', icon: Zap, description: 'Electrical installation and repair', color: 'from-yellow-500 to-orange-500' },
    { id: 'painter', title: 'Painter', icon: Paintbrush, description: 'Interior and exterior painting', color: 'from-green-500 to-teal-600' },
    { id: 'carpenter', title: 'Carpenter', icon: Hammer, description: 'Furniture and woodwork services', color: 'from-amber-600 to-orange-600' },
    { id: 'barber', title: 'Barber/Salon', icon: Scissors, description: 'Hair cutting and styling services', color: 'from-pink-500 to-rose-600' },
    { id: 'doctor', title: 'Doctor', icon: Stethoscope, description: 'Medical consultation services', color: 'from-red-500 to-pink-600' },
    { id: 'tutor', title: 'Tutor', icon: GraduationCap, description: 'Educational and tutoring services', color: 'from-indigo-500 to-purple-600' },
    { id: 'photographer', title: 'Photographer', icon: Camera, description: 'Photography and videography', color: 'from-gray-600 to-slate-700' },
    { id: 'caterer', title: 'Caterer', icon: Utensils, description: 'Food and catering services', color: 'from-emerald-500 to-green-600' },
    { id: 'medical_provider', title: 'Medical Provider', icon: Stethoscope, description: 'Register as a licensed medical professional', color: 'from-blue-500 to-cyan-500' }
  ];

  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab && serviceTypes.some(s => s.id === initialTab)) {
      setActiveTab(initialTab);
    } else {
      setActiveTab(null);
    }
  }, [initialTab]);

  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    business_address: '',
    business_phone: '',
    business_email: '',
    service_type: '',
    license_number: '',
    experience_years: '',
    service_areas: ''
  });

  const vendorMutation = useVendorApplication();
  const serviceProviderMutation = useServiceProviderRegistration();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTab) return; // Should not happen if form is visible
    
    try {
      if (activeTab === 'vendor') {
        await vendorMutation.mutateAsync({
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_phone: formData.business_phone,
          business_email: formData.business_email
        });
      } else {
        await serviceProviderMutation.mutateAsync({
          service_type: activeTab,
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_address: formData.business_address,
          business_phone: formData.business_phone,
          business_email: formData.business_email,
          license_number: formData.license_number,
          experience_years: parseInt(formData.experience_years) || 0,
          service_areas: formData.service_areas.split(',').map(area => area.trim())
        });
      }
      
      // Reset form
      setFormData({
        business_name: '',
        business_description: '',
        business_address: '',
        business_phone: '',
        business_email: '',
        service_type: '',
        license_number: '',
        experience_years: '',
        service_areas: ''
      });
      
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  const selectedService = activeTab ? serviceTypes.find(service => service.id === activeTab) : null;

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Service Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceTypes.map((service) => (
              <Button
                key={service.id}
                variant={activeTab === service.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center space-y-2 text-center ${
                  activeTab === service.id 
                    ? `bg-gradient-to-r ${service.color} text-white hover:opacity-90` 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(service.id)}
              >
                <service.icon className="h-6 w-6" />
                <div>
                  <h3 className="font-semibold text-sm">{service.title}</h3>
                  <p className="text-xs opacity-80">{service.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Registration Form */}
      {selectedService && activeTab === 'medical_provider' && (
        <MedicalProviderRegistrationForm />
      )}

      {selectedService && activeTab !== 'medical_provider' && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedService.color} text-white`}>
                <selectedService.icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Register as {selectedService.title}</CardTitle>
                <p className="text-sm text-gray-600">{selectedService.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => handleInputChange('business_name', e.target.value)}
                    placeholder="Enter your business name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="business_phone">Phone Number *</Label>
                  <Input
                    id="business_phone"
                    value={formData.business_phone}
                    onChange={(e) => handleInputChange('business_phone', e.target.value)}
                    placeholder="+254 XXX XXX XXX"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="business_email">Business Email *</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => handleInputChange('business_email', e.target.value)}
                  placeholder="business@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_address">Business Address *</Label>
                <Input
                  id="business_address"
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Enter your business address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="business_description">Business Description *</Label>
                <Textarea
                  id="business_description"
                  value={formData.business_description}
                  onChange={(e) => handleInputChange('business_description', e.target.value)}
                  placeholder="Describe your business and services"
                  required
                />
              </div>

              {/* Additional fields for service providers */}
              {activeTab !== 'vendor' && activeTab !== 'driver' && activeTab !== 'property_owner' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        placeholder="Professional license number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_years">Years of Experience</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => handleInputChange('experience_years', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="service_areas">Service Areas</Label>
                    <Input
                      id="service_areas"
                      value={formData.service_areas}
                      onChange={(e) => handleInputChange('service_areas', e.target.value)}
                      placeholder="Areas you serve (comma separated)"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className={`w-full bg-gradient-to-r ${selectedService.color} text-white hover:opacity-90`}
                disabled={vendorMutation.isPending || serviceProviderMutation.isPending}
              >
                {(vendorMutation.isPending || serviceProviderMutation.isPending) 
                  ? 'Submitting...' 
                  : `Register as ${selectedService.title}`
                }
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceProviderRegistration;
