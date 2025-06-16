import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Employer {
  id: number;
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
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEmployers(data);
    } catch (error) {
      toast({ title: 'Error', description: (error as Error).message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('employers')
        .update({ approved: true })
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Success', description: 'Employer approved successfully' });
      fetchEmployers();
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
                    <Button size="sm" variant="primary" onClick={() => handleApprove(employer.id)}>
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
