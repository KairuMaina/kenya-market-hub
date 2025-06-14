
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserCheck, Eye, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminUsers = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user roles
  const { data: userRoles } = useQuery({
    queryKey: ['admin-user-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*');
      
      if (error) {
        console.error('User roles fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getUserRoles = (userId: string) => {
    return userRoles?.filter(role => role.user_id === userId) || [];
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const newUsersThisMonth = users?.filter(user => {
    const userDate = new Date(user.created_at);
    const currentDate = new Date();
    return userDate.getMonth() === currentDate.getMonth() && 
           userDate.getFullYear() === currentDate.getFullYear();
  }).length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 sm:p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              User Management
            </h1>
            <p className="text-blue-100 mt-2 text-sm sm:text-base">Manage platform users and their accounts</p>
          </div>

          {/* User Statistics */}
          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">New This Month</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold">{newUsersThisMonth}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">All Users</CardTitle>
              <CardDescription className="text-sm">View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm sm:text-base">Loading users...</span>
                </div>
              ) : (
                <div className="overflow-x-auto table-responsive">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">User</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden sm:table-cell">Contact</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden md:table-cell">Location</TableHead>
                        <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Roles</TableHead>
                        <TableHead className="text-xs sm:text-sm">Joined</TableHead>
                        <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs sm:text-sm">
                            <div className="space-y-1">
                              <div className="font-medium">{user.full_name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="text-xs">{user.email}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  <span className="text-xs">{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden md:table-cell">
                            <div className="space-y-1">
                              {user.city && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="text-xs">{user.city}, {user.country}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {getUserRoles(user.id).map((role, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {role.role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={() => handleView(user)}
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

          {/* View User Details Modal */}
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Details
                </DialogTitle>
                <DialogDescription>
                  View details for {selectedUser?.full_name || selectedUser?.email}
                </DialogDescription>
              </DialogHeader>
              
              {selectedUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">{selectedUser.full_name || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Email:</span>
                        <span className="text-sm">{selectedUser.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Phone:</span>
                        <span className="text-sm">{selectedUser.phone || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{selectedUser.city ? `${selectedUser.city}, ${selectedUser.country}` : 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">Joined:</span>
                        <span className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-sm font-medium">User Roles:</span>
                    <div className="flex flex-wrap gap-2">
                      {getUserRoles(selectedUser.id).map((role, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {role.role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {selectedUser.address && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Address:</span>
                      <p className="text-sm text-gray-600">{selectedUser.address}</p>
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

export default AdminUsers;
