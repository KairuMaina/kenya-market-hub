
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Employer Approvals</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Approved</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : employers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">No employers found.</TableCell>
            </TableRow>
          ) : (
            employers.map(employer => (
              <TableRow key={employer.id}>
                <TableCell>{employer.company_name}</TableCell>
                <TableCell>{employer.contact_name}</TableCell>
                <TableCell>{employer.email}</TableCell>
                <TableCell>{employer.phone ?? '-'}</TableCell>
                <TableCell>{employer.website ?? '-'}</TableCell>
                <TableCell>{employer.description ?? '-'}</TableCell>
                <TableCell>{employer.approved ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  {!employer.approved && (
                    <Button size="sm" onClick={() => handleApprove(employer.id)}>
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminEmployers;
