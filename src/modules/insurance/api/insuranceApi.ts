
// Mock Insurance API - replace with actual Supabase calls when insurance tables are created
import { InsurancePlan, InsurancePolicy, InsuranceClaim, InsuranceFilters } from '../types';

// Mock data for insurance plans
const mockInsurancePlans: InsurancePlan[] = [
  {
    id: '1',
    name: 'Comprehensive Health Insurance',
    description: 'Complete medical coverage including in-patient, out-patient, and emergency services.',
    category: 'Medical',
    providerName: 'Kenya Medical Insurance',
    premium: 15000,
    coverageAmount: 500000,
    coverageType: 'Individual',
    features: ['In-patient care', 'Out-patient services', 'Emergency coverage', 'Dental care'],
    terms: '12 months coverage with renewable option',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'Third Party Motor Insurance',
    description: 'Basic motor vehicle insurance covering third party damages and injuries.',
    category: 'Motor',
    providerName: 'Auto Shield Kenya',
    premium: 8000,
    coverageAmount: 1000000,
    coverageType: 'Vehicle',
    features: ['Third party liability', 'Legal expenses', '24/7 roadside assistance'],
    terms: '12 months coverage for private vehicles',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'Life Assurance Plan',
    description: 'Life insurance with savings component and death benefit coverage.',
    category: 'Life/Accident',
    providerName: 'Life Plus Insurance',
    premium: 25000,
    coverageAmount: 2000000,
    coverageType: 'Individual',
    features: ['Death benefit', 'Savings component', 'Critical illness cover', 'Disability benefit'],
    terms: 'Long-term policy with maturity benefits',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    name: 'Business Property Insurance',
    description: 'Comprehensive coverage for business premises, equipment, and stock.',
    category: 'Business/Property',
    providerName: 'Commercial Guard',
    premium: 45000,
    coverageAmount: 5000000,
    coverageType: 'Business',
    features: ['Fire and perils', 'Theft coverage', 'Business interruption', 'Equipment breakdown'],
    terms: 'Annual renewable policy for commercial properties',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const getInsurancePlans = async (filters?: InsuranceFilters): Promise<InsurancePlan[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredPlans = [...mockInsurancePlans];
  
  if (filters) {
    if (filters.categories && filters.categories.length > 0) {
      filteredPlans = filteredPlans.filter(plan => 
        filters.categories!.includes(plan.category)
      );
    }
    
    if (filters.providers && filters.providers.length > 0) {
      filteredPlans = filteredPlans.filter(plan => 
        filters.providers!.includes(plan.providerName)
      );
    }
    
    if (filters.premiumRange) {
      filteredPlans = filteredPlans.filter(plan => 
        plan.premium >= filters.premiumRange!.min && 
        plan.premium <= filters.premiumRange!.max
      );
    }
    
    if (filters.coverageTypes && filters.coverageTypes.length > 0) {
      filteredPlans = filteredPlans.filter(plan => 
        filters.coverageTypes!.includes(plan.coverageType)
      );
    }
  }
  
  return filteredPlans;
};

export const getInsurancePlanById = async (id: string): Promise<InsurancePlan | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockInsurancePlans.find(plan => plan.id === id) || null;
};

export const createInsurancePolicy = async (policyData: Omit<InsurancePolicy, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsurancePolicy> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPolicy: InsurancePolicy = {
    ...policyData,
    id: `policy_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newPolicy;
};

export const getUserPolicies = async (userId: string): Promise<InsurancePolicy[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock user policies
  const mockPolicies: InsurancePolicy[] = [
    {
      id: 'policy_1',
      userId,
      planId: '1',
      policyNumber: 'POL-2024-001',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premiumAmount: 15000,
      coverageAmount: 500000,
      beneficiaries: ['John Doe Spouse', 'Jane Doe Child'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01'
    }
  ];
  
  return mockPolicies;
};

export const createInsuranceClaim = async (claimData: Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsuranceClaim> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newClaim: InsuranceClaim = {
    ...claimData,
    id: `claim_${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return newClaim;
};

export const getInsuranceClaims = async (userId?: string): Promise<InsuranceClaim[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock claims data
  const mockClaims: InsuranceClaim[] = [
    {
      id: 'claim_1',
      policyId: 'policy_1',
      claimNumber: 'CLM-2024-001',
      claimType: 'Medical',
      claimAmount: 50000,
      status: 'pending',
      description: 'Hospital treatment for emergency surgery',
      documents: ['receipt_1.pdf', 'medical_report.pdf'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ];
  
  return userId ? mockClaims : mockClaims;
};

// Admin functions
export const getAllInsurancePlans = async (): Promise<InsurancePlan[]> => {
  return getInsurancePlans();
};

export const updateInsurancePlan = async (id: string, updates: Partial<InsurancePlan>): Promise<InsurancePlan> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const planIndex = mockInsurancePlans.findIndex(plan => plan.id === id);
  if (planIndex !== -1) {
    mockInsurancePlans[planIndex] = { ...mockInsurancePlans[planIndex], ...updates, updatedAt: new Date().toISOString() };
    return mockInsurancePlans[planIndex];
  }
  
  throw new Error('Insurance plan not found');
};

export const deleteInsurancePlan = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const planIndex = mockInsurancePlans.findIndex(plan => plan.id === id);
  if (planIndex !== -1) {
    mockInsurancePlans.splice(planIndex, 1);
  } else {
    throw new Error('Insurance plan not found');
  }
};

export const updateClaimStatus = async (claimId: string, status: string): Promise<InsuranceClaim> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock claim update
  const mockClaim: InsuranceClaim = {
    id: claimId,
    policyId: 'policy_1',
    claimNumber: 'CLM-2024-001',
    claimType: 'Medical',
    claimAmount: 50000,
    status: status as 'pending' | 'approved' | 'rejected' | 'processing',
    description: 'Hospital treatment for emergency surgery',
    documents: ['receipt_1.pdf', 'medical_report.pdf'],
    createdAt: '2024-01-15',
    updatedAt: new Date().toISOString()
  };
  
  return mockClaim;
};
