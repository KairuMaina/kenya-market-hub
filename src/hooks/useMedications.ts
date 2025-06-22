
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Medication {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  requires_prescription: boolean;
  stock_quantity: number;
  manufacturer?: string;
  created_at: string;
  updated_at: string;
}

export const useMedications = () => {
  return useQuery({
    queryKey: ['medications'],
    queryFn: async (): Promise<Medication[]> => {
      // Since medications table doesn't exist, return mock data for now
      return [
        {
          id: '1',
          name: 'Paracetamol',
          category: 'Pain Relief',
          description: 'Pain and fever relief medication',
          price: 150,
          requires_prescription: false,
          stock_quantity: 100,
          manufacturer: 'Generic Pharma',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Amoxicillin',
          category: 'Antibiotics',
          description: 'Antibiotic for bacterial infections',
          price: 350,
          requires_prescription: true,
          stock_quantity: 50,
          manufacturer: 'MedCorp',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
    }
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (medication: Omit<Medication, 'id' | 'created_at' | 'updated_at'>) => {
      // Mock implementation since table doesn't exist
      return { id: Date.now().toString(), ...medication, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      toast({
        title: 'Medication created',
        description: 'The medication has been added successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating medication',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
