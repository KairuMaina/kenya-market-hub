
-- Create insurance plans table
CREATE TABLE IF NOT EXISTS insurance_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Medical', 'Motor', 'Life/Accident', 'Business/Property')),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  premium DECIMAL(10,2) NOT NULL,
  coverage_amount DECIMAL(12,2) NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  terms TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create insurance policies table
CREATE TABLE IF NOT EXISTS insurance_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Medical', 'Motor', 'Life/Accident', 'Business/Property')),
  policy_number TEXT UNIQUE NOT NULL,
  policy_name TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  premium DECIMAL(10,2) NOT NULL,
  coverage_amount DECIMAL(12,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Expired', 'Cancelled', 'Pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create insurance claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES insurance_policies(id) ON DELETE CASCADE,
  claim_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  claim_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Under Review', 'Approved', 'Rejected', 'Paid')),
  admin_notes TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create policy documents table
CREATE TABLE IF NOT EXISTS policy_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES insurance_policies(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create claim documents table
CREATE TABLE IF NOT EXISTS claim_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES insurance_claims(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'image')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_documents ENABLE ROW LEVEL SECURITY;

-- Insurance plans - readable by all, modifiable by admins only
CREATE POLICY "Insurance plans are viewable by everyone" ON insurance_plans FOR SELECT USING (true);
CREATE POLICY "Insurance plans can be managed by admins" ON insurance_plans FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insurance policies - users can only see their own
CREATE POLICY "Users can view their own policies" ON insurance_policies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own policies" ON insurance_policies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all policies" ON insurance_policies FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage all policies" ON insurance_policies FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Insurance claims - users can only see their own claims
CREATE POLICY "Users can view their own claims" ON insurance_claims FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM insurance_policies 
    WHERE insurance_policies.id = insurance_claims.policy_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create claims for their policies" ON insurance_claims FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM insurance_policies 
    WHERE insurance_policies.id = insurance_claims.policy_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all claims" ON insurance_claims FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage all claims" ON insurance_claims FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Policy documents - users can only see documents for their policies
CREATE POLICY "Users can view their policy documents" ON policy_documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM insurance_policies 
    WHERE insurance_policies.id = policy_documents.policy_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Users can upload documents for their policies" ON policy_documents FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM insurance_policies 
    WHERE insurance_policies.id = policy_documents.policy_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all policy documents" ON policy_documents FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Claim documents - users can only see documents for their claims
CREATE POLICY "Users can view their claim documents" ON claim_documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM insurance_claims 
    JOIN insurance_policies ON insurance_policies.id = insurance_claims.policy_id
    WHERE insurance_claims.id = claim_documents.claim_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Users can upload documents for their claims" ON claim_documents FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM insurance_claims 
    JOIN insurance_policies ON insurance_policies.id = insurance_claims.policy_id
    WHERE insurance_claims.id = claim_documents.claim_id 
    AND insurance_policies.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all claim documents" ON claim_documents FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_insurance_plans_category ON insurance_plans(category);
CREATE INDEX idx_insurance_plans_provider ON insurance_plans(provider_name);
CREATE INDEX idx_insurance_plans_active ON insurance_plans(is_active);
CREATE INDEX idx_insurance_policies_user_id ON insurance_policies(user_id);
CREATE INDEX idx_insurance_policies_status ON insurance_policies(status);
CREATE INDEX idx_insurance_claims_policy_id ON insurance_claims(policy_id);
CREATE INDEX idx_insurance_claims_status ON insurance_claims(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_insurance_plans_updated_at BEFORE UPDATE ON insurance_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
