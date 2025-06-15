
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminAgent {
  id: string;
  user_id: string;
  agency_name: string | null;
  license_number: string | null;
  phone: string;
  email: string;
  rating: number | null;
  total_sales: number | null;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  full_name?: string;
}

export const useAdminAgents = () => {
  return useQuery({
    queryKey: ['admin-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('real_estate_agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as AdminAgent[];
    }
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (agentData: Partial<AdminAgent> & { id: string }) => {
      const { id, full_name, ...updateData } = agentData;
      const { error } = await supabase
        .from('real_estate_agents')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast({ title: 'Agent updated successfully!' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating agent',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
