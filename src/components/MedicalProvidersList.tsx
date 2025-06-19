
import React, { useState, useMemo } from 'react';
import { useMedicalProviders } from '@/hooks/useMedical';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Hospital, User, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const ProviderCard = ({ provider, onClick }: { provider: any; onClick: () => void }) => (
  <Card
    className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer"
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-start gap-4 p-4 bg-gray-50">
      <Avatar className="h-16 w-16 border">
        <AvatarFallback className="bg-blue-100">
          <Hospital className="h-8 w-8 text-blue-500" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <CardTitle className="text-xl font-semibold">{provider?.full_name || 'Unknown Provider'}</CardTitle>
        <CardDescription className="text-sm">{provider?.provider_type || 'General'}</CardDescription>
        <Badge variant="outline" className="mt-2">
          {(provider?.specialization as any)?.name || 'General'}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <p className="text-sm text-gray-700">More details about this provider will be available soon.</p>
    </CardContent>
    <div className="p-4 pt-0 flex flex-col gap-2">
      {provider?.rating && provider.rating > 0 && (
        <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
          <Star className="h-5 w-5 fill-current" />
          <span>{provider.rating.toFixed(1)}</span>
        </div>
      )}
      <div className="flex gap-2 mt-2 flex-wrap">
        <Button className="flex-grow min-w-[120px]" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); alert('Book appointment with ' + (provider?.full_name || 'provider')); }}>
          Book Appointment
        </Button>
        <Button className="flex-grow min-w-[120px]" size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); alert('Contact ' + (provider?.full_name || 'provider')); }}>
          Contact
        </Button>
      </div>
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null);

  const filteredProviders = useMemo(() => {
    if (!providers || !Array.isArray(providers)) return [];
    return providers.filter((provider) => {
      if (!provider) return false;
      const search = searchTerm.toLowerCase();
      return (
        (provider.full_name || '').toLowerCase().includes(search) ||
        (provider.provider_type || '').toLowerCase().includes(search) ||
        ((provider.specialization as any)?.name || 'general').toLowerCase().includes(search)
      );
    });
  }, [providers, searchTerm]);

  const sortedProviders = useMemo(() => {
    return [...filteredProviders].sort((a, b) => {
      const ratingA = a?.rating || 0;
      const ratingB = b?.rating || 0;
      if (sortOrder === 'asc') {
        return ratingA - ratingB;
      } else {
        return ratingB - ratingA;
      }
    });
  }, [filteredProviders, sortOrder]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProviderSkeletons />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center col-span-full">
        Error: {error.message}
      </p>
    );
  }

  if (!providers || !Array.isArray(providers) || providers.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No medical providers found at the moment.</p>
        <p className="text-sm text-gray-400">Please check back later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex items-center w-full max-w-md">
          <input
            type="text"
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          aria-label="Toggle sort order"
        >
          Sort by Rating {sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProviders.map((provider) => (
          <ProviderCard
            key={provider?.id || Math.random()}
            provider={provider}
            onClick={() => setSelectedProvider(provider)}
          />
        ))}
      </div>

      {selectedProvider && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProvider(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">{selectedProvider?.full_name || 'Unknown Provider'}</h2>
            <p className="mb-2">
              <strong>Type:</strong> {selectedProvider?.provider_type || 'General'}
            </p>
            <p className="mb-2">
              <strong>Specialization:</strong> {(selectedProvider?.specialization as any)?.name || 'General'}
            </p>
            <p className="mb-2">
              <strong>Rating:</strong> {selectedProvider?.rating ? selectedProvider.rating.toFixed(1) : 'Not rated'}
            </p>
            <p className="text-gray-700 mt-4">
              More details about this provider will be available soon.
            </p>
            <button
              onClick={() => setSelectedProvider(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MedicalProvidersList;
