#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('[STTIS] ERROR: Missing Supabase credentials');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const testAccounts = [
  {
    email: 'admin@sttis.local',
    password: 'Admin@123456',
    role: 'admin',
    fullName: 'System Administrator',
  },
  {
    email: 'qa@sttis.local',
    password: 'QA@123456',
    role: 'quality_manager',
    fullName: 'Quality Manager',
  },
  {
    email: 'stock@sttis.local',
    password: 'Stock@123456',
    role: 'stock_manager',
    fullName: 'Stock Manager',
  },
];

async function createAccounts() {
  console.log('\n================================================================================');
  console.log('                    STTIS - CREATING TEST ACCOUNTS');
  console.log('================================================================================\n');

  let successCount = 0;
  let errorCount = 0;

  for (const account of testAccounts) {
    try {
      console.log(`[*] Creating account: ${account.email}`);

      // Create auth user
      const { data, error: signupError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          full_name: account.fullName,
          role: account.role,
        },
      });

      if (signupError) {
        // Check if it's a duplicate user error
        if (signupError.message.includes('already exists')) {
          console.log(`[✓] Account already exists: ${account.email}`);
          successCount++;
        } else {
          console.error(`[✗] Error creating ${account.email}: ${signupError.message}`);
          errorCount++;
        }
        continue;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: account.email,
          full_name: account.fullName,
          role: account.role,
          is_active: true,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error(`[✗] Error creating profile for ${account.email}: ${profileError.message}`);
          errorCount++;
        } else {
          console.log(`[✓] Account created successfully`);
          console.log(`    Email:    ${account.email}`);
          console.log(`    Password: ${account.password}`);
          console.log(`    Role:     ${account.role}\n`);
          successCount++;
        }
      }
    } catch (error) {
      console.error(`[✗] Unexpected error for ${account.email}:`, error.message);
      errorCount++;
    }
  }

  console.log('================================================================================');
  console.log(`SUMMARY: ${successCount} accounts created/updated, ${errorCount} errors`);
  console.log('================================================================================\n');

  console.log('Test Credentials saved in: CREDENTIALS.csv and CREDENTIALS.txt\n');
}

// Run the script
createAccounts().catch((error) => {
  console.error('[✗] Fatal error:', error.message);
  process.exit(1);
});
