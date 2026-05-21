import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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
  console.log('[STTIS] Creating test accounts...\n');

  for (const account of testAccounts) {
    try {
      // Check if account already exists
      const { data: existingUser } = await supabase.auth.admin.getUserById(
        (await supabase.auth.admin.listUsers())
          .data?.users?.find((u) => u.email === account.email)?.id || ''
      );

      if (existingUser?.user) {
        console.log(`[STTIS] Account ${account.email} already exists`);
        continue;
      }

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
        console.error(`[STTIS] Error creating ${account.email}:`, signupError.message);
        continue;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .upsert({
            id: data.user.id,
            email: account.email,
            full_name: account.fullName,
            role: account.role,
            is_active: true,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error(`[STTIS] Error creating profile for ${account.email}:`, profileError.message);
        } else {
          console.log(`[STTIS] ✓ Account created: ${account.email} (${account.role})`);
          console.log(`       Password: ${account.password}\n`);
        }
      }
    } catch (error) {
      console.error(`[STTIS] Unexpected error for ${account.email}:`, error);
    }
  }

  console.log('[STTIS] Account creation completed!');
}

// Run the script
createAccounts().catch(console.error);
