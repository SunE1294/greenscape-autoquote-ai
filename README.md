# Greenscape Pro · P0 AI Proposal & Scope Estimator Engine ("AutoQuote AI")
> **Production AI Automation Suite built for isthispossible.ai Technical Evaluation**  
> **Client:** Greenscape Pro (Phoenix, AZ) · **Founder:** Marcus Tate  
> **Live Deployed URL:** [https://greenscape-autoquote-ai-09.vercel.app](https://greenscape-autoquote-ai-09.vercel.app)  
> **GitHub Repository:** [https://github.com/SunE1294/greenscape-autoquote-ai](https://github.com/SunE1294/greenscape-autoquote-ai)  

---

## 🎯 Executive Problem & Business Diagnosis
Greenscape Pro is a high-end residential hardscape design-build contractor in Phoenix, AZ ($4.2M annual revenue, ~$28k average project value, $27k/mo paid ad spend with 4.5x ROAS).

* **The Core Bottleneck:** Marcus Tate closes 70%+ of his site walks, but takes **6 to 9 days** to deliver a proposal because he personally translates chaotic, unstructured field notes into a 200+ line-item pricing spreadsheet.
* **The Financial Bleed:** **35% to 40% of qualified leads are lost to faster competitors** during this quote turnaround lag—costing **$1.47M to $1.68M in gross pipeline every year**.
* **The P0 Solution:** **AutoQuote AI** compresses this 6–9 day delay down to **under 15 minutes**. It captures spoken notes via the browser Web Speech API, auto-maps them to the standardized 200+ pricing catalog, enforces a guaranteed 38%+ gross margin, auto-triggers a 3D CAD design brief for Carlos Reyes whenever the job is >$30,000, writes directly to Supabase PostgreSQL tables, and dispatches in 1 click to Stripe, Resend email, Twilio SMS, Slack, and GoHighLevel CRM.

---

## 🏗️ System Workflow & Architecture

```mermaid
flowchart TD
    subgraph INTAKE["1. Site Walk & Lead Intake"]
        A1["Contractor On-Site Walk<br/>(Marcus Tate)"] -->|Voice Dictation via Web Speech API| A2["Raw Unstructured Notes"]
        A3["Customer Details<br/>(Name, Email, Phone, Address)"] --> A2
    end

    subgraph AI_ENGINE["2. AI Extraction & Estimating Engine"]
        A2 --> B1["AI Extractor & Catalog Matcher<br/>(/api/generate-proposal)"]
        B2["Greenscape 200+ Catalog<br/>(Hardscape, Pergola, Turf, Lighting)"] --> B1
        B1 --> B3["Margin Health Check<br/>(Enforcing >= 38% Gross Margin)"]
        B1 --> B4{"Project > $30k?"}
        B4 -- Yes --> B5["Flag Carlos Reyes<br/>3D CAD Render Queue"]
        B4 -- No --> B6["Standard 2D Plan"]
        B1 --> B7["Auto-Generate 3 Tiers<br/>(Good / Better / Best)"]
    end

    subgraph HITL["3. Human-in-the-Loop Studio"]
        B3 --> C1["Quote Review & Override Studio"]
        B5 --> C1
        B7 --> C1
        C1 --> C2["Marcus Adjusts Quantities,<br/>Margin & Tier Packages"]
    end

    subgraph PERSISTENCE["4. Active Database Persistence"]
        C2 --> D1["Active DB Upsert<br/>(@supabase/supabase-js)"]
        D1 -->|Fail-Safe Fallback| D2["Direct PostgreSQL Pool<br/>(pg.Pool with SSL)"]
        D1 --> D3[("Supabase Database<br/>• proposals table<br/>• proposal_items table")]
        D2 --> D3
    end

    subgraph DISPATCH["5. 1-Click Multi-Channel Dispatch (/api/dispatch)"]
        C2 --> E0["1-Click Approve & Dispatch"]
        E0 --> E1["Stripe API SDK<br/>50% Deposit Checkout Session"]
        E0 --> E2["Resend / SendGrid<br/>Branded HTML Proposal Email"]
        E0 --> E3["Twilio / GHL SMS<br/>Direct Client Text Link"]
        E0 --> E4["Slack Webhooks<br/>#proposals-ready & #carlos-cad-queue"]
        E0 --> E5["GoHighLevel CRM<br/>Stage: Proposal Presented"]
    end

    subgraph CLIENT_PORTAL["6. Client Proposal Portal & Payment"]
        E1 --> F1["Client Landing Page<br/>(/proposal/[id])"]
        E2 --> F1
        E3 --> F1
        F1 --> F2["Client Selects Tier<br/>(Good / Better / Best)"]
        F2 --> F3["Click 'Accept & Pay Deposit'"]
        F3 --> F4["Live Stripe Checkout<br/>(checkout.stripe.com)"]
        F4 -->|Payment Confirmed| F5[("Status: deposit_paid<br/>Moved to Fulfillment Queue")]
    end
```

---

## 🚀 Key Production Features

### 1. Browser-Native Web Speech API Voice Dictation
* Built-in continuous speech recognition using the browser `webkitSpeechRecognition` API.
* Allows Marcus to talk freely while walking the backyard without typing, automatically populating unstructured site notes in real-time.

### 2. Intelligent Catalog Matcher & Margin Guardrails
* Parses complex Phoenix requirements (*French pattern travertine, Alumawood pergolas, gas fire pits, pet turf, low-voltage brass lighting, permit engineering*).
* Automatically calculates material costs, labor allowances, and contractor retail pricing.
* Strictly enforces Greenscape Pro's **38.0% gross margin target**, alerting the contractor if margin drops below threshold.

### 3. Carlos Reyes >$30k 3D CAD Design Trigger
* Automatically detects when a project exceeds **$30,000**.
* Auto-compiles a specialized 3D design brief with suggested viewports (*Twilight Fire Pit & Lighting Mood Render, Aerial Master Plan*) routed to lead designer **Carlos Reyes**.

### 4. Real Supabase Database Persistence
* Directly instantiates `@supabase/supabase-js` in serverless routes with active SQL `upsert` queries into `proposals` and `proposal_items`.
* Direct PostgreSQL SSL connection pooler fallback ensures guaranteed zero-loss persistence even if API keys are undergoing rotation.

### 5. Multi-Channel Dispatch Engine
* **Stripe SDK**: Executes `stripe.checkout.sessions.create()` with 50% deposit amounts, redirecting directly to live `checkout.stripe.com`.
* **Resend & SendGrid**: Dispatches branded HTML proposal emails with interactive package buttons and full scope breakdowns.
* **Slack Webhooks**: Pushes interactive message cards to `#proposals-ready` and `#carlos-cad-queue`.
* **Twilio SMS**: Sends the homeowner a mobile-optimized quote link directly from Marcus Tate.
* **GoHighLevel CRM**: Syncs contact record and advances opportunity stage to *"Proposal Sent (50% Deposit Awaited)"*.

### 6. Homeowner Proposal Portal (`/proposal/[id]`)
* Luxury client-facing portal where homeowners toggle between **Good / Better / Best** packages with dynamic pricing recalculation.
* Includes one-click **"Accept & Pay Deposit"** redirecting directly to Stripe Checkout.

---

## 💻 Tech Stack & Cost Considerations

| Layer | Technology | Rationale & Cost Impact |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) + TypeScript | Server-rendered high performance, strict typing, edge-ready API routes. |
| **Styling** | Tailwind CSS + Lucide Icons | Dark luxury contractor UI, fully mobile responsive. |
| **Speech-to-Text** | Web Speech API (`webkitSpeechRecognition`) | Native browser capability, **\$0.00 cost**, zero latency. |
| **AI LLM** | OpenAI GPT-4o / Claude 3.5 Sonnet | Strict structured JSON Schema parsing. **Cost: ~$0.038 per proposal** vs $28k deal value. |
| **Database** | Supabase (PostgreSQL 15) | Relational schema with foreign keys, full audit logging, and connection pooling. |
| **Payments** | Stripe API SDK (`stripe`) | 50% deposit checkout sessions, webhooks, and customer reference tracking. |
| **Email Delivery** | Resend / SendGrid REST APIs | Transactional branded HTML proposal packet with explicit error handling. |
| **Hosting** | Vercel Serverless Edge | Zero-maintenance automated CI/CD deployments. |

---

## 📦 Setup & Local Development

### Prerequisites
* Node.js 18+ & npm/yarn/pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/SunE1294/greenscape-autoquote-ai.git
cd greenscape-autoquote-ai
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
# AI Model
OPENAI_API_KEY=sk-proj-...

# Supabase Persistence
NEXT_PUBLIC_SUPABASE_URL=https://fptuqhbzqehhjrclkwrg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
DATABASE_URL=postgresql://postgres.fptuqhbzqehhjrclkwrg:SuNnY1294Pani@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...

# Transactional Email
RESEND_API_KEY=re_...

# Team Webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

The full PostgreSQL migration script is located at `src/lib/db/schema.sql`.

Key relational tables:
1. `proposals`: Master quote header, status, totals, margin %, deposit required, Carlos CAD status, Stripe links.
2. `proposal_items`: Detailed line items, catalog item ID, categories, quantities, unit costs, unit prices, margins.
3. `render_requests`: Carlos Reyes 3D CAD design briefs, status, viewports, deadlines.
4. `integrations_log`: Complete audit trail of every webhook payload, email status, and external API response.

---

## 🛡️ Live Walkthrough Interview Defense & Trade-Offs

**Q: Why build the Quote Estimator as P0 instead of Lead Reactivation or Pre-Qualification?**  
*A: Quoting speed is the primary fatal leak in Marcus's business. He already closes 70%+ of his site walks, but 35–40% of qualified leads cancel or pick a faster competitor during his 6–9 day spreadsheet delay. Compressing this turnaround to under 15 minutes captures $1.47M+ in existing high-intent revenue immediately without needing a single extra dollar of ad spend.*

**Q: What would break first at scale?**  
*A: Custom hardscape edge cases (e.g. unpredicted caliche rock excavation in Arizona soil or non-standard electrical trenching) that fall outside standard catalog line items. We resolved this by implementing Human-in-the-Loop review where Marcus can edit quantities, unit costs, and margins with 1 click before sending.*

**Q: Why didn't you build a social media marketing bot?**  
*A: Marcus already spends $27k/month generating leads with 4.5x ROAS and explicitly stated on the discovery call: "I cannot keep up with the leads I have." Building a marketing bot into an overflowing, choked operational pipeline is a classic contractor mistake.*
