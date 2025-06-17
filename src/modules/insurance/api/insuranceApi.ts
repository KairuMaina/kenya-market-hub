
import { supabase } from '@/integrations/supabase/client';
import { InsurancePlan, InsurancePolicy, InsuranceClaim } from '../types';

export const insuranceApi = {
  // Insurance Plans
  async createInsurancePlan(plan: Omit<InsurancePlan, 'id'>) {
    const { data, error } = await supabase
      .from('insurance_plans')
      .insert([{
        provider_id: plan.providerId,
        provider_name: plan.providerName,
        category: plan.category,
        name: plan.name,
        description: plan.description,
        coverage_type: plan.coverageType,
        premium: plan.premium,
        coverage_amount: plan.coverageAmount,
        features: plan.features,
        terms: plan.terms,
        is_active: plan.isActive
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapPlanFromDb(data);
  },

  async updateInsurancePlan(id: string, updates: Partial<InsurancePlan>) {
    const { data, error } = await supabase
      .from('insurance_plans')
      .update({
        provider_id: updates.providerId,
        provider_name: updates.providerName,
        category: updates.category,
        name: updates.name,
        description: updates.description,
        coverage_type: updates.coverageType,
        premium: updates.premium,
        coverage_amount: updates.coverageAmount,
        features: updates.features,
        terms: updates.terms,
        is_active: updates.isActive
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapPlanFromDb(data);
  },

  async deleteInsurancePlan(id: string) {
    const { error } = await supabase
      .from('insurance_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getInsurancePlans() {
    const { data, error } = await supabase
      .from('insurance_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(this.mapPlanFromDb) || [];
  },

  // Insurance Policies
  async createInsurancePolicy(policy: Omit<InsurancePolicy, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('insurance_policies')
      .insert([{
        user_id: policy.userId,
        provider_id: policy.providerId,
        provider_name: policy.providerName,
        category: policy.category,
        policy_number: policy.policyNumber,
        policy_name: policy.policyName,
        coverage_type: policy.coverageType,
        premium: policy.premium,
        coverage_amount: policy.coverageAmount,
        start_date: policy.startDate,
        end_date: policy.endDate,
        status: policy.status
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapPolicyFromDb(data);
  },

  async getUserPolicies(userId: string) {
    const { data, error } = await supabase
      .from('insurance_policies')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(this.mapPolicyFromDb) || [];
  },

  // Insurance Claims
  async createInsuranceClaim(claim: Omit<InsuranceClaim, 'id' | 'submittedAt'>) {
    const { data, error } = await supabase
      .from('insurance_claims')
      .insert([{
        policy_id: claim.policyId,
        claim_number: claim.claimNumber,
        description: claim.description,
        claim_amount: claim.claimAmount,
        status: claim.status
      }])
      .select()
      .single();

    if (error) throw error;
    return this.mapClaimFromDb(data);
  },

  async getUserClaims(userId: string) {
    const { data, error } = await supabase
      .from('insurance_claims')
      .select(`
        *,
        insurance_policies!inner(user_id)
      `)
      .eq('insurance_policies.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(this.mapClaimFromDb) || [];
  },

  async updateClaimStatus(claimId: string, status: string, adminNotes?: string) {
    const { data, error } = await supabase
      .from('insurance_claims')
      .update({
        status,
        admin_notes: adminNotes,
        processed_at: new Date().toISOString()
      })
      .eq('id', claimId)
      .select()
      .single();

    if (error) throw error;
    return this.mapClaimFromDb(data);
  },

  // Helper mapping functions
  mapPlanFromDb(data: any): InsurancePlan {
    return {
      id: data.id,
      providerId: data.provider_id,
      providerName: data.provider_name,
      category: data.category,
      name: data.name,
      description: data.description,
      coverageType: data.coverage_type,
      premium: data.premium,
      coverageAmount: data.coverage_amount,
      features: data.features,
      terms: data.terms,
      isActive: data.is_active
    };
  },

  mapPolicyFromDb(data: any): InsurancePolicy {
    return {
      id: data.id,
      userId: data.user_id,
      providerId: data.provider_id,
      providerName: data.provider_name,
      category: data.category,
      policyNumber: data.policy_number,
      policyName: data.policy_name,
      coverageType: data.coverage_type,
      premium: data.premium,
      coverageAmount: data.coverage_amount,
      startDate: data.start_date,
      endDate: data.end_date,
      status: data.status,
      documents: [],
      claims: [],
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  mapClaimFromDb(data: any): InsuranceClaim {
    return {
      id: data.id,
      policyId: data.policy_id,
      claimNumber: data.claim_number,
      description: data.description,
      claimAmount: data.claim_amount,
      status: data.status,
      submittedAt: data.created_at,
      processedAt: data.processed_at,
      documents: [],
      adminNotes: data.admin_notes
    };
  }
};
