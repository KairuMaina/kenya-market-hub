import { supabase } from '@/integrations/supabase/client';

export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return data;
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
}) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert([job]);

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
