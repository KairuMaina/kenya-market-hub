
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  full_name?: string;
  is_verified?: boolean;
  is_active?: boolean;
  bio?: string;
  profile_image_url?: string;
  website_url?: string;
  total_sales?: number;
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
      
      // Transform the data to include computed properties and map missing fields
      const agentsWithNames = data?.map(agent => ({
        ...agent,
        full_name: agent.email || 'Unknown',
        is_verified: agent.is_verified,
        is_active: agent.is_active,
        status: agent.is_active ? 'approved' : 'pending',
        address: 'Not specified',
        specialization: Array.isArray(agent.specializations) ? agent.specializations.join(', ') : 'General',
        experience_years: 0,
        total_sales: agent.total_sales || 0
      })) || [];
      
      return agentsWithNames as AdminAgent[];
    }
  });
};

export const useUpdateAgentStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ agentId, status }: { agentId: string; status: string }) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update({ 
          is_active: status === 'approved',
          is_verified: status === 'approved'
        })
        .eq('id', agentId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast({ title: 'Agent status updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating agent status',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (agent: AdminAgent) => {
      const { error } = await supabase
        .from('real_estate_agents')
        .update({
          agency_name: agent.agency_name,
          license_number: agent.license_number,
          phone: agent.phone,
          email: agent.email,
          bio: agent.bio,
          rating: agent.rating,
          is_active: agent.is_active,
          is_verified: agent.is_verified
        })
        .eq('id', agent.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-agents'] });
      toast({ title: 'Agent updated successfully' });
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
