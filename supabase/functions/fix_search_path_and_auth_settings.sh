#!/bin/bash

# This script applies the migration to fix mutable search_path in functions
# and provides instructions to update Supabase Auth settings.

# Set your Supabase project URL and API key as environment variables before running:
# export SUPABASE_URL="https://your-project.supabase.co"
# export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Apply SQL migration file
echo "Applying SQL migration to fix search_path in functions..."
supabase db query < supabase/migrations/20250614000000_fix_search_path_and_auth_settings.sql

echo "Migration applied."

echo ""
echo "Next steps to update Supabase Auth settings:"
echo "1. Go to Supabase Dashboard > Authentication > Settings > Password Policy"
echo "2. Set OTP expiry to 30 minutes or less"
echo "3. Enable Leaked Password Protection toggle"
echo ""
echo "Note: These settings cannot be changed via SQL and must be updated via the dashboard."
