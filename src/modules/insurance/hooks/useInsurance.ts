
import { useQuery } from '@tanstack/react-query';
import { getInsurancePlans, getInsurancePlanById, getUserPolicies, getInsuranceClaims } from '../api/insuranceApi';
import { InsuranceFilters } from '../types';

export const useInsurancePlans = (filters?: InsuranceFilters) => {
  return useQuery({
    queryKey: ['insurance-plans', filters],
    queryFn: () => getInsurancePlans(filters),
  });
};

export const useInsurancePlan = (id: string) => {
  return useQuery({
    queryKey: ['insurance-plan', id],
    queryFn: () => getInsurancePlanById(id),
    enabled: !!id,
  });
};

export const useUserPolicies = (userId: string) => {
  return useQuery({
    queryKey: ['user-policies', userId],
    queryFn: () => getUserPolicies(userId),
    enabled: !!userId,
  });
};

export const useInsuranceClaims = (userId?: string) => {
  return useQuery({
    queryKey: ['insurance-claims', userId],
    queryFn: () => getInsuranceClaims(userId),
  });
};
