-- STTIS: Comprehensive Seed Data Script
-- This script populates all 11 tables with realistic data
-- Run this AFTER 01-init-schema.sql

-- ============ 1. INSERT USERS (Team Members) ============
INSERT INTO public.users (email, full_name, role, organization) VALUES
  ('admin@sttis.local', 'Ahmed Hassan', 'admin', 'STTIS Inc.'),
  ('qa@sttis.local', 'Fatima El-Mansouri', 'qa_manager', 'STTIS Inc.'),
  ('stock@sttis.local', 'Mohamed Bakri', 'stock_manager', 'STTIS Inc.'),
  ('manager@sttis.local', 'Sarah Johnson', 'manager', 'STTIS Inc.'),
  ('operator1@sttis.local', 'Hassan Al-Rashid', 'operator', 'STTIS Inc.'),
  ('operator2@sttis.local', 'Leila Khaled', 'operator', 'STTIS Inc.'),
  ('viewer@sttis.local', 'John Smith', 'viewer', 'STTIS Inc.'),
  ('inspector@sttis.local', 'Dr. Ali Mansour', 'inspector', 'STTIS Inc.')
ON CONFLICT (email) DO NOTHING;

-- ============ 2. INSERT TEA PRODUCTS (32 Premium Products) ============
INSERT INTO public.tea_products 
(name, origin, type, description, harvest_date, processing_date, quality_grade, 
 initial_quantity_kg, current_quantity_kg, minimum_stock_kg, unit_price_usd, created_by) 
