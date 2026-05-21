#!/bin/bash

echo "=========================================="
echo "STTIS Database Initialization"
echo "=========================================="
echo ""

# Check if Supabase URL and key are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "ERROR: Missing Supabase credentials in environment variables"
  echo "Please set:"
  echo "  - NEXT_PUBLIC_SUPABASE_URL"
  echo "  - SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

echo "✓ Supabase credentials found"
echo ""
echo "To initialize your database, follow these steps:"
echo ""
echo "1. Go to Supabase Dashboard (https://supabase.com/dashboard)"
echo "2. Select your project"
echo "3. Go to SQL Editor"
echo "4. Click 'New Query'"
echo "5. Open DATABASE_SCHEMA.sql file in this project"
echo "6. Copy the entire SQL content"
echo "7. Paste it in the SQL Editor"
echo "8. Click 'Run'"
echo ""
echo "9. Then run this command to create test accounts:"
echo "   node scripts/create-test-accounts.js"
echo ""
echo "10. Create .env.local file with:"
cat > .env.local.example << 'ENV'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ENV

echo "    (Replace with your actual Supabase keys)"
echo ""
echo "=========================================="
