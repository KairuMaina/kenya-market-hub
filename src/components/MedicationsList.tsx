
import React from 'react';
import { useMedications } from '@/hooks/useMedications';
import MedicationCard from '@/components/MedicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Pill } from 'lucide-react';

const MedicationsList = () => {
  const { data: medications, isLoading, error } = useMedications();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold">Error loading medications</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (!medications || medications.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No medications found at the moment.</p>
        <p className="text-sm text-gray-400">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medications.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} />
      ))}
    </div>
  );
};

export default MedicationsList;
