# STTIS - Complete Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create `.env.local` file in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get these from Supabase Dashboard → Settings → API

### Step 3: Initialize Database
1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Create new query
4. Copy entire content from `DATABASE_SCHEMA.sql`
5. Click "Run"

### Step 4: Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sttis.local | Admin@123456 |
| Quality Manager | qa@sttis.local | QA@123456 |
| Stock Manager | stock@sttis.local | Stock@123456 |

---

## Features

✓ Complete tea product management
✓ Batch traceability with QR codes
✓ Real-time stock management
✓ AI-powered sales forecasting
✓ Anomaly detection
✓ NLP chat assistant
✓ Role-based access control
✓ Comprehensive audit logs

---

## Database Tables

- users
- tea_products
- batches
- batch_history
- stock_movements
- stock_alerts
- quality_checks
- sales_orders
- ai_predictions
- chat_messages
- audit_logs

---

## Support

For issues or questions, refer to:
- `SUPABASE_SETUP.md` - Detailed Supabase setup
- `DATABASE_SCRIPT_USAGE.md` - Database script guide
- `CONFIGURATION_RAPIDE.txt` - Quick configuration

