
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Search, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PropertyOwnerInquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['owner-inquiries', searchTerm],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('property_inquiries')
        .select(`
          *,
          properties!inner(
            title,
            owner_id,
            location_address,
            price
          )
        `)
        .eq('properties.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`inquirer_name.ilike.%${searchTerm}%,inquirer_email.ilike.%${searchTerm}%,properties.title.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case 'viewing': return 'bg-purple-100 text-purple-800';
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'rental': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inquiryStats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    converted: inquiries.filter(i => i.status === 'converted').length
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          Property Inquiries
        </h1>
        <p className="text-green-100 mt-2">Manage and respond to property inquiries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{inquiryStats.total}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{inquiryStats.new}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-yellow-600">{inquiryStats.contacted}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{inquiryStats.converted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inquiries List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>Manage property inquiries and leads</CardDescription>
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
              ) : inquiries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No inquiries found</p>
                  <p className="text-gray-400">Inquiries will appear here when customers contact you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div 
                      key={inquiry.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedInquiry?.id === inquiry.id ? 'border-green-500 bg-green-50' : ''
                      }`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{inquiry.inquirer_name}</h3>
                            <Badge className={getStatusColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                            <Badge className={getInquiryTypeColor(inquiry.inquiry_type)} variant="outline">
                              {inquiry.inquiry_type}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-green-600 mb-1">
                            {inquiry.properties?.title}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            {inquiry.message?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {inquiry.inquirer_email}
                            </div>
                            {inquiry.inquirer_phone && (
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {inquiry.inquirer_phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Inquiry Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Inquiry Details</CardTitle>
              <CardDescription>
                {selectedInquiry ? 'View and respond to inquiry' : 'Select an inquiry to view details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h4>
                    <div className="mt-2 space-y-2">
                      <p><strong>Name:</strong> {selectedInquiry.inquirer_name}</p>
                      <p><strong>Email:</strong> {selectedInquiry.inquirer_email}</p>
                      {selectedInquiry.inquirer_phone && (
                        <p><strong>Phone:</strong> {selectedInquiry.inquirer_phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Property</h4>
                    <p className="text-green-600 font-medium">{selectedInquiry.properties?.title}</p>
                    <p className="text-gray-600 text-sm">{selectedInquiry.properties?.location_address}</p>
                    <p className="font-semibold text-lg">KSh {selectedInquiry.properties?.price?.toLocaleString()}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold">Message</h4>
                    <p className="text-gray-700">{selectedInquiry.message}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <Textarea 
                      placeholder="Type your response here..."
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Select an inquiry to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerInquiries;
