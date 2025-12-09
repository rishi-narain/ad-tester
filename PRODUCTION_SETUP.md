# Production Setup Guide for Testbed.AI

## Overview
Currently, the application uses **in-memory storage** which means:
- ❌ Data is lost when the server restarts
- ❌ Data doesn't persist across deployments
- ❌ Not suitable for production

To publish and have real-time analytics, you need to:

## 1. Choose a Database

### Option A: Vercel Postgres (Recommended - Easiest)
- **Why**: Seamless integration with Vercel deployment
- **Setup**: Built into Vercel dashboard
- **Cost**: Free tier available

### Option B: Supabase (PostgreSQL)
- **Why**: Great free tier, real-time features
- **Setup**: Create account at supabase.com
- **Cost**: Free tier: 500MB database

### Option C: MongoDB Atlas
- **Why**: NoSQL, flexible schema
- **Setup**: Create account at mongodb.com/cloud/atlas
- **Cost**: Free tier: 512MB storage

### Option D: PlanetScale (MySQL)
- **Why**: Serverless MySQL, great for Next.js
- **Setup**: Create account at planetscale.com
- **Cost**: Free tier available

## 2. Database Schema Needed

You'll need these tables/collections:

### Evaluations Table
```sql
CREATE TABLE evaluations (
  id VARCHAR(255) PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL,
  persona_id VARCHAR(255) NOT NULL,
  persona_name VARCHAR(255) NOT NULL,
  resonance_score INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  reverse_mode BOOLEAN NOT NULL,
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_evaluations_timestamp ON evaluations(timestamp);
CREATE INDEX idx_evaluations_persona_id ON evaluations(persona_id);
CREATE INDEX idx_evaluations_user_id ON evaluations(user_id);
```

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  first_seen TIMESTAMP NOT NULL,
  last_active TIMESTAMP NOT NULL,
  total_evaluations INTEGER DEFAULT 0,
  ip_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_last_active ON users(last_active);
```

### Feedback Table
```sql
CREATE TABLE feedback (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'thumbs' or 'written'
  timestamp TIMESTAMP NOT NULL,
  page VARCHAR(50) NOT NULL, -- 'results' or 'insights'
  category VARCHAR(255),
  item TEXT,
  vote VARCHAR(10), -- 'up' or 'down'
  feedback_text TEXT,
  email VARCHAR(255),
  evaluation_id VARCHAR(255),
  persona_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_feedback_timestamp ON feedback(timestamp);
CREATE INDEX idx_feedback_type ON feedback(type);
```

### Personas Table (if you want to store custom personas)
```sql
CREATE TABLE personas (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Environment Variables

Create a `.env.local` file (and add to `.env` for production):

```env
# Database
DATABASE_URL="your-database-connection-string"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Admin Authentication (optional but recommended)
ADMIN_TOKEN="your-secure-admin-token"

# App URL (for production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## 4. Install Database Client

### For PostgreSQL (Vercel Postgres/Supabase):
```bash
npm install @vercel/postgres
# OR
npm install postgres
# OR
npm install @supabase/supabase-js
```

### For MongoDB:
```bash
npm install mongodb
```

## 5. Update Code to Use Database

You'll need to replace these files:
- `lib/analytics-store.ts` → Connect to database
- `lib/personas-store.ts` → Connect to database  
- `app/api/feedback/route.ts` → Connect to database

## 6. Deployment Options

### Option A: Vercel (Recommended for Next.js)
1. Push code to GitHub
2. Go to vercel.com
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Connect Vercel Postgres (or your database)
6. Deploy!

**Benefits:**
- Automatic deployments on git push
- Built-in analytics
- Easy database integration
- Free tier available

### Option B: Netlify
1. Push code to GitHub
2. Go to netlify.com
3. Import repository
4. Add environment variables
5. Connect database (Supabase recommended)
6. Deploy!

### Option C: Self-hosted (VPS)
- Requires: VPS (DigitalOcean, AWS, etc.)
- Setup: Docker, Nginx, PM2
- More complex but full control

## 7. Admin Authentication

Currently, admin routes allow access in development mode. For production:

1. **Implement proper authentication:**
   - JWT tokens
   - Session-based auth
   - OAuth (Google, GitHub)

2. **Update `lib/admin-auth.ts`:**
   - Remove development mode bypass
   - Add real authentication checks

## 8. Security Checklist

- [ ] Set `ADMIN_TOKEN` environment variable
- [ ] Remove development mode bypasses
- [ ] Add rate limiting to API routes
- [ ] Validate all user inputs
- [ ] Use HTTPS (automatic on Vercel/Netlify)
- [ ] Set up CORS properly
- [ ] Add error logging (Sentry, LogRocket, etc.)

## 9. Monitoring & Analytics

Consider adding:
- **Error tracking**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Database monitoring**: Database provider dashboard

## 10. Quick Start with Vercel + Vercel Postgres

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add Vercel Postgres:**
   - Go to Vercel dashboard
   - Your project → Storage → Create Database → Postgres
   - Copy the connection string

3. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add `DATABASE_URL`
   - Add `OPENAI_API_KEY`
   - Add `ADMIN_TOKEN`

4. **Update code to use `@vercel/postgres`**

## Next Steps

Would you like me to:
1. Set up database integration code for a specific database?
2. Create migration scripts?
3. Update the analytics store to use a database?
4. Set up proper authentication?

Let me know which database you prefer and I can help implement it!

