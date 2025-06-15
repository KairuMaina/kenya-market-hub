
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Search, Phone, Mail, Calendar, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PropertyOwnerInquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ['property-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select(`
          *,
          properties (
            title,
            location_address,
            price,
            listing_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredInquiries = inquiries?.filter(inquiry =>
    inquiry.inquirer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.properties?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case 'viewing': return 'bg-purple-100 text-purple-800';
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'rent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Property Inquiries
        </h1>
        <p className="text-green-100 mt-2">Manage customer inquiries and leads</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Recent Inquiries</CardTitle>
              <CardDescription>
                View and respond to property inquiries ({filteredInquiries?.length || 0} inquiries)
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries?.map((inquiry) => (
                <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{inquiry.inquirer_name}</h3>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                          <Badge variant="outline" className={getInquiryTypeColor(inquiry.inquiry_type)}>
                            {inquiry.inquiry_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          <strong>Property:</strong> {inquiry.properties?.title}
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Location:</strong> {inquiry.properties?.location_address}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <p className="text-sm">{inquiry.message}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{inquiry.inquirer_email}</span>
                          </div>
                          {inquiry.inquirer_phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{inquiry.inquirer_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Property
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

export default PropertyOwnerInquiries;
