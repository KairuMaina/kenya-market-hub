
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminSettings {
  [key: string]: any;
}

const transformSettingsForApp = (data: any[] | null): AdminSettings => {
    if (!data) return {};
    return data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value.value;
        return acc;
    }, {} as AdminSettings);
};

export const useAdminSettings = () => {
  return useQuery<AdminSettings>({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_key, setting_value');
      
      if (error) {
        console.error('Error fetching admin settings:', error);
        throw error;
      }
      return transformSettingsForApp(data);
    },
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, AdminSettings>({
    mutationFn: async (settings: AdminSettings) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: { value },
        updated_by: user?.id,
        updated_at: new Date().toISOString(),
      }));
      
      const upsertPromises = settingsArray.map(setting =>
        supabase.from('admin_settings').upsert(setting, { onConflict: 'setting_key' })
      );

      const results = await Promise.all(upsertPromises);
      const firstError = results.find(res => res.error);

      if (firstError && firstError.error) {
          throw firstError.error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      toast({ title: "Settings saved successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error saving settings", 
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
