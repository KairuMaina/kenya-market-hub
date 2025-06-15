
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Hospital } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MedicationsList from '@/components/MedicationsList';
import MedicalProvidersList from '@/components/MedicalProvidersList';

const MedicalPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Hospital className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Find Medical Services
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with trusted medical professionals, facilities, and find medications from local pharmacies.
          </p>
        </div>

        <Tabs defaultValue="providers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
            <TabsTrigger value="providers">Medical Providers</TabsTrigger>
            <TabsTrigger value="medications">Pharmacy & Medications</TabsTrigger>
          </TabsList>
          <TabsContent value="providers">
            <MedicalProvidersList />
          </TabsContent>
          <TabsContent value="medications">
            <MedicationsList />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MedicalPage;
