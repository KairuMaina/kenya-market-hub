
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMedicalProviderApplication } from '@/hooks/useMedicalProviderApplication';
import { useMedicalSpecializations } from '@/hooks/useMedicalSpecializations';
import { Loader2, Stethoscope } from 'lucide-react';

const MedicalProviderRegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    provider_type: '',
    specialization_id: '',
    license_number: ''
  });

  const { mutate: submitApplication, isPending } = useMedicalProviderApplication();
  const { data: specializations = [] } = useMedicalSpecializations();

  const providerTypes = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'lab_technician', label: 'Lab Technician' },
    { value: 'ambulance_driver', label: 'Ambulance Driver' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'physiotherapist', label: 'Physiotherapist' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    submitApplication({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      provider_type: formData.provider_type as 'doctor' | 'nurse' | 'pharmacist' | 'lab_technician' | 'ambulance_driver' | 'dentist' | 'physiotherapist',
      specialization_id: formData.specialization_id,
      license_number: formData.license_number
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Stethoscope className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle>Medical Provider Application</CardTitle>
            <CardDescription>
              Apply to become a verified medical professional on our platform
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="license_number">License Number</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="provider_type">Provider Type</Label>
            <Select value={formData.provider_type} onValueChange={(value) => setFormData({ ...formData, provider_type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select provider type" />
              </SelectTrigger>
              <SelectContent>
                {providerTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="specialization_id">Specialization</Label>
            <Select value={formData.specialization_id} onValueChange={(value) => setFormData({ ...formData, specialization_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicalProviderRegistrationForm;
