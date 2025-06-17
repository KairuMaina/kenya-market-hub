import { supabase } from '@/integrations/supabase/client';

export interface JobFilters {
  jobTypes?: string[];
  remoteOptions?: string[];
  experienceLevels?: string[];
  location?: string;
  category?: string;
  search?: string;
}

export const getJobs = async (
  page: number = 1, 
  limit: number = 12, 
  filters?: JobFilters
) => {
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters) {
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }
    
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query = query.in('job_type', filters.jobTypes);
    }
    
    if (filters.remoteOptions && filters.remoteOptions.length > 0) {
      query = query.in('remote_option', filters.remoteOptions);
    }
    
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      query = query.in('experience_level', filters.experienceLevels);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`);
    }
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }
  
  return {
    data: data || [],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
    hasMore: (count || 0) > page * limit
  };
};

export const getPublicJobs = async (
  page: number = 1, 
  limit: number = 12, 
  filters?: JobFilters
) => {
  let query = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  // Apply filters
  if (filters) {
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
    }
    
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      query = query.in('job_type', filters.jobTypes);
    }
    
    if (filters.remoteOptions && filters.remoteOptions.length > 0) {
      query = query.in('remote_option', filters.remoteOptions);
    }
    
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      query = query.in('experience_level', filters.experienceLevels);
    }
    
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.category) {
      query = query.ilike('category', `%${filters.category}%`);
    }
  }

  // Apply pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw error;
  }
  
  return {
    data: data || [],
    count: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
    hasMore: (count || 0) > page * limit
  };
};

export const getJobById = async (id: number) => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const createJob = async (job: {
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
}) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job])
    .select();

  if (error) {
    throw error;
  }
  return data;
};

export const updateJob = async (id: number, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', id);

  if (error) {
    throw error;
  }
  return data;
};

export const deleteJob = async (id: number) => {
  const { data, error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
  return data;
};
