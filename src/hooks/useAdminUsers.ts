
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  roles: string[];
  is_active: boolean;
}

export const useAdminUsers = (page = 1, limit = 10, search = '') => {
  return useQuery({
    queryKey: ['admin-users', page, limit, search],
    queryFn: async () => {
      console.log('🔍 Fetching admin users...', { page, limit, search });

      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          phone,
          created_at,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error, count } = await query
        .range((page - 1) * limit, page * limit - 1)
        .returns<any[]>();

      if (error) {
        console.error('❌ Error fetching users:', error);
        throw error;
      }

      const users: AdminUser[] = data?.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone: user.phone,
        created_at: user.created_at,
        roles: user.user_roles?.map((r: any) => r.role) || [],
        is_active: true
      })) || [];

      console.log('✅ Users fetched successfully:', users.length);

      return {
        users,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      };
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userId, role, action }: { userId: string; role: string; action: 'add' | 'remove' }) => {
      console.log('🔄 Updating user role:', { userId, role, action });

      const validRoles = ['admin', 'customer', 'vendor', 'driver', 'property_owner', 'rider'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}`);
      }

      if (action === 'add') {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: role as any });
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role as any);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User role updated successfully' });
    },
    onError: (error: any) => {
      console.error('❌ Error updating user role:', error);
      toast({
        title: 'Error updating user role',
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
      console.log('🗑️ Deleting user:', userId);

      // Delete user roles first
      await supabase.from('user_roles').delete().eq('user_id', userId);
      
      // Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User deleted successfully' });
    },
    onError: (error: any) => {
      console.error('❌ Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
