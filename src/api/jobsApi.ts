
// Mock jobs API - replace with actual API calls when backend is ready
export interface Job {
  id: number;
  title: string;
  description: string;
  location?: string;
  category?: string;
  salary?: string;
  job_type?: string;
  remote_option?: string;
  experience_level?: string;
  company_name?: string;
  responsibilities?: string;
  qualifications?: string;
  benefits?: string;
  application_instructions?: string;
  company_website?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: string;
  created_at: string;
}

export interface JobFilters {
  jobTypes?: string[];
  remoteOptions?: string[];
  experienceLevels?: string[];
  location?: string;
  category?: string;
  search?: string;
}

// Mock data for demonstration
const mockJobs: Job[] = [
  {
    id: 1,
    title: "Frontend Developer",
    description: "We are looking for a skilled Frontend Developer to join our team...",
    location: "Nairobi, Kenya",
    category: "Technology",
    salary: "KSh 80,000 - 120,000",
    job_type: "Full-time",
    remote_option: "Hybrid",
    experience_level: "Mid-level",
    company_name: "Tech Solutions Ltd",
    created_at: new Date().toISOString(),
    status: "open"
  },
  {
    id: 2,
    title: "Marketing Manager",
    description: "Seeking an experienced Marketing Manager to lead our marketing initiatives...",
    location: "Mombasa, Kenya",
    category: "Marketing",
    salary: "KSh 100,000 - 150,000",
    job_type: "Full-time",
    remote_option: "On-site",
    experience_level: "Senior",
    company_name: "Brand Masters",
    created_at: new Date().toISOString(),
    status: "open"
  }
];

export const getJobs = async (
  page: number = 1, 
  limit: number = 12, 
  filters?: JobFilters
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredJobs = [...mockJobs];
  
  if (filters) {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.job_type && filters.jobTypes!.includes(job.job_type)
      );
    }
    
    if (filters.remoteOptions && filters.remoteOptions.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.remote_option && filters.remoteOptions!.includes(job.remote_option)
      );
    }
    
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      filteredJobs = filteredJobs.filter(job => 
        job.experience_level && filters.experienceLevels!.includes(job.experience_level)
      );
    }
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  return {
    data: paginatedJobs,
    count: filteredJobs.length,
    totalPages: Math.ceil(filteredJobs.length / limit),
    currentPage: page,
    hasMore: endIndex < filteredJobs.length
  };
};

export const getPublicJobs = getJobs;

export const getJobById = async (id: number): Promise<Job | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockJobs.find(job => job.id === id) || null;
};

export const createJob = async (job: Omit<Job, 'id' | 'created_at'>) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newJob: Job = {
    ...job,
    id: mockJobs.length + 1,
    created_at: new Date().toISOString()
  };
  mockJobs.push(newJob);
  return [newJob];
};

export const updateJob = async (id: number, updates: Partial<Job>) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const jobIndex = mockJobs.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    mockJobs[jobIndex] = { ...mockJobs[jobIndex], ...updates };
    return [mockJobs[jobIndex]];
  }
  throw new Error('Job not found');
};

export const deleteJob = async (id: number) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const jobIndex = mockJobs.findIndex(job => job.id === id);
  if (jobIndex !== -1) {
    mockJobs.splice(jobIndex, 1);
    return [];
  }
  throw new Error('Job not found');
};
