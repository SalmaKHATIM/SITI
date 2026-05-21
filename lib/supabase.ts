import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'quality_manager' | 'stock_manager';
};


export interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  origin: string;
  harvest_date: string | null;
  price: number;
  price_per_kg: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}


export type Batch = {
  id: string;
  batch_number: string;
  product_id: string;
  quantity_kg: number;
  status: 'pending' | 'in_production' | 'quality_check' | 'completed' | 'rejected';
  qr_code: string | null;
  production_date: string | null;
  quality_score: number | null;
  quality_notes: string | null;
  created_at: string;
};

export type StockLevel = {
  id: string;
  product_id: string;
  warehouse_location: string;
  quantity_kg: number;
  min_threshold_kg: number | null;
  max_threshold_kg: number | null;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  product_id: string;
  batch_id: string | null;
  movement_type: 'receipt' | 'production' | 'sale' | 'adjustment' | 'loss';
  quantity_kg: number;
  warehouse_from: string | null;
  warehouse_to: string | null;
  notes: string | null;
  created_at: string;
};

