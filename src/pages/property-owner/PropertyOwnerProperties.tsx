
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Building, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useProperties } from '@/hooks/useProperties';
import { useNavigate } from 'react-router-dom';

const PropertyOwnerProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: properties, isLoading } = useProperties();

  const filteredProperties = properties?.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Building className="h-8 w-8" />
          My Properties
        </h1>
        <p className="text-green-100 mt-2">Manage and track your property listings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Property Listings</CardTitle>
              <CardDescription>
                View and manage all your properties ({filteredProperties?.length || 0} properties)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button 
                onClick={() => navigate('/property-owner/properties/add')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties?.map((property) => (
                <Card key={property.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={property.images?.[0] || '/placeholder.svg'}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={property.status === 'available' ? 'default' : 'secondary'}
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.location_address}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        KSh {property.price.toLocaleString()}
                      </span>
                      <Badge variant="outline">
                        {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.area_sqm} m²</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{property.views_count} views</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOwnerProperties;
