import { useState } from 'react';
import { InsurancePlan, InsurancePolicy, InsuranceClaim, InsuranceFilters } from '../types';

// Mock data - replace with actual API calls
const mockPlans: InsurancePlan[] = [
  {
    id: '1',
    providerId: 'britam',
    providerName: 'Britam',
    category: 'Medical',
    name: 'Comprehensive Health Cover',
    description: 'Complete medical coverage for individuals and families',
    coverageType: 'Comprehensive',
    premium: 15000,
    coverageAmount: 2000000,
    features: [
      'Inpatient & Outpatient Cover',
      'Maternity Benefits',
      'Dental & Optical',
      '24/7 Emergency Services'
    ],
    terms: 'Annual renewable policy',
    isActive: true
  },
  {
    id: '2',
    providerId: 'jubilee',
    providerName: 'Jubilee',
    category: 'Motor',
    name: 'Motor Comprehensive',
    description: 'Full protection for your vehicle',
    coverageType: 'Comprehensive',
    premium: 25000,
    coverageAmount: 1500000,
    features: [
      'Accident Coverage',
      'Theft Protection',
      'Third Party Liability',
      'Windscreen Cover'
    ],
    terms: 'Annual renewable policy',
    isActive: true
  }
];

export const useInsurance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsurancePlans = async (filters?: InsuranceFilters) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter plans based on provided filters
      let filteredPlans = [...mockPlans];
      
      if (filters) {
        if (filters.categories.length > 0) {
          filteredPlans = filteredPlans.filter(plan => 
            filters.categories.includes(plan.category)
          );
        }

        if (filters.providers.length > 0) {
          filteredPlans = filteredPlans.filter(plan => 
            filters.providers.includes(plan.providerName)
          );
        }

        if (filters.coverageTypes.length > 0) {
          filteredPlans = filteredPlans.filter(plan => 
            filters.coverageTypes.includes(plan.coverageType)
          );
        }

        filteredPlans = filteredPlans.filter(plan => 
          plan.premium >= filters.premiumRange.min &&
          plan.premium <= filters.premiumRange.max
        );
      }

      return filteredPlans;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insurance plans');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [] as InsurancePolicy[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user policies');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [] as InsuranceClaim[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user claims');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const purchasePolicy = async (planId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Policy purchased successfully' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase policy');
      return { success: false, message: 'Failed to purchase policy' };
    } finally {
      setLoading(false);
    }
  };

  const fileClaim = async (policyId: string, claimData: Partial<InsuranceClaim>) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Claim filed successfully' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to file claim');
      return { success: false, message: 'Failed to file claim' };
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (policyId: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Document uploaded successfully' };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      return { success: false, message: 'Failed to upload document' };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getInsurancePlans,
    getUserPolicies,
    getUserClaims,
    purchasePolicy,
    fileClaim,
    uploadDocument
  };
};
