
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  created_at: string;
  roles: string[];
}

export interface AdminUsersResponse {
  users: AdminUser[];
  total: number;
  totalPages: number;
}

export const useAdminUsers = (page: number = 1, limit: number = 10, searchTerm?: string) => {
  return useQuery({
    queryKey: ['admin-users', page, limit, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      const { data: profiles, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user roles
      const userIds = profiles?.map(p => p.id) || [];
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      const users: AdminUser[] = (profiles || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        created_at: profile.created_at,
        roles: userRoles?.filter(ur => ur.user_id === profile.id).map(ur => ur.role) || []
      }));

      return {
        users,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      } as AdminUsersResponse;
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userId: string) => {
      // First delete user roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Then delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User Deleted',
        description: 'User has been deleted successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, password, full_name, role }: { 
      email: string; 
      password: string; 
      full_name?: string; 
      role?: string;
    }) => {
      // This would typically be handled by an admin function
      // For now, we'll show a message that this needs to be implemented
      throw new Error('User creation functionality needs to be implemented with proper admin privileges');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User Created',
        description: 'New user has been created successfully.'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Creation Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
