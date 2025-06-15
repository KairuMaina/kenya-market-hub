
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save, ShoppingBag, Car, Building, Wrench, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useMyVendorProfile } from '@/hooks/useVendors';
import { useServiceProviderProfile } from '@/hooks/useServiceProviders';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters.").optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const { data: vendorProfile } = useMyVendorProfile();
  const { data: driverProfile } = useServiceProviderProfile('driver');
  const { data: propertyOwnerProfile } = useServiceProviderProfile('property_owner');
  const { data: genericServiceProviderProfile } = useServiceProviderProfile('service_provider');

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
      city: '',
      country: 'Kenya',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || 'Kenya',
      });
    }
  }, [profile, form]);

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const validValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== null && v !== undefined)
    );
    updateProfile(validValues);
  };

  if (authLoading || profileLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center p-8">
          <p>Please sign in to view your profile.</p>
        </div>
      </MainLayout>
    );
  }

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  const roles = [];
  if (vendorProfile?.verification_status === 'approved') {
      roles.push({ name: 'Vendor', path: '/vendor', icon: ShoppingBag });
  }
  if (driverProfile?.verification_status === 'approved') {
      roles.push({ name: 'Driver', path: '/driver-app', icon: Car });
  }
  if (propertyOwnerProfile?.verification_status === 'approved') {
      roles.push({ name: 'Property Owner', path: '/property-owner', icon: Building });
  }
  if (genericServiceProviderProfile?.verification_status === 'approved') {
      roles.push({ name: 'Service Provider', path: '/services-app', icon: Wrench });
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and account settings.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-lg">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/50">
                    <span className="text-white font-bold text-4xl">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold">{displayName}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Account Roles & Portals</CardTitle>
                  <CardDescription>Your access levels in Soko Smart.</CardDescription>
                </CardHeader>
                <CardContent>
                  {roles.length > 0 ? (
                    <ul className="space-y-3">
                      {roles.map(role => (
                        <li key={role.name}>
                          <Link to={role.path} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3">
                              <role.icon className="h-5 w-5 text-gray-600" />
                              <span className="font-medium">{role.name}</span>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400"/>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">You are currently registered as a customer.</p>
                  )}
                  <p className="text-xs text-gray-400 mt-4">Want to offer services? <Link to="/service-provider-hub" className="text-blue-600 hover:underline">Visit the Service Provider Hub</Link>.</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. +254 712 345678" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <Input value={user.email || ''} disabled />
                          <p className="text-xs text-muted-foreground pt-1">Email address cannot be changed.</p>
                        </FormItem>
                      </div>
                       <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 123 Main St" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Nairobi" {...field} value={field.value ?? ''} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ''} disabled />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                          <Save className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
