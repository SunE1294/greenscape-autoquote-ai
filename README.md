# Greenscape Pro · P0 AI Proposal & Scope Estimator Engine ("AutoQuote AI")
> **Production AI Automation Suite built for isthispossible.ai Technical Evaluation**  
> **Client:** Greenscape Pro (Phoenix, AZ) · Founder: Marcus Tate  
> **Live Deployed URL:** [https://greenscape-autoquote.vercel.app](https://greenscape-autoquote.vercel.app) *(or your Vercel deployment)*  
> **GitHub Repository:** [https://github.com/SunE1294/greenscape-autoquote-ai](https://github.com/SunE1294/greenscape-autoquote-ai)  

---

## 🎯 Executive Problem & Business Diagnosis
Greenscape Pro is a premium residential hardscape design-build contractor ($4.2M revenue, ~$28k average project, $27k/mo paid ad spend with 4.5x ROAS).

* **The Core Bottleneck:** Marcus takes **6 to 9 days** to produce a proposal after a site walk because he personally translates unformatted field notes into a 200+ line-item pricing spreadsheet.
* **The Financial Bleed:** **35% to 40% of qualified leads are lost to faster competitors** during this quote delay—bleeding **$1.47M to $1.68M in gross pipeline every year**.
* **The P0 Solution:** **AutoQuote AI** compresses this 6–9 day cycle down to **under 15 minutes**. It ingests raw notes, auto-maps them to the standardized 200+ pricing catalog, guarantees a 38%+ gross margin, auto-triggers a 3D CAD design brief for Carlos Reyes whenever the job is >$30,000, and enables 1-click dispatch to GoHighLevel CRM, Stripe 50% deposit checkout, Slack, and client SMS.

---

## 🏗️ System Architecture

```
                                  +---------------------------------------+
                                  |   Marcus Tate (Site Walk Field Notes) |
                                  |    (Voice Memos, Sketches, Specs)     |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                                  +---------------------------------------+
                                  |      Next.js 14 Web / Mobile UI       |
                                  |      (Quote Studio & Preset Hub)      |
                                  +-------------------+-------------------+
                                                      |
                                                      v
                         +---------------------------------------------------------+
                         |           AI SCOPE & ESTIMATION ENGINE (GPT-4o)          |
                         |  - JSON Schema Parsing                                  |
                         |  - 200+ Item Phoenix Catalog Matching                   |
                         |  - 38%+ Gross Margin Guardrail Validator                |
                         |  - Carlos Reyes 3D CAD Trigger (If Total >= $30,000)    |
                         |  - 3-Tier Package Generator (Good / Better / Best)      |
                         +----------------------------+----------------------------+
                                                      |
                                                      v
                         +---------------------------------------------------------+
                         |          HUMAN-IN-THE-LOOP (HITL) REVIEW STUDIO         |
                         |  - Live Line-Item Quantity & Retail Price Overrides     |
                         |  - Dynamic Margin Health Check Indicator                |
                         |  - Carlos CAD Brief Editor & Viewport Selector          |
                         +----------------------------+----------------------------+
                                                      |
                                    [ Marcus Hits "Approve & Dispatch" ]
                                                      |
                   +-------------------+--------------+--------------+-------------------+
                   |                   |                             |                   |
                   v                   v                             v                   v
        +--------------------+ +--------------------+       +------------------+ +-----------------+
        |  GoHighLevel CRM   | |   Stripe Deposit   |       |  Slack Webhooks  | |   Twilio SMS    |
        |  - Sync Contact    | |   - 50% Payment    |       |  - #proposals    | |  - Client Link  |
        |  - Move Stage      | |     Link Generator |       |  - #cad-queue    | |    Notification |
        +--------------------+ +--------------------+       +------------------+ +-----------------+
                                       |
                                       v
                        +-------------------------------+
                        |  PostgreSQL / Supabase DB     |
                        |  - Proposals & Line Items     |
                        |  - Integrations Audit Log     |
                        +-------------------------------+
```

---

## 🚀 Key Features

### 1. AI Unstructured Site Walk Parsing
* Ingests messy, spoken, or typed notes with complex Phoenix landscaping requirements (e.g., French pattern travertine, Alumawood pergolas, gas fire pits, pet turf, smart drip irrigation, drainage swales).
* Resolves dimensions, quantities, and material specs into structured items.

### 2. Profitability & Margin Guardrails
* Enforces Greenscape Pro’s target **38.0% gross margin rule**.
* Visual warning system immediately flags whenever a quote drops below target, preventing underbidding.

### 3. Carlos Reyes >$30k 3D CAD Trigger
* Automatically detects when proposal total exceeds **$30,000**.
* Auto-generates a CAD design brief, suggested viewpoints (e.g., Twilight Fire Pit & LED Lighting Mood Render, Aerial Master View), and routes alerts to Carlos's queue.

### 4. 1-Click Multi-Channel Dispatch
* **GoHighLevel CRM**: Syncs client contact and creates/updates pipeline opportunity to "Proposal Sent".
* **Stripe**: Automatically generates a 50% deposit checkout payment link.
* **Slack**: Sends rich interactive notification blocks to team channels `#proposals-ready` and `#carlos-cad-queue`.
* **Twilio SMS**: Sends the homeowner a mobile-optimized quote link.

### 5. Client-Facing Interactive Quote Portal
* Luxury, mobile-first branded landing page where homeowners can toggle between **Good / Better / Best** packages, review itemized specifications, and click to pay the 50% deposit via Stripe.

---

## 💻 Tech Stack & Cost Considerations

| Layer | Technology | Rationale & Cost Impact |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 (App Router) + TypeScript | High-performance server rendering, robust type safety, API routes. |
| **Styling** | Tailwind CSS + Lucide Icons | Luxury dark/light contractor UI, rapid iteration, fully responsive. |
| **AI LLM** | OpenAI GPT-4o / Claude 3.5 Sonnet | Strict JSON Schema adherence. **Cost: ~$0.038 per proposal** vs $28k deal value. |
| **Database** | PostgreSQL / Supabase | Relational schema with full audit logging and offline-first fallback. |
| **Integrations** | Stripe, GoHighLevel, Slack, Twilio | Real webhooks and payment link generation. |

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
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your API credentials (optional for testing—the app includes comprehensive mock adapters for zero-config evaluation):
```env
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
STRIPE_SECRET_KEY=sk_test_...
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/...
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema & Migrations

The full PostgreSQL migration script is located at `src/lib/db/schema.sql`.

Key relational tables:
1. `proposals`: Master quote header, status, totals, margin %, deposit required, Carlos CAD status.
2. `proposal_items`: Detailed line items, category, quantities, unit costs, unit prices, margins.
3. `render_requests`: Carlos Reyes 3D CAD briefs, status, viewports, deadlines.
4. `integrations_log`: Complete audit trail of every webhook payload and external API response.

---

## 🛡️ Live Walkthrough Interview Defense & Trade-Offs

**Q: Why build the Quote Estimator as P0 instead of Lead Reactivation or Pre-Qualification?**  
*A: Quoting speed is the primary fatal leak. Marcus closes 70%+ of his site walks, but 35–40% of qualified leads cancel or pick a competitor during his 6–9 day delay. Compressing this turnaround to 15 minutes captures $784k+ in existing high-intent revenue immediately without additional ad spend.*

**Q: What would break first at scale?**  
*A: Custom hardscape edge cases (e.g. unpredicted caliche rock excavation in Phoenix soil or complex electrical trenching) that fall outside standard catalog line items. We solved this by implementing Human-in-the-Loop review where Marcus can edit quantities, unit costs, and margins with 1 click before sending.*

**Q: Why didn't you build a social media marketing bot?**  
*A: Marcus already spends $27k/month generating leads with 4.5x ROAS and explicitly said on the discovery call: "I cannot keep up with the leads I have." Building a marketing bot into an overflowing, choked pipeline is an operational trap.*
