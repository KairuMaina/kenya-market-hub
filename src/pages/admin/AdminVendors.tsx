
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Store, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminVendors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newVendor, setNewVendor] = useState({
    business_name: '',
    business_description: '',
    business_email: '',
    business_phone: '',
    business_address: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vendors
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['admin-vendors', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('vendors')
        .select('*');

      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%,business_email.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add vendor mutation
  const addVendor = useMutation({
    mutationFn: async (vendorData: typeof newVendor) => {
      const { error } = await supabase
        .from('vendors')
        .insert([{
          ...vendorData,
          user_id: 'temp-user-id', // In real app, this would be the actual user creating the vendor
          verification_status: 'pending',
          is_active: false
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      setShowAddVendor(false);
      setNewVendor({
        business_name: '',
        business_description: '',
        business_email: '',
        business_phone: '',
        business_address: ''
      });
      toast({ title: 'Vendor added successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error adding vendor', description: error.message, variant: 'destructive' });
    }
  });

  // Update vendor status mutation
  const updateVendorStatus = useMutation({
    mutationFn: async ({ vendorId, status }: { vendorId: string; status: string }) => {
      const { error } = await supabase
        .from('vendors')
        .update({ 
          verification_status: status,
          is_active: status === 'approved'
        })
        .eq('id', vendorId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      toast({ title: 'Vendor status updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error updating vendor status', description: error.message, variant: 'destructive' });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filteredVendors = vendors || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage all vendors and their stores</p>
        </div>
        <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Create a new vendor profile for the marketplace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={newVendor.business_name}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, business_name: e.target.value }))}
                  placeholder="Enter business name"
                />
              </div>
              <div>
                <Label htmlFor="business_email">Business Email</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={newVendor.business_email}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, business_email: e.target.value }))}
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <Label htmlFor="business_phone">Business Phone</Label>
                <Input
                  id="business_phone"
                  value={newVendor.business_phone}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, business_phone: e.target.value }))}
                  placeholder="+254 700 000 000"
                />
              </div>
              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Input
                  id="business_address"
                  value={newVendor.business_address}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, business_address: e.target.value }))}
                  placeholder="Business location"
                />
              </div>
              <div>
                <Label htmlFor="business_description">Business Description</Label>
                <Textarea
                  id="business_description"
                  value={newVendor.business_description}
                  onChange={(e) => setNewVendor(prev => ({ ...prev, business_description: e.target.value }))}
                  placeholder="Describe the business..."
                />
              </div>
              <Button onClick={() => addVendor.mutate(newVendor)} disabled={addVendor.isPending}>
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            All Vendors ({filteredVendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading vendors...</span>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-8">
              <Store className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendors Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No vendors match your search criteria.' : 'No vendors have registered yet.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{vendor.business_name}</p>
                        <p className="text-sm text-gray-600">{vendor.business_description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{vendor.business_email}</p>
                        <p className="text-sm text-gray-600">{vendor.business_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.verification_status)}</TableCell>
                    <TableCell>{new Date(vendor.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      {vendor.verification_status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateVendorStatus.mutate({ vendorId: vendor.id, status: 'approved' })}
                            disabled={updateVendorStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateVendorStatus.mutate({ vendorId: vendor.id, status: 'rejected' })}
                            disabled={updateVendorStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendors;
