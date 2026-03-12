# VoiceBuild - Deployment & Setup Guide

## 🎯 Quick Overview

VoiceBuild is now **production-ready** with:
- ✅ Visual agent builder with workflow editor
- ✅ Runtime engine for workflow execution
- ✅ Stripe billing integration
- ✅ API integrations system
- ✅ Embeddable chat widget
- ✅ Enterprise security (RLS)
- ✅ Performance optimizations
- ✅ Modern landing page

**Repository**: https://github.com/sandy191020/voiceflow_c

---

## 📋 Step-by-Step Deployment

### 1️⃣ **Clone & Setup Local Environment**

```bash
# Clone repository
git clone https://github.com/sandy191020/voiceflow_c.git
cd voicebuild

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2️⃣ **Configure Supabase**

```bash
# Visit https://supabase.com and create new project

# In .env.local, set:
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyxxxxx...
SUPABASE_SERVICE_ROLE=eyxxxxx...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxx...
```

### 3️⃣ **Apply Database Migrations**

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref xxxxx

# Push migrations
supabase db push
```

**What this does**:
- Creates 16 tables (agents, conversations, knowledge, etc.)
- Sets up Row Level Security policies
- Creates vector search function for embeddings

### 4️⃣ **Create Storage Bucket**

In Supabase Dashboard:
1. Go to **Storage** → **New Bucket**
2. Name: `documents`
3. Make it **Private**
4. Save

### 5️⃣ **Configure OpenRouter API**

```bash
# Visit https://openrouter.ai and create account

# In .env.local, set:
OPENROUTER_API_KEY=sk-or-xxxxx...
```

**Supported Models** (from agentRunner):
- `openai/gpt-4o-mini` (default)
- `anthropic/claude-3.5-sonnet`
- `meta-llama/llama-3.1-70b`

### 6️⃣ **Setup Stripe (Optional, for Billing)**

```bash
# Visit https://stripe.com and create account

# Get your keys from Stripe Dashboard
# Settings → API Keys

# In .env.local, set:
STRIPE_SECRET_KEY=sk_test_xxxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxxx...

# Create prices in Stripe Dashboard:
# Product: VoiceBuild Credits
# Prices:
#   - Starter: $0 (or skip, free tier)
#   - Pro: $60/month
#   - Business: $150/month

# Set price IDs:
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_BUSINESS=price_xxxxx
```

**Webhook Setup**:
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### 7️⃣ **Test Locally**

```bash
# Start development server
npm run dev

# Open http://localhost:3000

# Test workflow:
# 1. Click "Get Started" → Sign up
# 2. Create new agent
# 3. Build workflow (add Message + AI nodes)
# 4. Click "Save" in builder
# 5. Go to "Test" tab and chat
```

### 8️⃣ **Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel deploy

# For production
vercel deploy --prod
```

**Add Environment Variables in Vercel Dashboard**:
1. Go to **Settings** → **Environment Variables**
2. Add all variables from `.env.local`:
   - OPENROUTER_API_KEY
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - etc.

### 9️⃣ **Update Stripe Webhook URL**

After deployment, update webhook in Stripe:
1. Stripe Dashboard → **Webhooks**
2. Update endpoint to: `https://yourdomain.vercel.app/api/billing/webhook`

### 🔟 **Verify Deployment**

```bash
# Test endpoints
curl https://yourdomain.vercel.app/api/agents

# Should return empty array or error if not authenticated
# (This is expected - RLS policies prevent unauthorized access)
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENROUTER_API_KEY` | ✅ | LLM model access |
| `SUPABASE_URL` | ✅ | Database URL |
| `SUPABASE_ANON_KEY` | ✅ | Client API key |
| `SUPABASE_SERVICE_ROLE` | ✅ | Server-side operations |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Public Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public API key |
| `STRIPE_SECRET_KEY` | ❌ | Stripe billing |
| `STRIPE_WEBHOOK_SECRET` | ❌ | Stripe webhooks |
| `STRIPE_PRICE_STARTER` | ❌ | Starter plan price ID |
| `STRIPE_PRICE_PRO` | ❌ | Pro plan price ID |
| `STRIPE_PRICE_BUSINESS` | ❌ | Business plan price ID |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ | (Set to production URL) |

---

## 🧪 Testing Checklist

### Auth Flow
- [ ] Sign up with email
- [ ] Receive verification email
- [ ] Login with credentials
- [ ] Logout
- [ ] Protected routes redirect to login

### Agent Building
- [ ] Create new agent
- [ ] Add Start node
- [ ] Add Message node
- [ ] Add AI node
- [ ] Connect nodes
- [ ] Save workflow
- [ ] Load saved workflow

