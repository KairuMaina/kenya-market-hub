
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Store } from 'lucide-react';
import { useVendors } from '@/hooks/useVendors';
import BusinessContactModal from './BusinessContactModal';

const BusinessDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState<{ id: string; name: string } | null>(null);
  const { data: vendors, isLoading } = useVendors();

  const filteredBusinesses = vendors?.filter(vendor =>
    vendor.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading businesses...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Contact Businesses
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search businesses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {filteredBusinesses.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No businesses found
            </div>
          ) : (
            filteredBusinesses.map((business) => (
              <div key={business.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{business.business_name}</h4>
                  <p className="text-sm text-gray-600">{business.business_description}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline">Verified</Badge>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => setSelectedBusiness({ id: business.id, name: business.business_name })}
                  className="ml-2"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {selectedBusiness && (
        <BusinessContactModal
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          businessName={selectedBusiness.name}
          businessId={selectedBusiness.id}
        />
      )}
    </>
  );
};

export default BusinessDirectory;
