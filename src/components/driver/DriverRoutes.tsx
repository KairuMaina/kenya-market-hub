
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route,
  Plus,
  Bookmark,
  Trash2,
  TrendingUp
} from 'lucide-react';
import {
  usePopularRoutes, 
  useDriverSavedRoutes, 
  useAddDriverSavedRoute,
  useDeleteDriverSavedRoute
} from '@/hooks/useDriver';
import { timeAgo } from '@/utils/time';

const DriverRoutes = () => {
  const { data: popularRoutes, isLoading: popularLoading } = usePopularRoutes();
  const { data: savedRoutes, isLoading: savedLoading } = useDriverSavedRoutes();
  const addRoute = useAddDriverSavedRoute();
  const deleteRoute = useDeleteDriverSavedRoute();

  const [newRoute, setNewRoute] = useState({ name: '', from: '', to: '' });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoute.name && newRoute.from && newRoute.to) {
      addRoute.mutate(
        { name: newRoute.name, from_address: newRoute.from, to_address: newRoute.to }, 
        {
          onSuccess: () => {
            setNewRoute({ name: '', from: '', to: '' });
            setIsAddDialogOpen(false);
          }
        }
      );
    }
  };

  const isLoading = popularLoading || savedLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Route Planning</h1>
        <p className="text-gray-600">Optimize your routes and discover profitable areas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Popular Routes</CardTitle>
          <p className="text-sm text-gray-600">High-demand routes with good earning potential</p>
        </CardHeader>
        <CardContent>
          {popularLoading ? (
            <p>Loading popular routes...</p>
          ) : (
            <div className="space-y-4">
              {popularRoutes && popularRoutes.length > 0 ? popularRoutes.map((route: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Route className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{route.from_address} → {route.to_address}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>~{route.avg_duration_minutes} min</span>
                        <span>{route.ride_count} rides</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-bold text-green-600">KSH {route.avg_fare.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">avg. fare</p>
                    </div>
                  </div>
                </div>
              )) : <p className="text-gray-500">No popular route data available yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Saved Routes</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a New Saved Route</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddRoute} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Route Name</label>
                    <Input id="name" placeholder="e.g., Home to Airport" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium mb-1">From</label>
                    <Input id="from" placeholder="Enter pickup location" value={newRoute.from} onChange={e => setNewRoute({...newRoute, from: e.target.value})} />
                  </div>
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium mb-1">To</label>
                    <Input id="to" placeholder="Enter destination" value={newRoute.to} onChange={e => setNewRoute({...newRoute, to: e.target.value})} />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={addRoute.isPending}>
                      {addRoute.isPending ? "Saving..." : "Save Route"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {savedLoading ? (
            <p>Loading saved routes...</p>
          ) : (
            <div className="space-y-3">
              {savedRoutes && savedRoutes.length > 0 ? savedRoutes.map((route: any) => (
                <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />
                    <div>
                      <h4 className="font-medium">{route.name}</h4>
                      <p className="text-sm text-gray-600">{route.from_address} → {route.to_address}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="destructive" onClick={() => deleteRoute.mutate(route.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )) : <p className="text-gray-500">You haven't saved any routes yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverRoutes;
