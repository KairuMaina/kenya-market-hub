
-- First, let's check what values are allowed for orders status
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'orders_status_check';

-- And for vendors verification status
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'vendors_verification_status_check';

-- Update the orders table check constraint to include common status values
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'shipped', 'delivered'));

-- Update the vendors table check constraint to include common verification status values
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_verification_status_check;
ALTER TABLE vendors ADD CONSTRAINT vendors_verification_status_check 
CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended', 'under_review'));
