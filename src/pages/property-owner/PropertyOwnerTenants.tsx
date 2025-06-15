
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Phone, Mail, Home, Calendar } from 'lucide-react';

const PropertyOwnerTenants = () => {
  const tenants = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+254 700 111222',
      property: 'Apartment 2B - Westlands',
      rentAmount: 65000,
      moveInDate: '2023-06-15',
      leaseEnd: '2024-06-14',
      status: 'active',
      paymentStatus: 'current'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: '+254 700 333444',
      property: '3BR House - Karen',
      rentAmount: 85000,
      moveInDate: '2023-03-01',
      leaseEnd: '2024-02-29',
      status: 'active',
      paymentStatus: 'overdue'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Tenant Management
        </h1>
        <p className="text-green-100 mt-2">Manage your property tenants and rental agreements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tenants</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">KSh 890K</p>
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Leases</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Current Tenants</CardTitle>
          <CardDescription>Manage your active tenant relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{tenant.name}</h3>
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status}
                        </Badge>
                        <Badge variant="outline" className={getPaymentStatusColor(tenant.paymentStatus)}>
                          {tenant.paymentStatus}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Property:</strong> {tenant.property}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div>
                          <strong>Monthly Rent:</strong> KSh {tenant.rentAmount.toLocaleString()}
                        </div>
                        <div>
                          <strong>Move-in Date:</strong> {tenant.moveInDate}
                        </div>
                        <div>
                          <strong>Lease Ends:</strong> {tenant.leaseEnd}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{tenant.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{tenant.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        Payment History
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyOwnerTenants;
