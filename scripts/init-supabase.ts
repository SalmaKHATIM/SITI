import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  console.log('[STTIS] Initializing database schema...');

  try {
    // 1. Create tables
    const { error: tablesError } = await supabase.rpc('execute_sql', {
      sql: `
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'stock_manager',
          department TEXT,
          phone TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Products table
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          sku TEXT UNIQUE NOT NULL,
          description TEXT,
          origin TEXT,
          variety TEXT,
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Batches table
        CREATE TABLE IF NOT EXISTS batches (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          batch_number TEXT UNIQUE NOT NULL,
          product_id UUID REFERENCES products(id),
          quantity_kg DECIMAL(10, 2),
          production_date DATE,
          quality_score INTEGER,
          quality_notes TEXT,
          status TEXT DEFAULT 'in_production',
          created_by UUID REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        -- Stock levels table
        CREATE TABLE IF NOT EXISTS stock_levels (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID REFERENCES products(id),
          current_quantity_kg DECIMAL(10, 2),
          min_threshold_kg DECIMAL(10, 2),
          max_capacity_kg DECIMAL(10, 2),
          warehouse_location TEXT,
          last_updated TIMESTAMP DEFAULT NOW()
        );

        -- Stock movements table
        CREATE TABLE IF NOT EXISTS stock_movements (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          batch_id UUID REFERENCES batches(id),
          movement_type TEXT NOT NULL,
          quantity_kg DECIMAL(10, 2),
          from_location TEXT,
          to_location TEXT,
          created_by UUID REFERENCES users(id),
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- AI Predictions table
        CREATE TABLE IF NOT EXISTS ai_predictions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID REFERENCES products(id),
          prediction_type TEXT NOT NULL,
          forecast_period TEXT,
          predicted_quantity DECIMAL(10, 2),
          confidence_score DECIMAL(3, 2),
          recommendations TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Anomalies table
        CREATE TABLE IF NOT EXISTS anomalies (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          batch_id UUID REFERENCES batches(id),
          anomaly_type TEXT NOT NULL,
          severity TEXT,
          description TEXT,
          resolved BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          resolved_at TIMESTAMP
        );

        -- Chat messages table
        CREATE TABLE IF NOT EXISTS chat_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          message TEXT NOT NULL,
          intent TEXT,
          response TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );

        -- Audit logs table
        CREATE TABLE IF NOT EXISTS audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          action TEXT NOT NULL,
          table_name TEXT,
          record_id UUID,
          changes JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `,
    });

    if (tablesError) {
      console.log('[STTIS] Tables might already exist, continuing...');
    } else {
      console.log('[STTIS] Tables created successfully');
    }

    // 2. Enable RLS
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql: `
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
        ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
        ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
        ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
        ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
      `,
    });

    if (rlsError) {
      console.log('[STTIS] RLS already configured');
    } else {
      console.log('[STTIS] RLS enabled successfully');
    }

    console.log('[STTIS] Database initialization complete!');
    return true;
  } catch (error) {
    console.error('[STTIS] Error initializing database:', error);
    return false;
  }
}

// Create test users
async function createTestUsers() {
  console.log('[STTIS] Creating test users...');

  const testUsers = [
    {
      email: 'admin@sttis.tea',
      password: 'Admin@12345',
      fullName: 'Admin User',
      role: 'admin',
    },
    {
      email: 'qa@sttis.tea',
      password: 'QA@12345',
      fullName: 'Quality Manager',
      role: 'quality_manager',
    },
    {
      email: 'stock@sttis.tea',
      password: 'Stock@12345',
      fullName: 'Stock Manager',
      role: 'stock_manager',
    },
  ];

  for (const user of testUsers) {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      });

      if (authError) {
        console.log(`[STTIS] User ${user.email} already exists`);
        continue;
      }

      // Create profile
      if (authData.user) {
        await supabase.from('users').insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.fullName,
          role: user.role,
          department: user.role === 'admin' ? 'Management' : user.role === 'quality_manager' ? 'Quality' : 'Warehouse',
        });

        console.log(`[STTIS] Created user: ${user.email}`);
      }
    } catch (error) {
      console.error(`[STTIS] Error creating user ${user.email}:`, error);
    }
  }
}

// Main execution
async function main() {
  console.log('[STTIS] Starting database initialization...\n');

  const initialized = await initializeDatabase();

  if (initialized) {
    await createTestUsers();
  }

  console.log('\n[STTIS] Database initialization complete!');
  console.log('\n📝 Test Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Account:');
  console.log('  Email: admin@sttis.tea');
  console.log('  Password: Admin@12345');
  console.log('\nQuality Manager:');
  console.log('  Email: qa@sttis.tea');
  console.log('  Password: QA@12345');
  console.log('\nStock Manager:');
  console.log('  Email: stock@sttis.tea');
  console.log('  Password: Stock@12345');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch(console.error);
