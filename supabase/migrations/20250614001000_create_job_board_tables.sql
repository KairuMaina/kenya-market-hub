-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  category TEXT,
  salary TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin_jobs_logs table for admin actions (optional)
CREATE TABLE IF NOT EXISTS admin_jobs_logs (
  id SERIAL PRIMARY KEY,
  admin_id UUID NOT NULL,
  job_id INTEGER,
  action TEXT NOT NULL,
  action_time TIMESTAMP WITH TIME ZONE DEFAULT now()
);
