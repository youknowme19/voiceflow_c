# VoiceBuild

**The Operating System for AI Agents**

A production-ready SaaS platform for building, testing, deploying, and monitoring intelligent AI agents with a visual flow builder, multi-channel deployment, and comprehensive analytics.

## 🎯 Features

### Core Platform
- **Visual Agent Builder** - Drag-and-drop workflow designer with 7 node types (Start, Message, AI, Condition, API, Knowledge, End)
- **Runtime Engine** - Execute complex workflows with sequential node traversal and conditional logic
- **AI Integration** - OpenRouter LLM support with multiple model selection
- **Chat Simulator** - Test agents with real-time execution logging and performance metrics
- **Knowledge Base** - Upload documents, generate embeddings, semantic search integration
- **Analytics Dashboard** - Real-time conversation metrics and usage tracking
- **Team Management** - Role-based access control with team invitations
- **Billing System** - Stripe integration with credit-based metering (Starter/Pro/Business plans)
- **API Integrations** - Connect external APIs from workflow nodes with request/response handling
- **Multi-Channel Widget** - Embeddable chat widget with floating UI and animation support
- **Real-Time Monitoring** - Live agent activity dashboard with Supabase Realtime

### Security & Performance
- **Row Level Security** - Database-level data isolation per team
- **Rate Limiting** - Prevent abuse with configurable request throttling
- **Message Streaming** - Optimized response delivery for better UX
- **Request Deduplication** - Prevent duplicate concurrent requests
- **Intelligent Caching** - Knowledge base result caching with TTL
- **Retry Logic** - Exponential backoff for API resilience

## 📋 Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, TailwindCSS 4, Framer Motion, React Flow
- **State Management**: Zustand, TanStack React Query
- **Backend**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **AI/LLM**: OpenRouter API with multiple model support
- **Payments**: Stripe API
- **Analytics**: Recharts
- **UI Components**: Shadcn/ui, Radix UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenRouter API key
- Stripe account (optional, for payments)

### Installation

```bash
# Clone repository
git clone https://github.com/sandy191020/voiceflow_c.git
cd voicebuild

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
# Edit .env.local with your Supabase, OpenRouter, and Stripe keys
```

### Environment Setup

```env
# OpenRouter API
OPENROUTER_API_KEY=your_key_here

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# Public URLs
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_STARTER=price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx
STRIPE_PRICE_BUSINESS=price_xxxxx
```

### Database Setup

```bash
# Apply migrations
supabase db push

# Create storage bucket for documents
# (via Supabase dashboard: Storage → New Bucket → documents)
```

### Running Locally

```bash
# Development server
npm run dev

# Open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
voicebuild/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── api/                     # API routes
│   │   ├── agents/              # Agent management
│   │   ├── billing/             # Stripe checkout & webhooks
│   │   ├── widget/              # Widget chat endpoint
│   │   ├── knowledge/           # Embeddings generation
│   │   ├── team/                # Team invitations
│   │   └── ai/                  # OpenRouter proxy
│   ├── dashboard/               # Protected routes
│   │   ├── agents/              # Agent list & builder
│   │   ├── builder/[agentId]    # Visual flow editor
│   │   ├── analytics/           # Metrics dashboard
│   │   ├── knowledge/           # Document management
│   │   ├── integrations/        # API integrations
│   │   ├── team/                # Team management
│   │   ├── billing/             # Plan management
│   │   └── monitoring/          # Real-time logs
│   ├── login/                   # Auth pages
│   └── signup/
├── components/
│   ├── builder/                 # React Flow canvas & controls
│   ├── chat/                    # Chat UI components
│   └── ...
├── lib/
│   ├── supabaseClient.ts        # Supabase initialization
│   ├── openrouter.ts            # LLM API client
│   ├── builderStore.ts          # Zustand state
│   ├── runtime/
│   │   └── agentRunner.ts       # Workflow execution engine
│   ├── performance.ts           # Caching, rate limiting, etc.
│   └── Providers.tsx            # Auth & Query providers
├── db/
│   └── migrations/              # Supabase SQL migrations
│   ├── 0001_initial.sql         # Base schema
│   ├── 0002_flows.sql           # Workflow tables
│   └── 0003_rls.sql             # Row level security
├── public/
│   └── voicebuild-widget.js    # Embeddable chat widget
└── ...config files
```

## 🔧 API Endpoints

### Agents
- `GET /api/agents` - List user's agents
- `POST /api/agents` - Create agent
- `GET /api/agents/[id]` - Get agent details
- `POST /api/agents/[id]/test` - Test agent with message