### Chat & Execution
- [ ] Send message to agent
- [ ] See AI response
- [ ] Check execution logs
- [ ] Verify credits deducted

### Integrations
- [ ] Create API integration
- [ ] Test API call from workflow
- [ ] View API call logs

### Billing (if Stripe configured)
- [ ] Navigate to Billing page
- [ ] See current plan
- [ ] Click "Upgrade" → Redirect to Stripe
- [ ] Complete test payment
- [ ] Verify subscription created
- [ ] Check credits updated

### Widget
- [ ] Copy embed code
- [ ] Test on another website
- [ ] Chat with agent via widget
- [ ] See messages persist

### Security
- [ ] Login with different user
- [ ] Verify can't access other user's agents
- [ ] Verify RLS blocks unauthorized DB access

---

## 🐛 Troubleshooting

### Build Errors

**"Stripe not configured"**
- Solution: Set `STRIPE_SECRET_KEY` or leave blank for development

**"Supabase URL is required"**
- Solution: Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set

**"Module not found"**
- Solution: Run `npm install`

### Runtime Errors

**"No workflow defined"**
- Solution: Create nodes in builder and save before testing

**"Insufficient credits"**
- Solution: Upgrade plan or wait for new billing cycle

**"Knowledge search failed"**
- Solution: Upload documents first, wait for embeddings to generate

### API Issues

**Widget not loading**
- Solution: Check CORS headers, verify `NEXT_PUBLIC_BASE_URL`

**Stripe webhook not triggering**
- Solution: Verify webhook URL in Stripe dashboard, check logs

---

## 📊 Monitoring

### View Application Logs
```bash
# Vercel logs
vercel logs

# Real-time logs
vercel logs --follow
```

### Monitor Database
```bash
# Supabase dashboard
# Explore → Tables → View data and queries
```

### Check API Performance
```bash
# Vercel Analytics
# https://vercel.com/your-team/voicebuild
```

---

## 🔐 Security Checklist

- [ ] All environment variables are secrets (not in code)
- [ ] Database RLS policies are enabled
- [ ] Stripe webhook secret is verified
- [ ] CORS is configured for widget domain
- [ ] Authentication is required for protected routes
- [ ] Rate limiting is active
- [ ] Credit validation prevents abuse

---

## 🚀 Production Recommendations

### Performance
1. Enable Vercel Edge Caching
2. Configure CDN for static assets
3. Set up Database connection pooling
4. Monitor API response times

### Scalability
1. Set up auto-scaling for serverless functions
2. Configure database read replicas
3. Implement API rate limiting per user tier
4. Cache frequently accessed data

### Reliability
1. Enable error tracking (Sentry)
2. Set up uptime monitoring
3. Configure automated backups
4. Create disaster recovery plan

### Monitoring
1. Enable detailed logging
2. Set up alerts for errors
3. Monitor credit system health
4. Track billing transactions

---

## 📞 Support

- **Documentation**: See README.md
- **API Docs**: Inline TypeScript comments
- **Issues**: https://github.com/sandy191020/voiceflow_c/issues

---

## 🎓 Architecture Diagrams

### Data Flow
```
User Input
  ↓
Chat API
  ↓
Runtime Engine
  ├─ Load Workflow
  ├─ Execute Nodes
  └─ Process Output
  ↓
Response to User
  ↓
Log to Database
  ↓
Deduct Credits
```

### Billing Flow
```
User Action
  ↓
Check Credits
  ↓ (Insufficient?)
Redirect to Stripe
  ↓
Payment Processing
  ↓
Webhook Event
  ↓
Update Subscription
  ↓
Provision Credits
```

### Security Layers
```
Authentication (Supabase Auth)
  ↓
Authorization (RLS Policies)
  ↓
Data Validation
  ↓
Rate Limiting
  ↓
Encryption (HTTPS)
```

---

## 📈 Scaling Path

### Phase 1: MVP (Current)
- Single Vercel deployment
- Supabase managed database
- Basic monitoring

### Phase 2: Growth
- Multiple regions
- Database read replicas
- Enhanced analytics
- Team pricing tiers

### Phase 3: Enterprise
- Self-hosted options
- Custom integrations
- Dedicated support
- SLA guarantees

---

## ✅ Final Checklist

Before going live:
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Storage bucket created
- [ ] Stripe webhook configured (if using billing)
- [ ] Domain SSL certificate installed
- [ ] Email verification configured
- [ ] Error tracking enabled
- [ ] Monitoring and alerts set up
- [ ] Backup strategy in place
- [ ] Documentation reviewed
- [ ] Team trained on operations
- [ ] Go/no-go decision made

---

**You're all set! VoiceBuild is ready for production. 🚀**

For questions, refer to the comprehensive README.md and IMPLEMENTATION_SUMMARY.md files.
