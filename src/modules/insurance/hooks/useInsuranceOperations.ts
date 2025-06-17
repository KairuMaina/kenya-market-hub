
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { insuranceApi } from '../api/insuranceApi';
import { InsurancePlan } from '../types';

export const useInsuranceOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPlanMutation = useMutation({
    mutationFn: (plan: Omit<InsurancePlan, 'id'>) => insuranceApi.createInsurancePlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      toast({
        title: 'Success',
        description: 'Insurance plan created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create insurance plan',
        variant: 'destructive',
      });
      console.error('Create plan error:', error);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsurancePlan> }) =>
      insuranceApi.updateInsurancePlan(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      toast({
        title: 'Success',
        description: 'Insurance plan updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update insurance plan',
        variant: 'destructive',
      });
      console.error('Update plan error:', error);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => insuranceApi.deleteInsurancePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      toast({
        title: 'Success',
        description: 'Insurance plan deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete insurance plan',
        variant: 'destructive',
      });
      console.error('Delete plan error:', error);
    },
  });

  const purchasePolicyMutation = useMutation({
    mutationFn: (policyData: any) => insuranceApi.createInsurancePolicy(policyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-policies'] });
      toast({
        title: 'Success',
        description: 'Policy purchased successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to purchase policy',
        variant: 'destructive',
      });
      console.error('Purchase policy error:', error);
    },
  });

  const fileClaimMutation = useMutation({
    mutationFn: (claimData: any) => insuranceApi.createInsuranceClaim(claimData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-claims'] });
      toast({
        title: 'Success',
        description: 'Claim filed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to file claim',
        variant: 'destructive',
      });
      console.error('File claim error:', error);
    },
  });

  return {
    createPlan: createPlanMutation,
    updatePlan: updatePlanMutation,
    deletePlan: deletePlanMutation,
    purchasePolicy: purchasePolicyMutation,
    fileClaim: fileClaimMutation,
  };
};
