-- STTIS: Smart Tea Traceability & Intelligence System
-- Initial Database Schema

-- ============ USERS & ROLES ============
CREATE TYPE user_role AS ENUM ('admin', 'quality_manager', 'stock_manager', 'viewer');

-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users profile extension
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.users FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- ============ TEA PRODUCTS ============
CREATE TABLE public.tea_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  type TEXT NOT NULL, -- green, black, oolong, etc.
  description TEXT,
  harvest_date DATE,
  processing_date DATE,
  quality_grade TEXT, -- premium, grade1, grade2, etc.
  initial_quantity_kg NUMERIC NOT NULL,
  current_quantity_kg NUMERIC NOT NULL,
  minimum_stock_kg NUMERIC DEFAULT 10,
  unit_price_usd NUMERIC NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tea_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON public.tea_products FOR SELECT
  USING (true);

CREATE POLICY "Stock managers can insert/update"
  ON public.tea_products FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'stock_manager')
    )
  );

CREATE POLICY "Stock managers can update"
  ON public.tea_products FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'stock_manager')
    )
  );

-- ============ BATCHES & TRACEABILITY ============
CREATE TABLE public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE RESTRICT,
  quantity_kg NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'production', -- production, packaging, storage, shipped, sold
  quality_score NUMERIC CHECK (quality_score >= 0 AND quality_score <= 100),
  temperature_avg_celsius NUMERIC,
  humidity_avg_percent NUMERIC,
  production_date DATE NOT NULL,
  expiry_date DATE,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view batches"
  ON public.batches FOR SELECT
  USING (true);

CREATE POLICY "Quality managers can insert"
  ON public.batches FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'quality_manager')
    )
  );

-- Batch traceability history
CREATE TABLE public.batch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- status_change, temperature_alert, quality_check, etc.
  details JSONB,
  recorded_by UUID REFERENCES public.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.batch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view batch history"
  ON public.batch_history FOR SELECT
  USING (true);

-- ============ INVENTORY & STOCK ============
CREATE TABLE public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL, -- in, out, adjustment, damage
  quantity_kg NUMERIC NOT NULL,
  reason TEXT,
  reference_id TEXT, -- order id, batch id, etc.
  recorded_by UUID REFERENCES public.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stock managers can view movements"
  ON public.stock_movements FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role IN ('admin', 'stock_manager', 'viewer')
    )
  );

-- Stock alerts
CREATE TABLE public.stock_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.tea_products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- low_stock, overstock, near_expiry
  threshold_value NUMERIC,
  current_value NUMERIC,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view alerts"
  ON public.stock_alerts FOR SELECT
  USING (true);

-- ============ QUALITY CONTROL ============
CREATE TABLE public.quality_checks (
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

ALTER TABLE public.quality_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quality checks"
  ON public.quality_checks FOR SELECT
  USING (true);

-- ============ SALES DATA ============
CREATE TABLE public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES public.tea_products(id),
  customer_name TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  unit_price_usd NUMERIC NOT NULL,
  total_usd NUMERIC NOT NULL,
  order_date DATE NOT NULL,
  delivery_date DATE,
  status TEXT DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orders"
  ON public.sales_orders FOR SELECT
  USING (true);

-- ============ ML/AI PREDICTIONS ============
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.tea_products(id),
  prediction_type TEXT NOT NULL, -- sales_forecast, stock_optimization, anomaly_detection
  prediction_date DATE NOT NULL,
  period TEXT, -- 1m, 3m, 6m, 12m
  predicted_value NUMERIC NOT NULL,
  confidence_score NUMERIC,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view predictions"
  ON public.predictions FOR SELECT
  USING (true);

-- ============ CHAT/NLP LOGS ============
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  message_text TEXT NOT NULL,
  response_text TEXT,
  intent TEXT, -- query, recommendation, alert, etc.
  entities JSONB, -- extracted product names, dates, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

-- ============ AUDIT LOGS ============
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
    )
  );

-- ============ INDEXES FOR PERFORMANCE ============
CREATE INDEX idx_batches_product_id ON public.batches(product_id);
CREATE INDEX idx_batches_status ON public.batches(status);
CREATE INDEX idx_batches_created_at ON public.batches(created_at DESC);
CREATE INDEX idx_batch_history_batch_id ON public.batch_history(batch_id);
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX idx_sales_orders_product_id ON public.sales_orders(product_id);
CREATE INDEX idx_sales_orders_order_date ON public.sales_orders(order_date DESC);
CREATE INDEX idx_predictions_product_id ON public.predictions(product_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ============ FUNCTIONS ============

-- Function to log changes to audit_logs
CREATE OR REPLACE FUNCTION log_audit_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (
    auth.uid(),
    TG_ARGV[0],
    TG_TABLE_NAME,
    COALESCE(NEW.id::TEXT, OLD.id::TEXT),
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for tea_products changes
CREATE TRIGGER audit_tea_products AFTER INSERT OR UPDATE OR DELETE ON public.tea_products
FOR EACH ROW EXECUTE FUNCTION log_audit_change('product_change');

-- Trigger for batches changes
CREATE TRIGGER audit_batches AFTER INSERT OR UPDATE OR DELETE ON public.batches
FOR EACH ROW EXECUTE FUNCTION log_audit_change('batch_change');

-- Trigger for quality_checks changes
CREATE TRIGGER audit_quality_checks AFTER INSERT OR UPDATE OR DELETE ON public.quality_checks
FOR EACH ROW EXECUTE FUNCTION log_audit_change('quality_check');
