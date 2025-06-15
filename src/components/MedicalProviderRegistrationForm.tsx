
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { useMedicalSpecializations } from '@/hooks/useMedicalSpecializations';
import { useMedicalProviderApplication } from '@/hooks/useMedicalProviderApplication';

const formSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  provider_type: z.enum(['Doctor', 'Nurse', 'Pharmacist', 'Therapist', 'Other']),
  specialization_id: z.string().uuid("Please select a specialization"),
  license_number: z.string().min(1, "License number is required"),
});

const MedicalProviderRegistrationForm = () => {
  const { data: specializations, isLoading: isLoadingSpecializations } = useMedicalSpecializations();
  const applyMutation = useMedicalProviderApplication();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      license_number: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    applyMutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Medical Provider Application</CardTitle>
            <CardDescription>Apply to offer medical services on our platform.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" {...form.register('full_name')} />
              {form.formState.errors.full_name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.full_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...form.register('email')} />
              {form.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...form.register('phone')} />
              {form.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form.formState.errors.phone.message}</p>}
            </div>
            <div>
              <Label htmlFor="license_number">License Number</Label>
              <Input id="license_number" {...form.register('license_number')} />
              {form.formState.errors.license_number && <p className="text-red-500 text-xs mt-1">{form.formState.errors.license_number.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Provider Type</Label>
              <Select onValueChange={(value) => form.setValue('provider_type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  {['Doctor', 'Nurse', 'Pharmacist', 'Therapist', 'Other'].map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.provider_type && <p className="text-red-500 text-xs mt-1">{form.formState.errors.provider_type.message}</p>}
            </div>
            <div>
              <Label>Specialization</Label>
              <Select onValueChange={(value) => form.setValue('specialization_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialization" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingSpecializations ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    specializations?.map(spec => (
                      <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.specialization_id && <p className="text-red-500 text-xs mt-1">{form.formState.errors.specialization_id.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={applyMutation.isPending}>
            {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicalProviderRegistrationForm;
