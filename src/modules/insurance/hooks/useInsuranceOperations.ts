
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { createInsurancePolicy, createInsuranceClaim, updateInsurancePlan, deleteInsurancePlan, updateClaimStatus } from '../api/insuranceApi';
import { InsurancePolicy, InsuranceClaim, InsurancePlan } from '../types';

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policyData: Omit<InsurancePolicy, 'id'>) => createInsurancePolicy(policyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-policies'] });
      toast({
        title: 'Success',
        description: 'Insurance policy created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create insurance policy',
        variant: 'destructive',
      });
    },
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (claimData: Omit<InsuranceClaim, 'id'>) => createInsuranceClaim(claimData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-claims'] });
      toast({
        title: 'Success',
        description: 'Insurance claim submitted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit insurance claim',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InsurancePlan> }) => 
      updateInsurancePlan(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      toast({
        title: 'Success',
        description: 'Insurance plan updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update insurance plan',
        variant: 'destructive',
      });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInsurancePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-plans'] });
      toast({
        title: 'Success',
        description: 'Insurance plan deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete insurance plan',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateClaimStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ claimId, status }: { claimId: string; status: string }) => 
      updateClaimStatus(claimId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurance-claims'] });
      toast({
        title: 'Success',
        description: 'Claim status updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update claim status',
        variant: 'destructive',
      });
    },
  });
};

// Combined hook that returns all insurance operations
export const useInsuranceOperations = () => {
  const createPlan = useUpdatePlan(); // Note: using updatePlan for creating as there's no createPlan in API
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const createPolicy = useCreatePolicy();
  const createClaim = useCreateClaim();
  const updateClaimStatus = useUpdateClaimStatus();

  return {
    createPlan,
    updatePlan,
    deletePlan,
    createPolicy,
    createClaim,
    updateClaimStatus,
  };
};
