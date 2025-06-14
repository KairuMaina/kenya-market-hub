
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Car, Store, Home, Wrench } from 'lucide-react';
import { useCreateServiceProviderProfile } from '@/hooks/useServiceProviders';

interface ServiceProviderRegistrationProps {
  onRegistered?: () => void;
}

const ServiceProviderRegistration: React.FC<ServiceProviderRegistrationProps> = ({ onRegistered }) => {
  const [providerType, setProviderType] = useState<'vendor' | 'driver' | 'property_owner'>('driver');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [locationAddress, setLocationAddress] = useState('');

  const createProfile = useCreateServiceProviderProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createProfile.mutate({
      provider_type: providerType,
      business_name: businessName,
      business_description: businessDescription,
      phone_number: phoneNumber,
      email: email,
      location_address: locationAddress,
      verification_status: 'pending',
      is_active: true,
    }, {
      onSuccess: () => {
        onRegistered?.();
        // Reset form
        setBusinessName('');
        setBusinessDescription('');
        setPhoneNumber('');
        setEmail('');
        setLocationAddress('');
      }
    });
  };

  const providerTypes = [
    {
      value: 'driver',
      icon: Car,
      title: 'Ride Driver',
      description: 'Provide taxi or motorbike rides'
    },
    {
      value: 'vendor',
      icon: Store,
      title: 'Product Vendor',
      description: 'Sell products on our marketplace'
    },
    {
      value: 'property_owner',
      icon: Home,
      title: 'Property Owner',
      description: 'List properties for sale or rent'
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Become a Service Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Service Type</Label>
            <RadioGroup
              value={providerType}
              onValueChange={(value) => setProviderType(value as 'vendor' | 'driver' | 'property_owner')}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {providerTypes.map((type) => (
                <div key={type.value} className="relative">
                  <RadioGroupItem
                    value={type.value}
                    id={type.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={type.value}
                    className="flex flex-col items-center justify-center p-6 border-2 border-muted rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <type.icon className="h-8 w-8 mb-2" />
                    <div className="text-center">
                      <div className="font-medium">{type.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {type.description}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">
                {providerType === 'driver' ? 'Driver Name' : 'Business Name'} *
              </Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={providerType === 'driver' ? 'Your full name' : 'Enter business name'}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessDescription">
                {providerType === 'driver' ? 'Experience & Vehicle Details' : 'Business Description'} *
              </Label>
              <Textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder={
                  providerType === 'driver' 
                    ? 'Describe your driving experience, vehicle type, and any additional services...'
                    : 'Describe your business and services...'
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="locationAddress">
                {providerType === 'driver' ? 'Primary Operating Area' : 'Business Location'}
              </Label>
              <Input
                id="locationAddress"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder={
                  providerType === 'driver' 
                    ? 'e.g., Nairobi CBD, Westlands, Kasarani'
                    : 'Enter your business address'
                }
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={createProfile.isPending}
          >
            {createProfile.isPending ? 'Submitting...' : 'Register as Service Provider'}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Your application will be reviewed and you'll be notified once approved.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderRegistration;
