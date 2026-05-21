# STTIS - Smart Tea Traceability & Intelligence System

An enterprise-grade supply chain management solution for tea producers with AI-powered insights, real-time traceability, and intelligent inventory optimization.

## Features

### 🌿 Core Features
- **Complete Traceability**: QR code-based batch tracking from production to delivery
- **Real-time Analytics**: Dashboard with sales, stock, and production metrics
- **Role-Based Access Control**: Admin, Quality Managers, Stock Managers with audit logs
- **Comprehensive Audit Trail**: Full history of all operations and changes

### 🤖 AI/ML Capabilities
- **Sales Forecasting**: 12-month predictions using advanced ML models
- **Stock Optimization**: Intelligent inventory thresholds and reorder point calculations
- **Anomaly Detection**: Real-time quality monitoring and issue detection
- **NLP Chat Assistant**: Natural language interface for supply chain queries

### 📊 Dashboard
- Interactive charts and metrics
- Real-time stock alerts
- Production quality assessments
- Sales trend analysis

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: shadcn/ui + Tailwind CSS v4
- **Charts**: Recharts
- **Styling**: Green theme (emerald, sage, tea green)
- **State Management**: React hooks + Supabase client

### Backend
- **API**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL)
- **ML/AI**: scikit-learn, transformers, pandas
- **ORM**: Supabase JS client (frontend), SQL (backend)

### Authentication
- Supabase Auth with JWT
- Role-based Row Level Security (RLS)
- Secure session management

## Project Structure

```
/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Sign up page
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Main dashboard
│   │   ├── products/page.tsx   # Product management
│   │   ├── batches/page.tsx    # Batch tracking
│   │   ├── stock/page.tsx      # Stock management
│   │   ├── insights/page.tsx   # AI insights & forecasts
│   │   ├── chat/page.tsx       # NLP chat assistant
│   │   └── settings/page.tsx   # User settings
│   ├── globals.css             # Green theme
│   └── layout.tsx              # Root layout
├── lib/
│   ├── supabase.ts            # Supabase client & types
│   ├── auth.ts                # Auth utilities
│   └── init-db.ts             # Database initialization
├── backend/
│   ├── main.py                # FastAPI app
│   ├── ml_models.py           # ML models (forecasting, optimization)
│   ├── nlp_models.py          # NLP models (intent, entities)
│   └── pyproject.toml         # Python dependencies
└── scripts/
    └── 01-init-schema.sql     # Database schema
```

## Setup Instructions

### 1. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Database Setup

The database schema is defined in `scripts/01-init-schema.sql`. Execute this in your Supabase SQL editor to create:
- Users table with role-based access
- Products table (tea varieties)
- Batches table (production lots with QR codes)
- Stock levels table with threshold management
- Stock movements for audit trails
- Sales records
- AI predictions table
- Anomalies detection table
- Chat messages for NLP training
- Audit logs for compliance

### 3. Install Frontend Dependencies

```bash
npm install
# or
pnpm install
```

### 4. Install Backend Dependencies

```bash
cd backend
pip install -e .
# or
uv sync
```

### 5. Run Frontend

```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000

### 6. Run Backend

```bash
cd backend
python main.py
# or
uvicorn main:app --reload
```

Backend API runs on http://localhost:8000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout

### Products
- `GET /dashboard/products` - List all products
- `POST /dashboard/products` - Create product
- `PUT /dashboard/products/:id` - Update product
- `DELETE /dashboard/products/:id` - Delete product

### Batches & Traceability
- `GET /dashboard/batches` - List batches
- `POST /dashboard/batches` - Create batch
- `GET /api/traceability/batch/:id` - Get full batch history

### Stock Management
- `GET /dashboard/stock` - View stock levels
- `POST /api/stock/optimize` - Get optimization recommendations
- `GET /api/stock/alerts` - Get stock alerts

### AI/ML Services (FastAPI Backend)
- `POST /api/forecast/sales` - Generate sales forecast
- `POST /api/forecast/demand` - Short-term demand forecast
- `POST /api/stock/optimize` - Stock optimization
- `POST /api/anomalies/detect` - Detect batch anomalies
- `GET /api/anomalies/active` - Get active anomalies
- `POST /api/nlp/query` - Process natural language query
- `POST /api/nlp/intent-detection` - Detect query intent
- `POST /api/nlp/entity-extraction` - Extract entities from query
- `GET /api/recommendations` - Get personalized recommendations

## User Roles

### Admin
- Full system access
- User management
- System configuration
- Access to all audit logs

### Quality Manager (Responsable Qualité)
- Create and manage batches
- Assess quality scores
- View traceability data
- Quality reports

### Stock Manager (Responsable Stocks)
- Manage inventory levels
- Set thresholds and alerts
- View stock movements
- Stock reports

## Green Theme Colors

- **Primary (Emerald)**: #10b981 - Main actions, navigation
- **Secondary (Sage)**: #6b8e6f - Secondary elements
- **Accent (Tea Green)**: #5cb85c - Highlights, special features
- **Muted**: #d4e5d4 - Light backgrounds, disabled states

## Database Schema Highlights

### Key Tables

1. **users** - Extended Supabase auth with roles
2. **products** - Tea varieties with metadata
3. **batches** - Production lots with QR codes
4. **batch_details** - Production metrics (temperature, humidity)
5. **stock_levels** - Current inventory with thresholds
6. **stock_movements** - Audit trail for all stock changes
7. **sales** - Sales records linked to batches
8. **ai_predictions** - Forecast results
9. **anomalies** - Detected quality/production issues
10. **chat_messages** - NLP training data
11. **audit_logs** - Complete action history

### Row Level Security (RLS)
- Users can only see their own profile
- Admins can view all users
- Stock/Quality data filtered by role
- Audit logs restricted to admins

## AI/ML Models

### Sales Forecasting
- Linear regression + seasonal adjustments
- 12-month horizon
- Confidence score calculation
- Recommendation generation

### Stock Optimization
- EOQ-inspired approach
- Safety stock calculation
- Reorder point determination
- Dynamic threshold adjustment

### Anomaly Detection
- Isolation Forest algorithm
- Multi-feature analysis (temperature, humidity, time)
- Severity classification
- Historical pattern learning

### Quality Prediction
- Temperature/humidity assessment
- Processing time evaluation
- Origin quality factoring
- 0-10 quality score

### NLP Chat
- Intent classification (product, batch, stock, quality, forecast)
- Entity extraction (products, batches, quantities, dates)
- Context-aware responses
- Query understanding

## Development

### Running Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
npm start
```

### Backend Development

```bash
cd backend
python main.py --reload
```

## Deployment

### Vercel (Frontend)

```bash
vercel deploy
```

### FastAPI Backend Deployment Options

1. **Railway.app**
   ```bash
   railway up
   ```

2. **Render.com**
   ```bash
   Connect GitHub repo
   ```

3. **AWS Lambda** (with serverless framework)
4. **Google Cloud Run**
5. **Heroku**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Proprietary - STTIS Technology

## Support

For issues and feature requests, contact: support@sttis.io

## Roadmap

- [ ] Advanced ML models (Prophet, LSTM for time series)
- [ ] Real-time notifications and alerts
- [ ] Mobile app (React Native)
- [ ] Batch traceability QR code printing
- [ ] Integration with payment systems
- [ ] Multi-language support
- [ ] Advanced reporting (PDF exports)
- [ ] Supplier management module
- [ ] Customer portal
- [ ] API rate limiting and usage analytics

---

Built with ❤️ for sustainable tea supply chains
