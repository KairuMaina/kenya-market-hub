
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdminAgent {
  id: string;
  user_id: string;
  agency_name: string;
  license_number: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  experience_years: number;
  rating: number;
  status: string;
  created_at: string;
  updated_at: string;
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
      return data as AdminAgent[];
    }
  });
};

export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ agentId, status }: { agentId: string; status: string }) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update({ status })
        .eq('id', agentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
    },
  });
};