VALUES
  -- GREEN TEAS (8 products)
  ('Dragon Well Premium', 'Hangzhou, China', 'Green', 'Premium green tea with chestnut aroma', '2024-04-15', '2024-04-20', 'Grade A', 500.00, 425.50, 20.00, 85.00, 
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Sencha Supreme', 'Shizuoka, Japan', 'Green', 'Bright, grassy green tea with umami notes', '2024-03-20', '2024-03-25', 'Grade A+', 450.00, 380.25, 15.00, 95.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Jasmine Green Pearls', 'Fujian, China', 'Green', 'Hand-rolled green tea with jasmine flowers', '2024-02-28', '2024-03-05', 'Grade A', 350.00, 290.75, 12.00, 72.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Matcha Imperial', 'Kyoto, Japan', 'Green', 'Premium ceremonial matcha powder', '2024-05-01', '2024-05-10', 'Grade AAA', 150.00, 135.20, 5.00, 120.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Gyokuro Elite', 'Yame, Japan', 'Green', 'Shade-grown elite green tea', '2024-04-10', '2024-04-15', 'Grade A+', 200.00, 178.50, 8.00, 110.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Longjing Harvest', 'Hangzhou, China', 'Green', 'Early spring harvest dragon well', '2024-03-15', '2024-03-20', 'Grade AA', 380.00, 320.40, 14.00, 92.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Genmaicha Blend', 'Tokyo, Japan', 'Green', 'Green tea with roasted rice', '2024-04-05', '2024-04-10', 'Grade A', 280.00, 245.60, 10.00, 48.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Yuzu Green Tea', 'Kochi, Japan', 'Green', 'Green tea infused with yuzu citrus', '2024-04-20', '2024-04-25', 'Grade A', 320.00, 268.80, 12.00, 78.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),

  -- BLACK TEAS (8 products)
  ('Assam Golden', 'Assam, India', 'Black', 'Malty and robust black tea', '2024-03-10', '2024-03-15', 'Grade A', 420.00, 357.00, 15.00, 65.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Keemun Elegance', 'Anhui, China', 'Black', 'Wine-like black tea with complex notes', '2024-02-15', '2024-02-20', 'Grade AA', 380.00, 316.40, 12.00, 88.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Darjeeling First Flush', 'Darjeeling, India', 'Black', 'Muscatel flavor, light and floral', '2024-03-25', '2024-03-30', 'Grade AA', 550.00, 473.50, 18.00, 98.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Ceylon Highland', 'Central Highlands, Sri Lanka', 'Black', 'Brisk and bright black tea', '2024-04-01', '2024-04-05', 'Grade A', 400.00, 340.00, 14.00, 72.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Lapsang Souchong', 'Fujian, China', 'Black', 'Smoky pine wood aroma', '2024-01-15', '2024-01-20', 'Grade A', 320.00, 272.00, 10.00, 82.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Kenya AA Black', 'Kenyan Highlands', 'Black', 'Bold with berry notes', '2024-03-01', '2024-03-06', 'Grade AA', 380.00, 322.00, 13.00, 75.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Irish Breakfast Blend', 'Assam & Ceylon Mix', 'Black', 'Bold blend for strong tea', '2024-04-10', '2024-04-15', 'Grade A', 450.00, 382.50, 16.00, 58.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Earl Grey Premium', 'Ceylon with Bergamot', 'Black', 'Classic bergamot blend', '2024-04-15', '2024-04-20', 'Grade A', 380.00, 323.00, 13.00, 68.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),

  -- OOLONG TEAS (8 products)
  ('Tie Guan Yin', 'Anxi, China', 'Oolong', 'Heavily roasted with orchid aroma', '2024-04-08', '2024-04-15', 'Grade A', 520.00, 442.00, 16.00, 105.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Da Hong Pao', 'Wuyi Mountains, China', 'Oolong', 'Big Red Robe - fruity and sweet', '2024-03-20', '2024-03-25', 'Grade AA', 600.00, 510.00, 18.00, 120.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Ali Shan Oolong', 'Taiwan', 'Oolong', 'High mountain with fruity notes', '2024-04-12', '2024-04-18', 'Grade A', 480.00, 408.00, 15.00, 95.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Pouchong Tea', 'Taiwan', 'Oolong', 'Lightly oxidized with floral notes', '2024-04-05', '2024-04-10', 'Grade A', 420.00, 357.00, 14.00, 85.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Formosa Oolong', 'Taiwan', 'Oolong', 'Natural sweetness with fruity aroma', '2024-03-28', '2024-04-02', 'Grade AA', 500.00, 425.00, 16.00, 92.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Roasted Oolong', 'Fujian, China', 'Oolong', 'Dark roasted with woody notes', '2024-02-10', '2024-02-18', 'Grade A', 380.00, 323.00, 12.00, 78.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Orchid Oolong Premium', 'Taiwan', 'Oolong', 'Delicate orchid and honey notes', '2024-04-01', '2024-04-08', 'Grade AA', 550.00, 467.50, 17.00, 115.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Thai Oolong Gold', 'Northern Thailand', 'Oolong', 'Golden with fruity undertones', '2024-03-15', '2024-03-20', 'Grade A', 420.00, 357.00, 13.00, 88.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),

  -- WHITE TEAS (8 products)
  ('Silver Needle', 'Fujian, China', 'White', 'Delicate with natural sweetness', '2024-04-20', '2024-04-25', 'Grade AA', 480.00, 408.00, 14.00, 125.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('White Peony', 'Fujian, China', 'White', 'Buds and leaves with floral notes', '2024-04-15', '2024-04-20', 'Grade A', 420.00, 357.00, 13.00, 105.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Moonlight White', 'Yunnan, China', 'White', 'Night-harvested with honey notes', '2024-04-10', '2024-04-15', 'Grade AA', 500.00, 425.00, 15.00, 110.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('White Jasmine', 'Fujian, China', 'White', 'White tea scented with jasmine', '2024-04-05', '2024-04-10', 'Grade A', 380.00, 323.00, 12.00, 88.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Royal White Tea', 'Fujian, China', 'White', 'Premium white tea selection', '2024-04-01', '2024-04-08', 'Grade AA', 450.00, 382.50, 14.00, 115.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Cloud White', 'Yunnan, China', 'White', 'Fluffy buds with fruity aroma', '2024-03-28', '2024-04-03', 'Grade A', 420.00, 357.00, 13.00, 98.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('White Mulberry Tea', 'Guangdong, China', 'White', 'Sweet with mulberry flavors', '2024-03-25', '2024-03-30', 'Grade A', 360.00, 306.00, 11.00, 82.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('Junshan Silver Needle', 'Hunan, China', 'White', 'Rare silver needle variant', '2024-04-12', '2024-04-18', 'Grade AAA', 550.00, 467.50, 16.00, 135.00,
   (SELECT id FROM public.users WHERE email = 'admin@sttis.local'));

-- ============ 3. INSERT BATCHES (40 Production Batches) ============
INSERT INTO public.batches 
(batch_number, product_id, quantity_kg, status, quality_score, temperature_avg_celsius, humidity_avg_percent, 
 production_date, expiry_date, created_by) 
VALUES
  -- Dragon Well batches
  ('BTH-2024-DW-001', (SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 50.0, 'completed', 92.5, 22.0, 65.0, '2024-04-20', '2026-04-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-DW-002', (SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 45.0, 'completed', 88.5, 21.5, 62.0, '2024-04-22', '2026-04-22', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-DW-003', (SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 42.0, 'in_production', 85.0, 23.0, 68.0, '2024-05-01', '2026-05-01', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Sencha batches
  ('BTH-2024-SEN-001', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 48.0, 'completed', 94.0, 20.0, 60.0, '2024-03-25', '2026-03-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-SEN-002', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 46.0, 'completed', 91.0, 21.0, 63.0, '2024-03-27', '2026-03-27', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-SEN-003', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 50.0, 'in_production', 87.5, 22.0, 65.0, '2024-04-28', '2026-04-28', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Jasmine batches
  ('BTH-2024-JAS-001', (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 35.0, 'completed', 89.0, 21.5, 62.0, '2024-03-05', '2026-03-05', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-JAS-002', (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 32.0, 'completed', 86.5, 22.0, 64.0, '2024-03-10', '2026-03-10', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-JAS-003', (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 38.0, 'packaging', 88.0, 21.0, 63.0, '2024-04-25', '2026-04-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Matcha batches
  ('BTH-2024-MAT-001', (SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 15.0, 'completed', 96.5, 18.0, 55.0, '2024-05-10', '2025-05-10', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-MAT-002', (SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 12.0, 'in_production', 94.0, 19.0, 57.0, '2024-05-15', '2025-05-15', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Assam batches
  ('BTH-2024-ASS-001', (SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 42.0, 'completed', 90.5, 23.0, 70.0, '2024-03-15', '2026-03-15', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-ASS-002', (SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 38.0, 'completed', 87.5, 22.5, 68.0, '2024-03-20', '2026-03-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-ASS-003', (SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 40.0, 'in_production', 88.0, 23.5, 71.0, '2024-04-30', '2026-04-30', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Keemun batches
  ('BTH-2024-KEM-001', (SELECT id FROM public.tea_products WHERE name = 'Keemun Elegance'), 38.0, 'completed', 93.0, 21.5, 64.0, '2024-02-20', '2026-02-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-KEM-002', (SELECT id FROM public.tea_products WHERE name = 'Keemun Elegance'), 35.0, 'packaging', 91.0, 21.0, 62.0, '2024-03-01', '2026-03-01', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Darjeeling batches
  ('BTH-2024-DAR-001', (SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 55.0, 'completed', 95.5, 19.0, 58.0, '2024-03-30', '2026-03-30', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-DAR-002', (SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 52.0, 'quality_check', 93.0, 20.0, 60.0, '2024-04-05', '2026-04-05', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Ceylon batches
  ('BTH-2024-CEY-001', (SELECT id FROM public.tea_products WHERE name = 'Ceylon Highland'), 40.0, 'completed', 89.5, 22.0, 66.0, '2024-04-05', '2026-04-05', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-CEY-002', (SELECT id FROM public.tea_products WHERE name = 'Ceylon Highland'), 38.0, 'in_production', 87.0, 22.5, 68.0, '2024-04-25', '2026-04-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Tie Guan Yin batches
  ('BTH-2024-TGY-001', (SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 52.0, 'completed', 94.5, 20.5, 63.0, '2024-04-15', '2026-04-15', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-TGY-002', (SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 48.0, 'quality_check', 91.5, 21.0, 64.0, '2024-04-20', '2026-04-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Da Hong Pao batches
  ('BTH-2024-DHP-001', (SELECT id FROM public.tea_products WHERE name = 'Da Hong Pao'), 60.0, 'completed', 96.0, 19.5, 61.0, '2024-03-25', '2026-03-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-DHP-002', (SELECT id FROM public.tea_products WHERE name = 'Da Hong Pao'), 55.0, 'in_production', 93.5, 20.5, 63.0, '2024-04-20', '2026-04-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Silver Needle batches
  ('BTH-2024-SN-001', (SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 48.0, 'completed', 97.0, 18.0, 54.0, '2024-04-25', '2025-04-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-SN-002', (SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 45.0, 'quality_check', 95.5, 18.5, 56.0, '2024-05-02', '2025-05-02', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  
  -- Additional batches for other products
  ('BTH-2024-GP-001', (SELECT id FROM public.tea_products WHERE name = 'Gyokuro Elite'), 20.0, 'completed', 93.5, 19.0, 58.0, '2024-04-15', '2026-04-15', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-LH-001', (SELECT id FROM public.tea_products WHERE name = 'Longjing Harvest'), 38.0, 'completed', 91.0, 21.0, 62.0, '2024-03-20', '2026-03-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-GB-001', (SELECT id FROM public.tea_products WHERE name = 'Genmaicha Blend'), 28.0, 'in_production', 85.5, 22.0, 65.0, '2024-04-10', '2026-04-10', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-YG-001', (SELECT id FROM public.tea_products WHERE name = 'Yuzu Green Tea'), 32.0, 'packaging', 87.0, 21.5, 63.0, '2024-04-25', '2026-04-25', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-KA-001', (SELECT id FROM public.tea_products WHERE name = 'Kenya AA Black'), 38.0, 'completed', 89.0, 22.5, 68.0, '2024-03-06', '2026-03-06', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ('BTH-2024-WP-001', (SELECT id FROM public.tea_products WHERE name = 'White Peony'), 42.0, 'completed', 94.5, 18.5, 56.0, '2024-04-20', '2025-04-20', (SELECT id FROM public.users WHERE email = 'admin@sttis.local'));

-- ============ 4. INSERT BATCH HISTORY (Event Tracking) ============
INSERT INTO public.batch_history (batch_id, event_type, details, recorded_by) VALUES
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), 'production_started', '{"temperature": 22.0, "humidity": 65.0}', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), 'quality_checkpoint', '{"initial_score": 85.0}', (SELECT id FROM public.users WHERE email = 'qa@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), 'batch_completed', '{"final_score": 92.5}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SEN-001'), 'production_started', '{"temperature": 20.0, "humidity": 60.0}', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SEN-001'), 'batch_completed', '{"final_score": 94.0}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-JAS-001'), 'production_started', '{"scent_applied": true, "batches": 35}', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-JAS-001'), 'quality_checkpoint', '{"scent_quality": "excellent"}', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-JAS-001'), 'batch_completed', '{"final_score": 89.0}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-MAT-001'), 'production_started', '{"grinding_method": "stone_mill"}', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-MAT-001'), 'batch_completed', '{"final_score": 96.5}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-ASS-001'), 'production_started', '{"oxidation_level": "full"}', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-ASS-001'), 'quality_checkpoint', '{"malty_notes": "strong"}', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-ASS-001'), 'batch_completed', '{"final_score": 90.5}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DAR-001'), 'production_started', '{"first_flush": true}', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DAR-001'), 'batch_completed', '{"final_score": 95.5}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-TGY-001'), 'production_started', '{"roasting_level": "medium"}', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-TGY-001'), 'batch_completed', '{"final_score": 94.5}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SN-001'), 'production_started', '{"harvest_type": "hand_picked"}', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SN-001'), 'batch_completed', '{"final_score": 97.0}', (SELECT id FROM public.users WHERE email = 'admin@sttis.local'));

-- ============ 5. INSERT STOCK MOVEMENTS (Inventory Transactions) ============
INSERT INTO public.stock_movements (product_id, movement_type, quantity_kg, reason, reference_id, recorded_by) VALUES
  -- Dragon Well movements
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'produced', 50.0, 'BTH-2024-DW-001 completed', 'BTH-2024-DW-001', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'produced', 45.0, 'BTH-2024-DW-002 completed', 'BTH-2024-DW-002', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'sold', 25.0, 'ORD-2024-001', 'ORD-2024-001', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'quality_loss', 2.5, 'Failed quality check', 'QC-001', (SELECT id FROM public.users WHERE email = 'qa@sttis.local')),
  
  -- Sencha movements
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'produced', 48.0, 'BTH-2024-SEN-001 completed', 'BTH-2024-SEN-001', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'produced', 46.0, 'BTH-2024-SEN-002 completed', 'BTH-2024-SEN-002', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'sold', 30.0, 'ORD-2024-002', 'ORD-2024-002', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'sold', 15.75, 'ORD-2024-005', 'ORD-2024-005', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Jasmine movements
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'produced', 35.0, 'BTH-2024-JAS-001 completed', 'BTH-2024-JAS-001', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'produced', 32.0, 'BTH-2024-JAS-002 completed', 'BTH-2024-JAS-002', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'sold', 20.0, 'ORD-2024-003', 'ORD-2024-003', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'damaged', 1.25, 'Packaging damage', 'DMG-001', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Assam movements
  ((SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'produced', 42.0, 'BTH-2024-ASS-001 completed', 'BTH-2024-ASS-001', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'produced', 38.0, 'BTH-2024-ASS-002 completed', 'BTH-2024-ASS-002', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'sold', 28.0, 'ORD-2024-006', 'ORD-2024-006', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Darjeeling movements
  ((SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'produced', 55.0, 'BTH-2024-DAR-001 completed', 'BTH-2024-DAR-001', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'sold', 40.0, 'ORD-2024-004', 'ORD-2024-004', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Matcha movements
  ((SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'produced', 15.0, 'BTH-2024-MAT-001 completed', 'BTH-2024-MAT-001', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'sold', 12.2, 'ORD-2024-007', 'ORD-2024-007', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Tie Guan Yin movements
  ((SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'produced', 52.0, 'BTH-2024-TGY-001 completed', 'BTH-2024-TGY-001', (SELECT id FROM public.users WHERE email = 'operator2@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'sold', 35.0, 'ORD-2024-008', 'ORD-2024-008', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  
  -- Silver Needle movements
  ((SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'produced', 48.0, 'BTH-2024-SN-001 completed', 'BTH-2024-SN-001', (SELECT id FROM public.users WHERE email = 'operator1@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'sold', 32.0, 'ORD-2024-009', 'ORD-2024-009', (SELECT id FROM public.users WHERE email = 'stock@sttis.local')),
  ((SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'sold', 10.0, 'ORD-2024-010', 'ORD-2024-010', (SELECT id FROM public.users WHERE email = 'stock@sttis.local'));

-- ============ 6. INSERT STOCK ALERTS (Low Stock Notifications) ============
INSERT INTO public.stock_alerts (product_id, alert_type, threshold_value, current_value, is_resolved, resolved_at) VALUES
  ((SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'low_stock', 5.0, 8.8, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'low_stock', 20.0, 24.75, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'critical_stock', 18.0, 33.5, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'low_stock', 14.0, 16.0, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'approaching_expiry', 0.0, 0.0, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'low_stock', 12.0, 15.5, TRUE, '2024-05-15 10:30:00'),
  ((SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'low_stock', 15.0, 22.0, FALSE, NULL),
  ((SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'low_stock', 16.0, 18.0, FALSE, NULL);

-- ============ 7. INSERT QUALITY CHECKS (Comprehensive Quality Control) ============
INSERT INTO public.quality_checks (batch_id, check_date, appearance_score, aroma_score, taste_score, color_score, overall_score, notes, checked_by) VALUES
  -- Dragon Well checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), '2024-04-22', 94.0, 91.0, 92.0, 93.0, 92.5, 'Excellent chestnut aroma and bright color', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-002'), '2024-04-24', 90.0, 87.0, 89.0, 87.0, 88.5, 'Good overall, slight variation in oxidation', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Sencha checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SEN-001'), '2024-03-27', 95.0, 94.0, 94.0, 93.0, 94.0, 'Outstanding umami notes, premium quality', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SEN-002'), '2024-03-29', 92.0, 89.0, 90.0, 91.0, 91.0, 'Consistent quality batch', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Jasmine checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-JAS-001'), '2024-03-07', 90.0, 89.0, 88.0, 89.0, 89.0, 'Delicate jasmine aroma, well-balanced', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-JAS-002'), '2024-03-12', 87.0, 85.0, 86.0, 87.0, 86.5, 'Good quality, slightly less fragrant', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Matcha checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-MAT-001'), '2024-05-12', 97.0, 96.5, 97.0, 96.0, 96.5, 'Exceptional matcha, perfect powder consistency', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Assam checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-ASS-001'), '2024-03-17', 92.0, 90.0, 91.0, 89.0, 90.5, 'Strong malty profile, excellent body', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-ASS-002'), '2024-03-22', 89.0, 86.5, 88.0, 87.0, 87.5, 'Good quality black tea, standard profile', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Darjeeling checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DAR-001'), '2024-04-01', 96.0, 95.0, 96.0, 95.0, 95.5, 'Exceptional first flush quality, muscatel notes', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DAR-002'), '2024-04-07', 93.0, 92.0, 93.0, 92.0, 93.0, 'Premium first flush, excellent clarity', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Tie Guan Yin checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-TGY-001'), '2024-04-17', 95.0, 95.0, 94.0, 94.0, 94.5, 'Outstanding orchid aroma, complex flavor', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-TGY-002'), '2024-04-22', 92.0, 91.0, 91.0, 91.0, 91.5, 'Excellent quality, consistent roasting', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  
  -- Silver Needle checks
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SN-001'), '2024-04-27', 97.5, 97.0, 97.0, 96.5, 97.0, 'Exceptional white tea, premium buds only', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local')),
  ((SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SN-002'), '2024-05-04', 96.0, 95.5, 95.0, 95.5, 95.5, 'Outstanding quality, natural sweetness', (SELECT id FROM public.users WHERE email = 'inspector@sttis.local'));

-- ============ 8. INSERT SALES ORDERS (Customer Orders - 45 Orders) ============
INSERT INTO public.sales_orders (order_number, product_id, customer_name, quantity_kg, unit_price_usd, total_usd, order_date, delivery_date, status) VALUES
  -- Dragon Well orders
  ('ORD-2024-001', (SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'Premium Tea Café', 25.0, 85.00, 2125.00, '2024-04-25', '2024-05-02', 'delivered'),
  ('ORD-2024-011', (SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'Luxury Hotels International', 15.0, 85.00, 1275.00, '2024-05-01', NULL, 'pending'),
  
  -- Sencha orders
  ('ORD-2024-002', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'Tokyo Tea House', 30.0, 95.00, 2850.00, '2024-04-18', '2024-04-28', 'delivered'),
  ('ORD-2024-005', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'Wellness Spa Resort', 15.75, 95.00, 1496.25, '2024-04-28', '2024-05-05', 'shipped'),
  ('ORD-2024-012', (SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'Fine Dining Company', 20.0, 95.00, 1900.00, '2024-05-02', NULL, 'pending'),
  
  -- Jasmine orders
  ('ORD-2024-003', (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'Aromatic Essences Ltd', 20.0, 72.00, 1440.00, '2024-03-15', '2024-03-22', 'delivered'),
  ('ORD-2024-013', (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'Boutique Tea Merchants', 10.0, 72.00, 720.00, '2024-04-30', NULL, 'pending'),
  
  -- Darjeeling orders
  ('ORD-2024-004', (SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'Gourmet Food Importer', 40.0, 98.00, 3920.00, '2024-04-08', '2024-04-15', 'delivered'),
  ('ORD-2024-014', (SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'Premium Tea Association', 25.0, 98.00, 2450.00, '2024-05-03', NULL, 'pending'),
  
  -- Matcha orders
  ('ORD-2024-007', (SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'Ceremonial Tea House', 12.2, 120.00, 1464.00, '2024-05-12', '2024-05-19', 'shipped'),
  ('ORD-2024-015', (SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'Zen Wellness Center', 8.0, 120.00, 960.00, '2024-05-05', NULL, 'confirmed'),
  
  -- Assam orders
  ('ORD-2024-006', (SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'Breakfast Tea Suppliers', 28.0, 65.00, 1820.00, '2024-03-20', '2024-03-28', 'delivered'),
  ('ORD-2024-016', (SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'Hotel Chain Group', 20.0, 65.00, 1300.00, '2024-05-01', NULL, 'pending'),
  
  -- Tie Guan Yin orders
  ('ORD-2024-008', (SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'Premium Oolong Importers', 35.0, 105.00, 3675.00, '2024-04-20', '2024-04-27', 'delivered'),
  ('ORD-2024-017', (SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'Specialty Tea Shops', 18.0, 105.00, 1890.00, '2024-05-04', NULL, 'confirmed'),
  
  -- Silver Needle orders
  ('ORD-2024-009', (SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'Luxury Tea Boutique', 32.0, 125.00, 4000.00, '2024-04-28', '2024-05-05', 'delivered'),
  ('ORD-2024-010', (SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'Premium Gift Company', 10.0, 125.00, 1250.00, '2024-05-02', '2024-05-09', 'shipped'),
  ('ORD-2024-018', (SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'Wedding Event Planner', 15.0, 125.00, 1875.00, '2024-05-06', NULL, 'confirmed'),
  
  -- Additional product orders
  ('ORD-2024-019', (SELECT id FROM public.tea_products WHERE name = 'Keemun Elegance'), 'Wine Bar & Tea House', 22.0, 88.00, 1936.00, '2024-04-10', '2024-04-18', 'delivered'),
  ('ORD-2024-020', (SELECT id FROM public.tea_products WHERE name = 'Keemun Elegance'), 'Gourmet Retailer', 18.0, 88.00, 1584.00, '2024-05-01', NULL, 'pending'),
  ('ORD-2024-021', (SELECT id FROM public.tea_products WHERE name = 'Ceylon Highland'), 'Trading Company', 25.0, 72.00, 1800.00, '2024-04-15', '2024-04-22', 'delivered'),
  ('ORD-2024-022', (SELECT id FROM public.tea_products WHERE name = 'Ceylon Highland'), 'Export Distributor', 20.0, 72.00, 1440.00, '2024-05-02', NULL, 'pending'),
  ('ORD-2024-023', (SELECT id FROM public.tea_products WHERE name = 'Da Hong Pao'), 'Collector Tea House', 30.0, 120.00, 3600.00, '2024-04-05', '2024-04-12', 'delivered'),
  ('ORD-2024-024', (SELECT id FROM public.tea_products WHERE name = 'Da Hong Pao'), 'Luxury Hotel Chain', 18.0, 120.00, 2160.00, '2024-05-03', NULL, 'confirmed'),
  ('ORD-2024-025', (SELECT id FROM public.tea_products WHERE name = 'Lapsang Souchong'), 'Specialty Smoke Tea Supplier', 16.0, 82.00, 1312.00, '2024-04-20', '2024-04-27', 'delivered'),
  ('ORD-2024-026', (SELECT id FROM public.tea_products WHERE name = 'Lapsang Souchong'), 'Restaurant Group', 12.0, 82.00, 984.00, '2024-05-04', NULL, 'pending'),
  ('ORD-2024-027', (SELECT id FROM public.tea_products WHERE name = 'White Peony'), 'White Tea Specialist', 28.0, 105.00, 2940.00, '2024-04-22', '2024-04-29', 'delivered'),
  ('ORD-2024-028', (SELECT id FROM public.tea_products WHERE name = 'White Peony'), 'Spa & Wellness', 15.0, 105.00, 1575.00, '2024-05-05', NULL, 'confirmed'),
  ('ORD-2024-029', (SELECT id FROM public.tea_products WHERE name = 'Gyokuro Elite'), 'Premium Importer', 12.0, 110.00, 1320.00, '2024-04-18', '2024-04-25', 'delivered'),
  ('ORD-2024-030', (SELECT id FROM public.tea_products WHERE name = 'Ali Shan Oolong'), 'Taiwan Tea Distributor', 24.0, 95.00, 2280.00, '2024-04-25', '2024-05-02', 'delivered'),
  ('ORD-2024-031', (SELECT id FROM public.tea_products WHERE name = 'Moonlight White'), 'Night Market Vendor', 18.0, 110.00, 1980.00, '2024-04-28', NULL, 'pending'),
  ('ORD-2024-032', (SELECT id FROM public.tea_products WHERE name = 'Pouchong Tea'), 'Floral Tea House', 22.0, 85.00, 1870.00, '2024-05-01', NULL, 'confirmed'),
  ('ORD-2024-033', (SELECT id FROM public.tea_products WHERE name = 'Formosa Oolong'), 'Collector''s Item Retailer', 20.0, 92.00, 1840.00, '2024-04-20', '2024-04-27', 'delivered'),
  ('ORD-2024-034', (SELECT id FROM public.tea_products WHERE name = 'Genmaicha Blend'), 'Casual Café Chain', 16.0, 48.00, 768.00, '2024-04-15', '2024-04-20', 'delivered'),
  ('ORD-2024-035', (SELECT id FROM public.tea_products WHERE name = 'Yuzu Green Tea'), 'Citrus Tea Specialist', 14.0, 78.00, 1092.00, '2024-05-01', NULL, 'pending'),
  ('ORD-2024-036', (SELECT id FROM public.tea_products WHERE name = 'Earl Grey Premium'), 'Classic Tea Company', 26.0, 68.00, 1768.00, '2024-04-22', '2024-04-29', 'delivered'),
  ('ORD-2024-037', (SELECT id FROM public.tea_products WHERE name = 'Irish Breakfast Blend'), 'Morning Tea Supplier', 32.0, 58.00, 1856.00, '2024-04-28', NULL, 'pending'),
  ('ORD-2024-038', (SELECT id FROM public.tea_products WHERE name = 'Longjing Harvest'), 'Hangzhou Exporter', 21.0, 92.00, 1932.00, '2024-03-25', '2024-04-02', 'delivered'),
  ('ORD-2024-039', (SELECT id FROM public.tea_products WHERE name = 'Roasted Oolong'), 'Roasting Specialist', 18.0, 78.00, 1404.00, '2024-04-18', '2024-04-25', 'delivered'),
  ('ORD-2024-040', (SELECT id FROM public.tea_products WHERE name = 'Orchid Oolong Premium'), 'Premium Importer', 25.0, 115.00, 2875.00, '2024-05-01', NULL, 'confirmed'),
  ('ORD-2024-041', (SELECT id FROM public.tea_products WHERE name = 'Thai Oolong Gold'), 'Southeast Asia Distributor', 20.0, 88.00, 1760.00, '2024-04-20', '2024-04-27', 'delivered'),
  ('ORD-2024-042', (SELECT id FROM public.tea_products WHERE name = 'Royal White Tea'), 'Palace Tea House', 18.0, 115.00, 2070.00, '2024-04-25', '2024-05-02', 'shipped'),
  ('ORD-2024-043', (SELECT id FROM public.tea_products WHERE name = 'Cloud White'), 'Cloud Tea Distributor', 16.0, 98.00, 1568.00, '2024-04-22', NULL, 'pending'),
  ('ORD-2024-044', (SELECT id FROM public.tea_products WHERE name = 'White Mulberry Tea'), 'Mulberry Farm Café', 14.0, 82.00, 1148.00, '2024-03-30', '2024-04-06', 'delivered'),
  ('ORD-2024-045', (SELECT id FROM public.tea_products WHERE name = 'Junshan Silver Needle'), 'Rare Tea Collector', 12.0, 135.00, 1620.00, '2024-05-02', NULL, 'confirmed');

-- ============ 9. INSERT PREDICTIONS (AI/ML Forecasting) ============
INSERT INTO public.predictions (product_id, prediction_type, prediction_date, period, predicted_value, confidence_score, details) VALUES
  -- Sales forecasts
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'sales_forecast', '2024-05-15', 'May 2024', 85.0, 0.87, '{"trend": "increasing", "seasonal_factor": 1.05}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Dragon Well Premium'), 'sales_forecast', '2024-05-15', 'June 2024', 92.0, 0.84, '{"trend": "increasing", "seasonal_factor": 1.08}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'sales_forecast', '2024-05-15', 'May 2024', 78.0, 0.88, '{"trend": "steady", "seasonal_factor": 1.0}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Sencha Supreme'), 'sales_forecast', '2024-05-15', 'June 2024', 85.0, 0.85, '{"trend": "increasing", "seasonal_factor": 1.06}'),
  
  -- Stock optimization
  ((SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial'), 'stock_optimization', '2024-05-15', 'Q2 2024', 20.0, 0.82, '{"optimal_stock": 20, "reorder_point": 8}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls'), 'stock_optimization', '2024-05-15', 'Q2 2024', 35.0, 0.79, '{"optimal_stock": 35, "reorder_point": 12}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Assam Golden'), 'stock_optimization', '2024-05-15', 'Q2 2024', 30.0, 0.81, '{"optimal_stock": 30, "reorder_point": 15}'),
  
  -- Anomaly detection
  ((SELECT id FROM public.tea_products WHERE name = 'Darjeeling First Flush'), 'anomaly_detection', '2024-05-15', 'Recent', 0.05, 0.91, '{"anomaly_type": "unusual_quality_variance", "severity": "low"}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Tie Guan Yin'), 'anomaly_detection', '2024-05-15', 'Recent', 0.02, 0.94, '{"anomaly_type": "none_detected", "severity": "none"}'),
  
  -- Demand forecast
  ((SELECT id FROM public.tea_products WHERE name = 'Silver Needle'), 'demand_forecast', '2024-05-15', 'June 2024', 65.0, 0.83, '{"demand_trend": "high", "seasonality": "summer_peak"}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Da Hong Pao'), 'demand_forecast', '2024-05-15', 'June 2024', 58.0, 0.80, '{"demand_trend": "stable", "seasonality": "consistent"}'),
  ((SELECT id FROM public.tea_products WHERE name = 'Ceylon Highland'), 'demand_forecast', '2024-05-15', 'June 2024', 48.0, 0.78, '{"demand_trend": "increasing", "seasonality": "moderate"}');

-- ============ 10. INSERT CHAT MESSAGES (NLP Logs - 50 Messages) ============
INSERT INTO public.chat_messages (user_id, message_text, response_text, intent, entities) VALUES
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'What is the current stock level of Dragon Well Premium?', 'The current stock level of Dragon Well Premium is 425.50 kg.', 'query_stock_level', '{"product": "Dragon Well Premium", "type": "stock"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'Show me quality scores for May batches', 'Quality scores for May batches: Dragon Well batch 003 - 85.0, Matcha batch 002 - 94.0', 'query_quality_data', '{"month": "May", "type": "quality_scores"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'Alert me when Matcha Imperial goes below 10 kg', 'Alert created: Matcha Imperial will notify when stock falls below 10 kg.', 'set_alert', '{"product": "Matcha Imperial", "threshold": 10}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'What are the top selling products this month?', 'Top sellers: Silver Needle (42 kg), Darjeeling First Flush (40 kg), Tie Guan Yin (35 kg)', 'query_sales_data', '{"period": "month", "metric": "top_sellers"}'),
  ((SELECT id FROM public.users WHERE email = 'manager@sttis.local'), 'Generate sales report for Q1 2024', 'Q1 2024 Sales Report: Total Revenue: $45,230 | Units Sold: 425 kg | Growth: 12% YoY', 'generate_report', '{"period": "Q1 2024", "report_type": "sales"}'),
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'What are the production targets for June?', 'June Production Targets: Dragon Well (50 kg), Sencha (48 kg), Matcha (18 kg), Darjeeling (45 kg)', 'query_production_targets', '{"month": "June", "type": "targets"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'Which batches need quality review?', 'Batches pending quality review: TGY-002, DAR-002, SEN-003', 'query_pending_tasks', '{"task_type": "quality_review"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'Prepare shipment for order ORD-2024-001', 'Shipment prepared: 25 kg Dragon Well Premium for Premium Tea Café. Tracking: SHP-001', 'action_shipment', '{"order": "ORD-2024-001", "product": "Dragon Well Premium"}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'Compare quality scores between Darjeeling and Assam', 'Quality Comparison: Darjeeling (95.5) vs Assam (90.5). Darjeeling leads by 5 points.', 'compare_data', '{"type": "quality_scores", "products": ["Darjeeling", "Assam"]}'),
  ((SELECT id FROM public.users WHERE email = 'manager@sttis.local'), 'What is the profit margin on Matcha Imperial?', 'Matcha Imperial Profit Analysis: Unit Price: $120, Cost: ~$35, Margin: ~70.8%', 'query_financials', '{"product": "Matcha Imperial", "metric": "profit_margin"}'),
  ((SELECT id FROM public.users WHERE email = 'operator2@sttis.local'), 'Update batch BTH-2024-JAS-003 status to completed', 'Batch BTH-2024-JAS-003 status updated to completed. Quality score: 88.0', 'update_data', '{"batch": "BTH-2024-JAS-003", "status": "completed"}'),
  ((SELECT id FROM public.users WHERE email = 'inspector@sttis.local'), 'Schedule quality check for BTH-2024-MAT-002', 'Quality check scheduled for BTH-2024-MAT-002 on 2024-05-16 at 10:00 AM', 'schedule_task', '{"batch": "BTH-2024-MAT-002", "action": "quality_check"}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'Show me inventory alerts', 'Active Inventory Alerts: 8 total | 2 critical (Darjeeling, Matcha) | 6 low stock warnings', 'query_alerts', '{"type": "inventory_alerts"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'What is the reorder point for Dragon Well?', 'Reorder Point for Dragon Well Premium: 20 kg. Current level: 24.75 kg (above reorder)', 'query_inventory', '{"product": "Dragon Well Premium", "metric": "reorder_point"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'List all quality issues from last 30 days', 'Quality Issues (30 days): 2 batches with minor oxidation issues, 1 batch with slight humidity variance', 'query_issues', '{"period": "30_days", "type": "quality_issues"}');

-- Add more chat messages for realistic volume
INSERT INTO public.chat_messages (user_id, message_text, response_text, intent, entities) VALUES
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'Show dashboard summary', 'Dashboard Summary: 32 products | 26 active batches | 8 alerts | Avg Quality: 90.5%', 'dashboard_request', '{"type": "summary"}'),
  ((SELECT id FROM public.users WHERE email = 'manager@sttis.local'), 'Export sales data to CSV', 'Sales data export prepared. File: sales_export_2024-05.csv (45 orders, 425 kg sold)', 'export_data', '{"format": "csv", "data_type": "sales"}'),
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'When is the next Sencha batch scheduled?', 'Next Sencha Supreme batch scheduled: Production date 2024-05-20, Estimated completion 2024-05-28', 'query_schedule', '{"product": "Sencha Supreme"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'Which product has highest customer satisfaction?', 'Customer Satisfaction Leader: Darjeeling First Flush (9.5/10) based on 40 reviews', 'query_metrics', '{"metric": "satisfaction"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'Received shipment for new Jasmine batch', 'Shipment registered: 38 kg Jasmine Green Pearls received. Inventory updated. Batch: BTH-2024-JAS-003', 'log_receipt', '{"type": "shipment", "product": "Jasmine"}');

-- ============ 11. INSERT AUDIT LOGS (Comprehensive Activity Tracking - 50+ Entries) ============
INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values) VALUES
  -- User management audits
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'create_user', 'users', (SELECT id::text FROM public.users WHERE email = 'qa@sttis.local'), NULL, '{"email": "qa@sttis.local", "role": "qa_manager"}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'create_user', 'users', (SELECT id::text FROM public.users WHERE email = 'stock@sttis.local'), NULL, '{"email": "stock@sttis.local", "role": "stock_manager"}'),
  
  -- Product management audits
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'create_product', 'tea_products', (SELECT id::text FROM public.tea_products WHERE name = 'Dragon Well Premium'), NULL, '{"name": "Dragon Well Premium", "quantity_kg": 500}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'create_product', 'tea_products', (SELECT id::text FROM public.tea_products WHERE name = 'Sencha Supreme'), NULL, '{"name": "Sencha Supreme", "quantity_kg": 450}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'update_product', 'tea_products', (SELECT id::text FROM public.tea_products WHERE name = 'Dragon Well Premium'), '{"current_quantity_kg": 450}', '{"current_quantity_kg": 425.5}'),
  
  -- Batch creation audits
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'create_batch', 'batches', (SELECT id::text FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), NULL, '{"batch_number": "BTH-2024-DW-001", "quantity_kg": 50}'),
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'create_batch', 'batches', (SELECT id::text FROM public.batches WHERE batch_number = 'BTH-2024-SEN-001'), NULL, '{"batch_number": "BTH-2024-SEN-001", "quantity_kg": 48}'),
  ((SELECT id FROM public.users WHERE email = 'operator2@sttis.local'), 'create_batch', 'batches', (SELECT id::text FROM public.batches WHERE batch_number = 'BTH-2024-JAS-001'), NULL, '{"batch_number": "BTH-2024-JAS-001", "quantity_kg": 35}'),
  
  -- Batch status updates
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'update_batch', 'batches', (SELECT id::text FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), '{"status": "production"}', '{"status": "completed"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'update_batch', 'batches', (SELECT id::text FROM public.batches WHERE batch_number = 'BTH-2024-DW-001'), '{"quality_score": null}', '{"quality_score": 92.5}'),
  
  -- Quality check audits
  ((SELECT id FROM public.users WHERE email = 'inspector@sttis.local'), 'create_quality_check', 'quality_checks', (SELECT id::text FROM public.quality_checks WHERE batch_id = (SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001')), NULL, '{"overall_score": 92.5, "appearance_score": 94, "aroma_score": 91}'),
  ((SELECT id FROM public.users WHERE email = 'inspector@sttis.local'), 'create_quality_check', 'quality_checks', (SELECT id::text FROM public.quality_checks WHERE batch_id = (SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-SEN-001')), NULL, '{"overall_score": 94.0, "appearance_score": 95, "aroma_score": 94}'),
  
  -- Stock movement audits
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'record_movement', 'stock_movements', (SELECT id::text FROM public.stock_movements WHERE quantity_kg = 50.0 AND movement_type = 'produced' LIMIT 1), NULL, '{"movement_type": "produced", "quantity_kg": 50.0}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'record_movement', 'stock_movements', (SELECT id::text FROM public.stock_movements WHERE quantity_kg = 25.0 AND movement_type = 'sold' LIMIT 1), NULL, '{"movement_type": "sold", "quantity_kg": 25.0}'),
  
  -- Sales order audits
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'create_order', 'sales_orders', (SELECT id::text FROM public.sales_orders WHERE order_number = 'ORD-2024-001'), NULL, '{"order_number": "ORD-2024-001", "quantity_kg": 25, "status": "pending"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'update_order', 'sales_orders', (SELECT id::text FROM public.sales_orders WHERE order_number = 'ORD-2024-001'), '{"status": "pending"}', '{"status": "delivered"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'create_order', 'sales_orders', (SELECT id::text FROM public.sales_orders WHERE order_number = 'ORD-2024-002'), NULL, '{"order_number": "ORD-2024-002", "quantity_kg": 30}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'update_order', 'sales_orders', (SELECT id::text FROM public.sales_orders WHERE order_number = 'ORD-2024-002'), '{"status": "pending"}', '{"status": "delivered"}'),
  
  -- Alert audits
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'create_alert', 'stock_alerts', (SELECT id::text FROM public.stock_alerts WHERE product_id = (SELECT id FROM public.tea_products WHERE name = 'Matcha Imperial')), NULL, '{"alert_type": "low_stock", "threshold_value": 5, "current_value": 8.8}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'resolve_alert', 'stock_alerts', (SELECT id::text FROM public.stock_alerts WHERE product_id = (SELECT id FROM public.tea_products WHERE name = 'Jasmine Green Pearls') LIMIT 1), '{"is_resolved": false}', '{"is_resolved": true}'),
  
  -- Batch history audits
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'record_event', 'batch_history', (SELECT id::text FROM public.batch_history WHERE batch_id = (SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001') LIMIT 1), NULL, '{"event_type": "production_started"}'),
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'record_event', 'batch_history', (SELECT id::text FROM public.batch_history WHERE batch_id = (SELECT id FROM public.batches WHERE batch_number = 'BTH-2024-DW-001') LIMIT 1), NULL, '{"event_type": "batch_completed"}'),
  
  -- Additional audit entries for comprehensive logging
  ((SELECT id FROM public.users WHERE email = 'admin@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 08:00:00"}'),
  ((SELECT id FROM public.users WHERE email = 'qa@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 08:30:00"}'),
  ((SELECT id FROM public.users WHERE email = 'stock@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 09:00:00"}'),
  ((SELECT id FROM public.users WHERE email = 'operator1@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 07:30:00"}'),
  ((SELECT id FROM public.users WHERE email = 'operator2@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 07:45:00"}'),
  ((SELECT id FROM public.users WHERE email = 'inspector@sttis.local'), 'login', 'users', NULL, NULL, '{"timestamp": "2024-05-15 10:00:00"}');

-- ============ VERIFICATION COUNTS ============
-- Run these queries to verify data was inserted correctly
-- SELECT COUNT(*) as users_count FROM public.users;
-- SELECT COUNT(*) as products_count FROM public.tea_products;
-- SELECT COUNT(*) as batches_count FROM public.batches;
-- SELECT COUNT(*) as batch_history_count FROM public.batch_history;
-- SELECT COUNT(*) as stock_movements_count FROM public.stock_movements;
-- SELECT COUNT(*) as stock_alerts_count FROM public.stock_alerts;
-- SELECT COUNT(*) as quality_checks_count FROM public.quality_checks;
-- SELECT COUNT(*) as sales_orders_count FROM public.sales_orders;
-- SELECT COUNT(*) as predictions_count FROM public.predictions;
-- SELECT COUNT(*) as chat_messages_count FROM public.chat_messages;
-- SELECT COUNT(*) as audit_logs_count FROM public.audit_logs;

COMMIT;
