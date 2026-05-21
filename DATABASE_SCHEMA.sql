-- STTIS: Smart Tea Traceability & Intelligence System
-- Complete Database Schema Script

-- ============ USERS & ROLES ============
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ TEA PRODUCTS ============
CREATE TABLE IF NOT EXISTS public.tea_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  harvest_date DATE,
  processing_date DATE,
  quality_grade TEXT,
  initial_quantity_kg NUMERIC NOT NULL,
  current_quantity_kg NUMERIC NOT NULL,
  minimum_stock_kg NUMERIC DEFAULT 10,
  unit_price_usd NUMERIC NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ BATCHES & TRACEABILITY ============
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE RESTRICT,
  quantity_kg NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'production',
  quality_score NUMERIC CHECK (quality_score >= 0 AND quality_score <= 100),
  temperature_avg_celsius NUMERIC,
  humidity_avg_percent NUMERIC,
  production_date DATE NOT NULL,
  expiry_date DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Batch traceability history
CREATE TABLE IF NOT EXISTS public.batch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB,
  recorded_by UUID REFERENCES public.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ INVENTORY & STOCK ============
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  reason TEXT,
  reference_id TEXT,
  recorded_by UUID REFERENCES public.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock alerts
CREATE TABLE IF NOT EXISTS public.stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  threshold_value NUMERIC,
  current_value NUMERIC,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- ============ QUALITY CONTROL ============
CREATE TABLE IF NOT EXISTS public.quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  appearance_score NUMERIC CHECK (appearance_score >= 0 AND appearance_score <= 100),
  aroma_score NUMERIC CHECK (aroma_score >= 0 AND aroma_score <= 100),
  taste_score NUMERIC CHECK (taste_score >= 0 AND taste_score <= 100),
  color_score NUMERIC CHECK (color_score >= 0 AND color_score <= 100),
  overall_score NUMERIC CHECK (overall_score >= 0 AND overall_score <= 100),
  notes TEXT,
  checked_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ SALES DATA ============
CREATE TABLE IF NOT EXISTS public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES public.tea_products(id),
  customer_name TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  unit_price_usd NUMERIC NOT NULL,
  total_usd NUMERIC NOT NULL,
  order_date DATE NOT NULL,
  delivery_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ ML/AI PREDICTIONS ============
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.tea_products(id),
  prediction_type TEXT NOT NULL,
  prediction_date DATE NOT NULL,
  period TEXT,
  predicted_value NUMERIC NOT NULL,
  confidence_score NUMERIC,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ CHAT/NLP LOGS ============
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  message_text TEXT NOT NULL,
  response_text TEXT,
  intent TEXT,
  entities JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ AUDIT LOGS ============
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============ INDEXES FOR PERFORMANCE ============
CREATE INDEX IF NOT EXISTS idx_batches_product_id ON public.batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON public.batches(status);
CREATE INDEX IF NOT EXISTS idx_batches_created_at ON public.batches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_batch_history_batch_id ON public.batch_history(batch_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_product_id ON public.sales_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_order_date ON public.sales_orders(order_date DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_product_id ON public.predictions(product_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
