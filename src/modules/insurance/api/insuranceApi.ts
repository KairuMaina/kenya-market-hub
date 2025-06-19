
// Mock Insurance API - replace with actual Supabase calls when insurance tables are created
import { InsurancePlan, InsurancePolicy, InsuranceClaim, InsuranceFilters } from '../types';

// Mock data for insurance plans
const mockInsurancePlans: InsurancePlan[] = [
  {
    id: '1',
    name: 'Comprehensive Health Insurance',
    description: 'Complete medical coverage including in-patient, out-patient, and emergency services.',
    category: 'Medical',
    providerId: 'kmi-001',
    providerName: 'Kenya Medical Insurance',
    premium: 15000,
    coverageAmount: 500000,
    coverageType: 'Individual',
    features: ['In-patient care', 'Out-patient services', 'Emergency coverage', 'Dental care'],
    terms: '12 months coverage with renewable option',
    isActive: true
  },
  {
    id: '2',
    name: 'Third Party Motor Insurance',
    description: 'Basic motor vehicle insurance covering third party damages and injuries.',
    category: 'Motor',
    providerId: 'ask-001',
    providerName: 'Auto Shield Kenya',
    premium: 8000,
    coverageAmount: 1000000,
    coverageType: 'Vehicle',
    features: ['Third party liability', 'Legal expenses', '24/7 roadside assistance'],
    terms: '12 months coverage for private vehicles',
    isActive: true
  },
  {
    id: '3',
    name: 'Life Assurance Plan',
    description: 'Life insurance with savings component and death benefit coverage.',
    category: 'Life/Accident',
    providerId: 'lpi-001',
    providerName: 'Life Plus Insurance',
    premium: 25000,
    coverageAmount: 2000000,
    coverageType: 'Individual',
    features: ['Death benefit', 'Savings component', 'Critical illness cover', 'Disability benefit'],
    terms: 'Long-term policy with maturity benefits',
    isActive: true
  },
  {
    id: '4',
    name: 'Business Property Insurance',
    description: 'Comprehensive coverage for business premises, equipment, and stock.',
    category: 'Business/Property',
    providerId: 'cg-001',
    providerName: 'Commercial Guard',
    premium: 45000,
    coverageAmount: 5000000,
    coverageType: 'Business',
    features: ['Fire and perils', 'Theft coverage', 'Business interruption', 'Equipment breakdown'],
    terms: 'Annual renewable policy for commercial properties',
    isActive: true
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

export const createInsurancePolicy = async (policyData: Omit<InsurancePolicy, 'id'>): Promise<InsurancePolicy> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPolicy: InsurancePolicy = {
    ...policyData,
    id: `policy_${Date.now()}`
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
      providerId: 'kmi-001',
      providerName: 'Kenya Medical Insurance',
      category: 'Medical',
      policyNumber: 'POL-2024-001',
      policyName: 'Comprehensive Health Insurance',
      coverageType: 'Individual',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      premium: 15000,
      coverageAmount: 500000,
      documents: [],
      claims: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];
  
  return mockPolicies;
};

export const createInsuranceClaim = async (claimData: Omit<InsuranceClaim, 'id'>): Promise<InsuranceClaim> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newClaim: InsuranceClaim = {
    ...claimData,
    id: `claim_${Date.now()}`
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
      description: 'Hospital treatment for emergency surgery',
      claimAmount: 50000,
      status: 'Pending',
      submittedAt: '2024-01-15T00:00:00Z',
      documents: [
        { id: '1', claimId: 'claim_1', fileName: 'receipt_1.pdf', fileUrl: '/documents/receipt_1.pdf', fileType: 'pdf', uploadedAt: '2024-01-15' },
        { id: '2', claimId: 'claim_1', fileName: 'medical_report.pdf', fileUrl: '/documents/medical_report.pdf', fileType: 'pdf', uploadedAt: '2024-01-15' }
      ]
    }
  ];
  
  return userId ? mockClaims : mockClaims;
};

// Admin functions
export const getAllInsurancePlans = async (): Promise<InsurancePlan[]> => {
  return getInsurancePlans();
};

export const createInsurancePlan = async (planData: Omit<InsurancePlan, 'id'>): Promise<InsurancePlan> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPlan: InsurancePlan = {
    ...planData,
    id: `plan_${Date.now()}`
  };
  
  // Add to mock data
  mockInsurancePlans.push(newPlan);
  
  return newPlan;
};

export const updateInsurancePlan = async (id: string, updates: Partial<InsurancePlan>): Promise<InsurancePlan> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const planIndex = mockInsurancePlans.findIndex(plan => plan.id === id);
  if (planIndex !== -1) {
    mockInsurancePlans[planIndex] = { ...mockInsurancePlans[planIndex], ...updates };
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
    description: 'Hospital treatment for emergency surgery',
    claimAmount: 50000,
    status: status as 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid',
    submittedAt: '2024-01-15T00:00:00Z',
    documents: [
      { id: '1', claimId: claimId, fileName: 'receipt_1.pdf', fileUrl: '/documents/receipt_1.pdf', fileType: 'pdf', uploadedAt: '2024-01-15' },
      { id: '2', claimId: claimId, fileName: 'medical_report.pdf', fileUrl: '/documents/medical_report.pdf', fileType: 'pdf', uploadedAt: '2024-01-15' }
    ]
  };
  
  return mockClaim;
};