### Knowledge Base
- `POST /api/knowledge/embed` - Generate embeddings for document

### Team
- `POST /api/team/invite` - Invite team member

### Billing
- `POST /api/billing/create-checkout-session` - Create Stripe checkout
- `POST /api/billing/webhook` - Handle Stripe events

### Widget
- `POST /api/widget/chat` - Public chat endpoint for embedded widget

### AI
- `POST /api/ai` - OpenRouter proxy endpoint

## 🎨 Visual Builder Features

### Node Types
1. **Start** - Begin workflow execution
2. **Message** - Send predefined text message
3. **AI** - Call LLM with user context
4. **Condition** - Branch workflow based on logic
5. **API** - Call external HTTP endpoint
6. **Knowledge** - Query semantic search over documents
7. **End** - Terminate workflow

### Workflow Execution
- Sequential node traversal from START to END
- Conditional branching on condition nodes
- Context passing between nodes
- Error handling and logging
- Credit deduction on AI calls

## 💰 Billing Plans

| Plan | Monthly | Credits | Agents | Support |
|------|---------|---------|--------|---------|
| **Starter** | Free | 1,000 | 2 | Community |
| **Pro** | $60 | 10,000 | 20 | Priority |
| **Business** | $150 | 30,000 | Unlimited | Dedicated |

Each AI response costs 1 credit. Plans auto-renew via Stripe.

## 🔐 Security

- **Authentication**: Supabase Auth with email/password support
- **Authorization**: Row Level Security policies on all data tables
- **Data Isolation**: Team-based multi-tenancy
- **API Keys**: Secure token management for integrations
- **Rate Limiting**: Per-user request throttling
- **Encryption**: HTTPS only, SSL certificates

## 📊 Database Schema

### Core Tables
- `teams` - Team organizations
- `team_members` - User team memberships
- `agents` - AI agent definitions
- `agent_versions` - Workflow version history
- `nodes` - Workflow node definitions
- `edges` - Node connections
- `conversations` - Chat sessions
- `messages` - Conversation messages
- `knowledge_documents` - Uploaded docs
- `embeddings` - Vector embeddings
- `integrations` - API configurations
- `subscriptions` - Stripe subscription records
- `usage_credits` - User credit balances
- `agent_logs` - Execution logs
- `api_calls` - Integration call records

## 🚦 Deployment

### Vercel (Recommended)
```bash
# Connect repository
vercel link

# Deploy with environment variables
vercel env add OPENROUTER_API_KEY
vercel env add SUPABASE_URL
# ... add all required vars

vercel deploy
```

### Self-Hosted
```bash
# Build
npm run build

# Start with Node
npm start

# Or use PM2
pm2 start npm --name voicebuild -- start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛣️ Roadmap

- [ ] Webhook integration for agent events
- [ ] Conversation export (PDF, JSON)
- [ ] Advanced node types (Loop, Delay, Transform)
- [ ] Multi-language support
- [ ] Custom branded widget options
- [ ] Team analytics
- [ ] API documentation portal
- [ ] Agent templates/marketplace

## 📝 License

MIT - See LICENSE file for details

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

- Documentation: https://docs.voicebuild.ai (coming soon)
- Email: support@voicebuild.ai
- Discord: Join our community (link coming soon)

## 🎉 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.io)
- [OpenRouter](https://openrouter.ai)
- [React Flow](https://reactflow.dev)
- [TailwindCSS](https://tailwindcss.com)

---

**Last Updated**: March 2026
**Version**: 1.0.0-MVP

- Implement full workflow execution logic and node types
- Enhance knowledge embedding (PDF parsing, search)
- Integrate Stripe for billing and credits tracking
- Add API integration system and external call nodes
- Build version control/UIs for agent history
- Harden security, add rate limiting, RLS policies

This MVP structure is ready for further development toward a production-grade AI agent platform.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd voicebuild
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Copy `.env.example` to `.env` and fill in your keys:
   ```text
   OPENROUTER_API_KEY=
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   ```

4. **Run Supabase migrations**
   Use the Supabase CLI to apply the SQL files in `db/migrations` against your new project.

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the app**
   Visit [http://localhost:3000](http://localhost:3000) to view the landing page and sign up.

## Folder Structure

Key directories:
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components
- `lib/` - Utilities and clients (Supabase, AuthProvider)
- `db/migrations/` - SQL migration files for Supabase

## Deployment

Frontend deploy to Vercel, backend is powered by Supabase. Ensure environment variables are configured in both platforms.

## License

MIT
