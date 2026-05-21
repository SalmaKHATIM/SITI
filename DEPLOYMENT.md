# STTIS Deployment Guide

Complete guide for deploying STTIS (Smart Tea Traceability & Intelligence System) to production.

## Architecture Overview

STTIS is a full-stack application with:
- **Frontend**: Next.js 16 on Vercel
- **Backend**: FastAPI (Python) on Railway, Render, or AWS
- **Database**: Supabase (managed PostgreSQL)
- **Storage**: Vercel Blob (optional, for file storage)

## Prerequisites

- GitHub account with repository access
- Vercel account
- Supabase project
- Python 3.10+
- Node.js 18+

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 1.2 Run Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Execute the SQL from `scripts/01-init-schema.sql`
3. Verify tables are created

### 1.3 Enable Row Level Security

All tables already have RLS enabled in the schema. Verify in Supabase dashboard:
- Authentication > Policies
- Confirm all tables have RLS enabled

## Step 2: Frontend Deployment (Vercel)

### 2.1 Push Code to GitHub

```bash
git add .
git commit -m "Initial STTIS deployment"
git push origin main
```

### 2.2 Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXT_PUBLIC_STTIS_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

5. Click Deploy

### 2.3 Configure Custom Domain (Optional)

1. In Vercel project settings
2. Go to Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Step 3: Backend Deployment (FastAPI)

### Option A: Railway.app (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Configure environment variables:

```env
FASTAPI_PORT=8000
DATABASE_URL=postgresql://user:password@localhost/sttis
ML_FORECAST_CONFIDENCE_THRESHOLD=0.7
ML_ANOMALY_SENSITIVITY=0.1
NLP_MODEL=huggingface-transformers
```

5. Deploy

### Option B: Render.com

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub
4. Configure:
   - Build command: `cd backend && pip install -r requirements.txt`
   - Start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as above)
6. Deploy

### Option C: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. Install dependencies:

```bash
sudo apt update
sudo apt install python3.10 python3-pip nginx
sudo pip install -r backend/requirements.txt
```

3. Configure Nginx as reverse proxy
4. Use systemd to manage FastAPI service

### Option D: Google Cloud Run

```bash
gcloud run deploy sttis-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FASTAPI_PORT=8000
```

## Step 4: Update Environment Variables

### Frontend (.env.local on Vercel)

Update `NEXT_PUBLIC_API_URL` to point to your deployed backend:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## Step 5: Database Migrations

If you need to modify the schema in production:

1. Create a new SQL file in `scripts/`
2. Run it in Supabase SQL Editor
3. Test thoroughly before deploying code changes

## Step 6: Monitoring & Logs

### Vercel Logs

```bash
vercel logs <project-name>
```

### Backend Logs

- **Railway**: Check Build Logs and Runtime Logs tabs
- **Render**: Check Logs tab
- **AWS**: CloudWatch Logs

### Database Logs

Supabase Dashboard > Logs > Database

## Step 7: Security Checklist

- [ ] Supabase RLS policies are configured
- [ ] JWT secrets are strong
- [ ] API rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Environment variables are not exposed
- [ ] SSL/HTTPS is enabled
- [ ] Backups are configured

## Step 8: Performance Optimization

### Frontend
- Enable Image Optimization in Next.js
- Use dynamic imports for large components
- Implement incremental static regeneration (ISR)

### Backend
- Enable caching for ML models
- Use connection pooling for database
- Implement request caching with Redis (optional)

## Monitoring Setup

### Recommended Tools

1. **Error Tracking**: Sentry
   - Add SENTRY_DSN to environment

2. **Analytics**: Vercel Analytics
   - Built-in with Vercel

3. **Database**: Supabase Monitoring
   - Check Query Performance
   - Monitor storage usage

4. **Backend**: New Relic or Datadog

## Scaling Considerations

1. **Database**: 
   - Enable Read Replicas for scaling reads
   - Optimize indexes for common queries
   - Consider Supabase Postgres Pro for higher connections

2. **Backend**:
   - Implement request queuing
   - Use async workers for long-running tasks
   - Cache ML model predictions

3. **Frontend**:
   - Edge caching with Vercel
   - CDN for static assets

## Troubleshooting

### API Connection Issues

1. Check CORS configuration in FastAPI
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Check Network tab in browser DevTools

### Database Connection Issues

1. Verify Supabase URL and keys
2. Check firewall rules
3. Test with Supabase Studio

### Deployment Failures

1. Check build logs in Vercel/Railway
2. Verify all environment variables are set
3. Test locally before deploying

## Rollback Procedure

### Frontend
```bash
vercel rollback
```

### Backend
- Railway: Use deployment history
- Render: Use deployment list

## Database Backup

Supabase automatically backs up data. To manually backup:

1. Go to Supabase Dashboard
2. Settings > Database
3. Click "Backup" button
4. Download backup file

## Support & Maintenance

### Regular Tasks
- Monitor performance metrics weekly
- Review error logs daily
- Update dependencies monthly
- Test disaster recovery quarterly

### Contact
For deployment issues: deployment@sttis.io

---

**Last Updated**: 2024
**Version**: 1.0
