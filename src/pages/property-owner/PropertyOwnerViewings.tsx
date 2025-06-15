
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Eye, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin,
  User,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PropertyOwnerViewings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const { data: viewings = [], isLoading } = useQuery({
    queryKey: ['owner-viewings', searchTerm],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from('property_viewings')
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
        .order('viewing_date', { ascending: true });

      if (searchTerm) {
        query = query.or(`viewer_name.ilike.%${searchTerm}%,viewer_email.ilike.%${searchTerm}%,properties.title.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'no_show': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const viewingStats = {
    total: viewings.length,
    scheduled: viewings.filter(v => v.status === 'scheduled').length,
    completed: viewings.filter(v => v.status === 'completed').length,
    cancelled: viewings.filter(v => v.status === 'cancelled').length
  };

  const todayViewings = viewings.filter(v => {
    const viewingDate = new Date(v.viewing_date);
    const today = new Date();
    return viewingDate.toDateString() === today.toDateString();
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Eye className="h-8 w-8" />
          Property Viewings
        </h1>
        <p className="text-green-100 mt-2">Schedule and manage property viewings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Viewings</p>
                <p className="text-2xl font-bold text-gray-900">{viewingStats.total}</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{viewingStats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{viewingStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-bold text-purple-600">{todayViewings.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Viewings List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Viewings</CardTitle>
                  <CardDescription>Manage upcoming and past viewings</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search viewings..."
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
              ) : viewings.length === 0 ? (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No viewings scheduled</p>
                  <p className="text-gray-400">Viewings will appear here when customers book them</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {viewings.map((viewing) => (
                    <div key={viewing.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{viewing.viewer_name}</h3>
                            <Badge className={getStatusColor(viewing.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(viewing.status)}
                                {viewing.status?.replace('_', ' ')}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-green-600 mb-1">
                            {viewing.properties?.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {viewing.properties?.location_address}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(viewing.viewing_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {viewing.viewing_time}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {viewing.viewer_phone || 'No phone'}
                            </div>
                          </div>
                          {viewing.notes && (
                            <p className="text-sm text-gray-600 mt-2 italic">
                              Note: {viewing.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {viewing.status === 'scheduled' && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>View viewings by date</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              {selectedDate && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Viewings on {selectedDate.toLocaleDateString()}
                  </h4>
                  {viewings
                    .filter(v => new Date(v.viewing_date).toDateString() === selectedDate.toDateString())
                    .map(viewing => (
                      <div key={viewing.id} className="p-2 border rounded text-sm mb-2">
                        <div className="font-medium">{viewing.viewing_time}</div>
                        <div className="text-gray-600">{viewing.viewer_name}</div>
                        <div className="text-green-600">{viewing.properties?.title}</div>
                      </div>
                    ))
                  }
                  {viewings.filter(v => new Date(v.viewing_date).toDateString() === selectedDate.toDateString()).length === 0 && (
                    <p className="text-gray-500 text-sm">No viewings scheduled</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyOwnerViewings;
