
export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  category: string;
  salary: string;
  status: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
}
