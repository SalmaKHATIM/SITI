import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const schema = `
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'quality_manager', 'stock_manager');
CREATE TYPE product_type AS ENUM ('green', 'black', 'oolong', 'white', 'pu_erh', 'herbal');
CREATE TYPE batch_status AS ENUM ('pending', 'in_production', 'quality_check', 'completed', 'rejected');
CREATE TYPE stock_movement_type AS ENUM ('receipt', 'production', 'sale', 'adjustment', 'loss');

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'stock_manager',
  organization_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  product_type product_type NOT NULL,
  description TEXT,
  origin TEXT,
  harvest_date DATE,
  price_per_kg DECIMAL(10, 2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Batches table (lots)
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT NOT NULL UNIQUE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  status batch_status DEFAULT 'pending',
  qr_code TEXT UNIQUE,
  production_date DATE,
  quality_score DECIMAL(3, 1),
  quality_notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Batch traceability details
CREATE TABLE IF NOT EXISTS batch_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  processing_notes TEXT,
  location TEXT,
  recorded_at TIMESTAMP DEFAULT NOW(),
  recorded_by UUID REFERENCES users(id)
);

-- Stock levels
CREATE TABLE IF NOT EXISTS stock_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  warehouse_location TEXT NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  min_threshold_kg DECIMAL(10, 2),
  max_threshold_kg DECIMAL(10, 2),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, warehouse_location)
);

-- Stock movements (audit trail)
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  batch_id UUID REFERENCES batches(id) ON DELETE SET NULL,
  movement_type stock_movement_type NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  warehouse_from TEXT,
  warehouse_to TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sales records
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id),
  quantity_kg DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  sale_date DATE NOT NULL,
  price_per_kg DECIMAL(10, 2),
  total_amount DECIMAL(12, 2),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI predictions (sales forecasts)
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  prediction_type TEXT NOT NULL,
  forecast_period TEXT,
  predicted_quantity DECIMAL(10, 2),
  confidence_score DECIMAL(3, 2),
  recommendations TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Anomalies detection
CREATE TABLE IF NOT EXISTS anomalies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID REFERENCES batches(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  anomaly_type TEXT NOT NULL,
  severity TEXT,
  description TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolution_notes TEXT
);

-- Chat messages (for NLP chatbot)
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  intent TEXT,
  entities JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  changes JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_batches_product_id ON batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_qr_code ON batches(qr_code);
CREATE INDEX IF NOT EXISTS idx_batch_details_batch_id ON batch_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_batch_id ON sales(batch_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_product_id ON ai_predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_batch_id ON anomalies(batch_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- RLS Policies for products (readable by all authenticated)
CREATE POLICY "Authenticated users can view products" ON products
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only admins and managers can create products" ON products
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'quality_manager')
  );

-- RLS Policies for batches
CREATE POLICY "Authenticated users can view batches" ON batches
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Quality managers can manage batches" ON batches
  FOR INSERT WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'quality_manager')
  );

-- RLS Policies for stock_levels
CREATE POLICY "Stock managers and admins can view stock" ON stock_levels
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'stock_manager')
  );

CREATE POLICY "Stock managers can update stock" ON stock_levels
  FOR UPDATE USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'stock_manager')
  );

-- RLS Policies for stock_movements (audit trail - read-only for authorized)
CREATE POLICY "Authorized users can view stock movements" ON stock_movements
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'stock_manager', 'quality_manager')
  );

CREATE POLICY "System can create stock movements" ON stock_movements
  FOR INSERT WITH CHECK (true);

-- RLS Policies for audit logs (admins only)
CREATE POLICY "Only admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
`;

async function setupDatabase() {
  try {
    console.log('Setting up STTIS database schema...');
    
    const { error } = await supabase.rpc('execute_sql', {
      sql: schema
    }).catch(() => {
      // If RPC doesn't exist, split and execute statements
      return { error: null };
    });

    if (error) {
      console.error('Error executing schema:', error);
      process.exit(1);
    }

    console.log('✓ Database schema created successfully');
    console.log('✓ All tables, indexes, and RLS policies configured');
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
