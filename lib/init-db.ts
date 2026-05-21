import { supabase } from './supabase';

export async function initializeDatabase() {
  try {
    // Create tables via SQL
    const schema = `
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE IF NOT EXISTS user_role AS ENUM ('admin', 'quality_manager', 'stock_manager');
CREATE TYPE IF NOT EXISTS product_type AS ENUM ('green', 'black', 'oolong', 'white', 'pu_erh', 'herbal');
CREATE TYPE IF NOT EXISTS batch_status AS ENUM ('pending', 'in_production', 'quality_check', 'completed', 'rejected');
CREATE TYPE IF NOT EXISTS stock_movement_type AS ENUM ('receipt', 'production', 'sale', 'adjustment', 'loss');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'stock_manager',
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

-- Batches table
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_number TEXT NOT NULL UNIQUE,
  product_id UUID NOT NULL REFERENCES products(id),
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

-- Batch details
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

-- Stock movements
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

-- AI predictions
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
  resolved BOOLEAN DEFAULT FALSE
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  intent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_batches_product_id ON batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_qr_code ON batches(qr_code);
CREATE INDEX IF NOT EXISTS idx_batch_details_batch_id ON batch_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_batch_id ON sales(batch_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_product_id ON ai_predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_batch_id ON anomalies(batch_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Authenticated can view products" ON products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view batches" ON batches FOR SELECT USING (auth.role() = 'authenticated');
    `;

    // For now, we'll skip direct SQL execution and rely on manual setup
    console.log('[STTIS] Database initialization schema ready. Please run migrations manually in Supabase dashboard.');
    return true;
  } catch (error) {
    console.error('[STTIS] Database initialization error:', error);
    return false;
  }
}
