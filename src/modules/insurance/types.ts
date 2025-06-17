export interface InsurancePolicy {
  id: string;
  userId: string;
  providerId: string;
  providerName: string;
  category: 'Medical' | 'Motor' | 'Life/Accident' | 'Business/Property';
  policyNumber: string;
  policyName: string;
  coverageType: string;
  premium: number;
  coverageAmount: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Cancelled' | 'Pending';
  documents: PolicyDocument[];
  claims: InsuranceClaim[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDocument {
  id: string;
  policyId: string;
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
}

export interface InsuranceClaim {
  id: string;
  policyId: string;
  claimNumber: string;
  description: string;
  claimAmount: number;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Paid';
  submittedAt: string;
  processedAt?: string;
  documents: ClaimDocument[];
  adminNotes?: string;
}

export interface ClaimDocument {
  id: string;
  claimId: string;
  fileName: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  uploadedAt: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  categories: string[];
  isActive: boolean;
}

export interface InsurancePlan {
  id: string;
  providerId: string;
  providerName: string;
  category: 'Medical' | 'Motor' | 'Life/Accident' | 'Business/Property';
  name: string;
  description: string;
  coverageType: string;
  premium: number;
  coverageAmount: number;
  features: string[];
  terms: string;
  isActive: boolean;
}

export interface InsuranceFilters {
  categories: string[];
  providers: string[];
  premiumRange: {
    min: number;
    max: number;
  };
  coverageTypes: string[];
}
