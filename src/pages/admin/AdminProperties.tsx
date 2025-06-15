
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building, Eye, MapPin, DollarSign, Home, Bed, Bath } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminProperties = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch properties
  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'default';
      case 'sold':
        return 'secondary';
      case 'rented':
        return 'outline';
      case 'pending':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleView = (property: any) => {
    setSelectedProperty(property);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalProperties = properties?.length || 0;
  const availableProperties = properties?.filter(property => property.status === 'available').length || 0;
  const soldProperties = properties?.filter(property => property.status === 'sold').length || 0;
  const rentedProperties = properties?.filter(property => property.status === 'rented').length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Building className="h-6 w-6 sm:h-8 sm:w-8" />
              Property Management
            </h1>
            <p className="text-orange-100 mt-2 text-sm sm:text-base">Manage real estate listings and properties</p>
          </div>

          {/* Property Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Properties</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Available</CardTitle>
                <Home className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{availableProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Sold</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{soldProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Rented</CardTitle>
                <Building className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{rentedProperties}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Properties</CardTitle>
              <CardDescription className="text-sm">View and manage property listings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading properties...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Property</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Type</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Price</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Details</TableHead>
                        <TableHead className="text-xs sm:text-sm">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties?.map((property) => (
                        <TableRow key={property.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{property.title}</div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{property.city}, {property.county}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {property.property_type}
                              </Badge>
                              <div className="text-xs text-gray-500">
                                {property.listing_type}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="font-medium">
                              KSH {Number(property.price).toLocaleString()}
                              <div className="text-xs text-gray-500">
                                {property.listing_type === 'rent' ? '/month' : ''}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <div className="flex gap-3 text-xs">
                              <div className="flex items-center gap-1">
                                <Bed className="h-3 w-3" />
                                <span>{property.bedrooms || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Bath className="h-3 w-3" />
                                <span>{property.bathrooms || 0}</span>
                              </div>
                              <div>
                                <span>{property.area_sqm || 0} m²</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getStatusBadgeVariant(property.status)} 
                              className="text-xs"
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(property)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Property Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property Details
                </DialogTitle>
                <DialogDescription>
                  {selectedProperty?.title}
                </DialogDescription>
              </DialogHeader>
              
              {selectedProperty && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-bold">{selectedProperty.title}</h3>
                        <p className="text-gray-600">{selectedProperty.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Type:</span>
                          <p className="text-sm">{selectedProperty.property_type}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Listing:</span>
                          <p className="text-sm">{selectedProperty.listing_type}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Bedrooms:</span>
                          <p className="text-sm">{selectedProperty.bedrooms || 0}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Bathrooms:</span>
                          <p className="text-sm">{selectedProperty.bathrooms || 0}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Location:</span>
                        <p className="text-sm">{selectedProperty.location_address}</p>
                        <p className="text-xs text-gray-500">{selectedProperty.city}, {selectedProperty.county}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium">Price:</span>
                        <p className="text-2xl font-bold text-green-600">
                          KSH {Number(selectedProperty.price).toLocaleString()}
                          {selectedProperty.listing_type === 'rent' && <span className="text-sm">/month</span>}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium">Area:</span>
                          <p className="text-sm">{selectedProperty.area_sqm || 0} m²</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Views:</span>
                          <p className="text-sm">{selectedProperty.views_count || 0}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge variant={getStatusBadgeVariant(selectedProperty.status)} className="ml-2">
                          {selectedProperty.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Featured:</span>
                        <Badge variant={selectedProperty.is_featured ? 'default' : 'outline'} className="ml-2">
                          {selectedProperty.is_featured ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Amenities:</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.amenities.map((amenity: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedProperty.contact_phone && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <span className="text-sm font-medium">Contact Information:</span>
                      <div className="mt-2 space-y-1">
                        {selectedProperty.contact_phone && (
                          <p className="text-sm">Phone: {selectedProperty.contact_phone}</p>
                        )}
                        {selectedProperty.contact_email && (
                          <p className="text-sm">Email: {selectedProperty.contact_email}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminProperties;
