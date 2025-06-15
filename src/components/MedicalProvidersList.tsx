
import React from 'react';
import { useMedicalProviders } from '@/hooks/useMedical';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Hospital, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ProviderCard = ({ provider }: { provider: any }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
    <CardHeader className="flex flex-row items-start gap-4 p-4 bg-gray-50">
      <Avatar className="h-16 w-16 border">
        <AvatarFallback className="bg-blue-100">
          <Hospital className="h-8 w-8 text-blue-500" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-xl font-semibold">{provider.full_name}</CardTitle>
        <CardDescription className="text-sm">{provider.provider_type}</CardDescription>
        <Badge variant="outline" className="mt-2">{(provider.specialization as any)?.name || 'General'}</Badge>
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <p className="text-sm text-gray-700">More details about this provider will be available soon.</p>
    </CardContent>
    <div className="p-4 pt-0">
      {provider.rating > 0 && (
        <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
          <Star className="h-5 w-5 fill-current" />
          <span>{provider.rating.toFixed(1)}</span>
        </div>
      )}
    </div>
  </Card>
);

const ProviderSkeletons = () => (
  <>
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="overflow-hidden shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 p-4 bg-gray-50">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between mt-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </>
);

const MedicalProvidersList = () => {
  const { data: providers, isLoading, error } = useMedicalProviders();

  if (isLoading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><ProviderSkeletons /></div>;
  }
  
  if (error) {
    return <p className="text-red-500 text-center col-span-full">Error: {error.message}</p>;
  }

  if (!providers || providers.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No medical providers found at the moment.</p>
        <p className="text-sm text-gray-400">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
    </div>
  );
};

export default MedicalProvidersList;
