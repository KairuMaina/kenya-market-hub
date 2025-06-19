
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Navigation, MapPin, Plus, Trash2, Route } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SavedRoute {
  id: string;
  name: string;
  from_address: string;
  to_address: string;
  created_at: string;
}

const DriverRoutes = () => {
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch saved routes
  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['driver-routes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_saved_routes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SavedRoute[];
    }
  });

  // Add new route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (newRoute: { name: string; from_address: string; to_address: string }) => {
      // Get current driver info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: driver } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!driver) throw new Error('Driver profile not found');

      const { error } = await supabase
        .from('driver_saved_routes')
        .insert([{ 
          ...newRoute,
          driver_id: driver.id 
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-routes'] });
      setIsAddingRoute(false);
      setRouteName('');
      setFromAddress('');
      setToAddress('');
      toast({
        title: "Route saved",
        description: "Your route has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save route. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete route mutation
  const deleteRouteMutation = useMutation({
    mutationFn: async (routeId: string) => {
      const { error } = await supabase
        .from('driver_saved_routes')
        .delete()
        .eq('id', routeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-routes'] });
      toast({
        title: "Route deleted",
        description: "The route has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete route. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || !fromAddress.trim() || !toAddress.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    addRouteMutation.mutate({
      name: routeName.trim(),
      from_address: fromAddress.trim(),
      to_address: toAddress.trim(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading Routes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Route className="h-8 w-8" />
          Saved Routes
        </h1>
        <p className="text-green-100 mt-2">Manage your frequently used routes</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Saved Routes</h2>
        <Button onClick={() => setIsAddingRoute(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Route
        </Button>
      </div>

      {isAddingRoute && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Route</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <Label htmlFor="route-name">Route Name</Label>
                <Input
                  id="route-name"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="e.g., Home to Airport"
                />
              </div>
              <div>
                <Label htmlFor="from-address">From Address</Label>
                <Input
                  id="from-address"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="Enter starting address"
                />
              </div>
              <div>
                <Label htmlFor="to-address">To Address</Label>
                <Input
                  id="to-address"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="Enter destination address"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addRouteMutation.isPending}>
                  {addRouteMutation.isPending ? 'Saving...' : 'Save Route'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingRoute(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routes.length > 0 ? routes.map((route) => (
          <Card key={route.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{route.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteRouteMutation.mutate(route.id)}
                  disabled={deleteRouteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-600 mt-1" />
                <div>
                  <p className="text-sm font-medium">From:</p>
                  <p className="text-sm text-gray-600">{route.from_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Navigation className="h-4 w-4 text-red-600 mt-1" />
                <div>
                  <p className="text-sm font-medium">To:</p>
                  <p className="text-sm text-gray-600">{route.to_address}</p>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="outline" className="text-xs">
                  Added {new Date(route.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full text-center py-8">
            <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No saved routes yet.</p>
            <p className="text-sm text-gray-400">Add your frequently used routes for quick access.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverRoutes;
