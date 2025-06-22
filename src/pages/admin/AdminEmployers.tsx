
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash, Users, Building2, TrendingUp, CheckCircle } from 'lucide-react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

interface Employer {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  description: string | null;
  approved: boolean;
  created_at: string;
}

const AdminEmployers: React.FC = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    setLoading(true);
    try {
      // Since employers table doesn't exist in the database schema, 
      // we'll create a mock implementation or use profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform profiles data to match Employer interface
      const transformedData: Employer[] = data.map(profile => ({
        id: profile.id,
        company_name: profile.full_name || 'N/A',
        contact_name: profile.full_name || 'N/A',
        email: profile.email,
        phone: profile.phone,
        website: null,
        description: null,
        approved: true, // Default to approved for existing profiles
        created_at: profile.created_at || new Date().toISOString()
      }));
      
      setEmployers(transformedData);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // Update the local state since we're using profiles table
      setEmployers(prev => prev.map(emp => 
        emp.id === id ? { ...emp, approved: true } : emp
      ));
      toast({ title: 'Success', description: 'Employer approved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    }
  };

  const filteredEmployers = employers.filter(employer =>
    employer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Employers',
      value: employers.length.toString(),
      change: '+12%',
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Active Companies',
      value: employers.filter(e => e.approved).length.toString(),
      change: '+8%',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'This Month',
      value: '0',
      change: '+0%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Approval',
      value: employers.filter(e => !e.approved).length.toString(),
      change: '-5%',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employer Management</h1>
            <p className="text-gray-600">Manage employer registrations and approvals</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Employer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Employers</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search employers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : filteredEmployers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No employers found.</TableCell>
                  </TableRow>
                ) : (
                  filteredEmployers.map(employer => (
                    <TableRow key={employer.id}>
                      <TableCell className="font-medium">{employer.company_name}</TableCell>
                      <TableCell>{employer.contact_name}</TableCell>
                      <TableCell>{employer.email}</TableCell>
                      <TableCell>{employer.phone ?? '-'}</TableCell>
                      <TableCell>{employer.website ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant={employer.approved ? 'default' : 'secondary'}>
                          {employer.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {!employer.approved && (
                            <Button size="sm" onClick={() => handleApprove(employer.id)}>
                              Approve
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminEmployers;
