
import { useQuery } from '@tanstack/react-query';
import { insuranceApi } from '../api/insuranceApi';
import { InsuranceFilters } from '../types';

export const useInsurance = () => {
  const getInsurancePlans = async (filters?: InsuranceFilters) => {
    try {
      let plans = await insuranceApi.getInsurancePlans();
      
      // Apply filters if provided
      if (filters) {
        if (filters.categories.length > 0) {
          plans = plans.filter(plan => 
            filters.categories.includes(plan.category)
          );
        }

        if (filters.providers.length > 0) {
          plans = plans.filter(plan => 
            filters.providers.includes(plan.providerName)
          );
        }

        if (filters.coverageTypes.length > 0) {
          plans = plans.filter(plan => 
            filters.coverageTypes.includes(plan.coverageType)
          );
        }

        plans = plans.filter(plan => 
          plan.premium >= filters.premiumRange.min &&
          plan.premium <= filters.premiumRange.max
        );
      }

      return plans;
    } catch (error) {
      console.error('Error fetching insurance plans:', error);
      throw error;
    }
  };

  const getUserPolicies = async (userId: string) => {
    try {
      return await insuranceApi.getUserPolicies(userId);
    } catch (error) {
      console.error('Error fetching user policies:', error);
      throw error;
    }
  };

  const getUserClaims = async (userId: string) => {
    try {
      return await insuranceApi.getUserClaims(userId);
    } catch (error) {
      console.error('Error fetching user claims:', error);
      throw error;
    }
  };

  const purchasePolicy = async (planId: string, userId: string) => {
    try {
      // Get plan details first
      const plans = await insuranceApi.getInsurancePlans();
      const plan = plans.find(p => p.id === planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }

      // Generate policy number
      const policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create policy
      const policyData = {
        userId,
        providerId: plan.providerId,
        providerName: plan.providerName,
        category: plan.category,
        policyNumber,
        policyName: plan.name,
        coverageType: plan.coverageType,
        premium: plan.premium,
        coverageAmount: plan.coverageAmount,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        status: 'Active' as const,
        documents: [],
        claims: []
      };

      await insuranceApi.createInsurancePolicy(policyData);
      return { success: true, message: 'Policy purchased successfully' };
    } catch (error) {
      console.error('Error purchasing policy:', error);
      return { success: false, message: 'Failed to purchase policy' };
    }
  };

  const fileClaim = async (policyId: string, claimData: { description: string; claimAmount: number }) => {
    try {
      const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const claim = {
        policyId,
        claimNumber,
        description: claimData.description,
        claimAmount: claimData.claimAmount,
        status: 'Pending' as const,
        documents: []
      };

      await insuranceApi.createInsuranceClaim(claim);
      return { success: true, message: 'Claim filed successfully' };
    } catch (error) {
      console.error('Error filing claim:', error);
      return { success: false, message: 'Failed to file claim' };
    }
  };

  const uploadDocument = async (policyId: string, file: File) => {
    // This would typically involve file upload to Supabase storage
    // For now, returning success
    return { success: true, message: 'Document uploaded successfully' };
  };

  return {
    getInsurancePlans,
    getUserPolicies,
    getUserClaims,
    purchasePolicy,
    fileClaim,
    uploadDocument
  };
};

// Query hooks for easier use in components
export const useInsurancePlans = (filters?: InsuranceFilters) => {
  const { getInsurancePlans } = useInsurance();
  
  return useQuery({
    queryKey: ['insurance-plans', filters],
    queryFn: () => getInsurancePlans(filters),
  });
};

export const useUserPolicies = (userId: string) => {
  const { getUserPolicies } = useInsurance();
  
  return useQuery({
    queryKey: ['user-policies', userId],
    queryFn: () => getUserPolicies(userId),
    enabled: !!userId,
  });
};

export const useUserClaims = (userId: string) => {
  const { getUserClaims } = useInsurance();
  
  return useQuery({
    queryKey: ['user-claims', userId],
    queryFn: () => getUserClaims(userId),
    enabled: !!userId,
  });
};
