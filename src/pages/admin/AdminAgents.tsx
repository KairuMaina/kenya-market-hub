import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserCheck, Star, Eye, Edit, Phone, Mail, Building } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';
import { useAdminAgents, AdminAgent } from '@/hooks/useAdminAgents';
import ViewAgentModal from '@/components/admin/ViewAgentModal';
import EditAgentModal from '@/components/admin/EditAgentModal';

const AdminAgents = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AdminAgent | null>(null);

  const { data: agents, isLoading } = useAdminAgents();

  const { data: profiles } = useQuery({
    queryKey: ['admin-profiles-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email');
      
      if (error) {
        console.error('Profiles fetch error:', error);
        return [];
      }
      return data || [];
    }
  });

  const getAgentName = (userId: string) => {
    const profile = profiles?.find(p => p.id === userId);
    return profile ? (profile.full_name || profile.email || 'Unknown') : 'Unknown';
  };

  const handleViewClick = (agent: AdminAgent) => {
    setSelectedAgent({ ...agent, full_name: getAgentName(agent.user_id) });
    setShowViewModal(true);
  };

  const handleEditClick = (agent: AdminAgent) => {
    setSelectedAgent({ ...agent, full_name: getAgentName(agent.user_id) });
    setShowEditModal(true);
  };
  
  const handleEditSuccess = () => {
    setShowEditModal(false);
  };

  const totalAgents = agents?.length || 0;
  const verifiedAgents = agents?.filter(agent => agent.is_verified).length || 0;
  const activeAgents = agents?.filter(agent => agent.is_active).length || 0;

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building className="h-8 w-8" />
              Real Estate Agents
            </h1>
            <p className="text-blue-100 mt-2">Manage real estate agents and their profiles</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAgents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <Star className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{verifiedAgents}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <Building className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeAgents}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Agents</CardTitle>
              <CardDescription>View and manage real estate agent profiles</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Loading agents...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Agency</TableHead>
                        <TableHead>License</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Sales</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents?.map((agent) => (
                        <TableRow key={agent.id}>
                          <TableCell className="font-medium">
                            {getAgentName(agent.user_id)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {agent.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {agent.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{agent.agency_name || 'Independent'}</TableCell>
                          <TableCell>{agent.license_number}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {Number(agent.rating || 0).toFixed(1)}
                            </div>
                          </TableCell>
                          <TableCell>{agent.total_sales || 0}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {agent.is_verified && (
                                <Badge variant="default">Verified</Badge>
                              )}
                              {agent.is_active ? (
                                <Badge variant="default" className="bg-green-600">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewClick(agent)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => handleEditClick(agent)}>
                              <Edit className="h-4 w-4" />
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
        </div>

        <ViewAgentModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          agent={selectedAgent}
        />
        <EditAgentModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          agent={selectedAgent}
          onSuccess={handleEditSuccess}
        />
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminAgents;
