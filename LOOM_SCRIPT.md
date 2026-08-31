# 5-Minute Loom Video Walkthrough Script
**Project:** Greenscape Pro AI Strategy & P0 Proposal Engine  
**Candidate Target Duration:** 4 minutes 45 seconds (Strictly under 5 minutes)  

---

## ⏱️ Timeline & Screen-by-Screen Breakdown

### 0:00 – 1:15 | Part 1: Strategy Document & Prioritization Reasoning
* **Screen to Show:** `STRATEGY_DOC.md` / Architecture Waterfall Diagram on Dashboard.
* **Script:**
  > *"Hi team, I'm excited to walk you through our AI automation strategy and P0 build for Greenscape Pro.*
  >
  > *When auditing Marcus Tate’s business, the ground truth numbers revealed something critical: Greenscape Pro is **quote-constrained, not lead-constrained**. Marcus spends $27,000/month on ads with a 4.5x ROAS, but takes **6 to 9 days** to produce a proposal. Because of this delay, **35% to 40% of qualified leads are lost to faster competitors**—a catastrophic $1.5M+ annual revenue leak.*
  >
  > *Our Top 3 prioritized agents directly attack this reality:*
  > 1. ***P0: AutoQuote AI (The Proposal & Scope Estimator Engine)***: *Ingests raw site walk notes, maps them to Greenscape’s 200+ pricing catalog, enforces a 38%+ margin guardrail, and auto-triggers Carlos’s 3D CAD render when over $30k. This recovers $784k to $1.1M/year and saves Marcus 12+ hours/week.*
  > 2. ***P1: OnboardFlow AI (Post-Sign Drag Accelerator)***: *Unblocks 8–12 stalled jobs in HOA and permit limbo, accelerating $224k–$336k in rolling cash flow.*
  > 3. ***P2: ReviveFlow AI (1,400 Closed-Lost Reactivator)***: *Extracts $784k in latent pipeline from their 3-year GHL database at zero CAC.*
  >
  > *We explicitly rejected Marcus’s stated idea of a social media content bot. Flooding the top of the funnel when the proposal engine takes 9 days is an operational trap."*

---

### 1:15 – 3:00 | Part 2: P0 Live Demo (Lead Ingestion → AI Estimation → Multi-Channel Dispatch)
* **Screen to Show:** Live Web Application UI (`http://localhost:3000` or deployed Vercel URL).
* **Script:**
  > *"Let’s look at the P0 agent we built end-to-end.*
  >
  > *Here is the **Greenscape Quote Studio**. Marcus simply drops his raw, unformatted notes from a site walk—for example, David & Sarah Miller in Arcadia wanting 850 sq ft of French pattern travertine, a 14x18 cedar pergola, a gas fire pit, and pet turf.*
  >
  > *When we click **Generate Proposal & Scope**, the AI engine executes a structured JSON extraction against Greenscape Pro’s standardized catalog.*
  >
  > *Notice what happens immediately:*
  > 1. *It parses each line item, calculates exact quantities, base costs, and client retail pricing.*
  > 2. *It evaluates our **Gross Margin Guardrail (41.7%)**—confirming it exceeds Greenscape’s 38.0% profitability target.*
  > 3. *Because the total is $48,400 (exceeding the $30,000 threshold), the system automatically flags a **3D CAD Render Task for Carlos Reyes**, auto-generating a detailed design brief with suggested viewports.*
  > 4. *It builds a **3-tier Good / Better / Best presentation**.*
  >
  > *As a human-in-the-loop, Marcus can tweak any quantity or price inline—and the margin updates dynamically in real-time.*
  >
  > *Now, when Marcus clicks **Approve & 1-Click Dispatch**:*
  > * It syncs the contact and moves the opportunity in GoHighLevel to 'Proposal Sent'.*
  > * It generates a **Stripe 50% deposit checkout link** ($24,200).*
  > * It sends rich notification blocks to Slack (#proposals-ready and #carlos-cad-queue).*
  > * It triggers an SMS to the homeowner with their personalized proposal link.*
  >
  > *Let’s click the **Client View** link: Here is the branded, mobile-responsive quote page where the client can review the tiers and click to pay the Stripe deposit immediately."*

---

### 3:00 – 4:00 | Part 3: Architecture & Engineering Decisions
* **Screen to Show:** Code Editor / Architecture Diagram in `README.md`.
* **Script:**
  > *"Under the hood, here are the architectural decisions we made:*
  > * **Stack:** Next.js 14 App Router with TypeScript and Tailwind CSS for speed, clean server components, and responsive luxury styling.
  > * **AI Layer:** OpenAI GPT-4o with strict JSON Schema output validation and deterministic fallback heuristic logic. Cost per proposal generation is roughly **$0.038**—completely negligible against a $28,000 average deal.
  > * **Persistence:** PostgreSQL via Supabase with structured relational tables for `proposals`, `proposal_items`, `render_requests`, and `integrations_log`, backed by an offline-first storage adapter.
  > * **External Integrations:** Webhook connectors to GoHighLevel CRM, Stripe API for dynamic 50% deposit link generation, and Slack webhooks.*
  > * **Guardrails:** Margin validation logic runs before any quote can be dispatched to ensure Marcus never underbids."*

---

### 4:00 – 4:45 | Part 4: What We Would Build Next in Week 2 & Conclusion
* **Screen to Show:** Dashboard ROI & Multi-Agent tab.
* **Script:**
  > *"If we had another week on this client, here is what we would build next:*
  > 1. *Connect the **OnboardFlow AI** to automate Phoenix municipal permit portal status scraping and HOA PDF packet generation.*
  > 2. *Deploy the **ReviveFlow AI** to run scheduled, randomized 1-on-1 SMS campaigns across the 1,400 cold leads in GHL, handling inbound replies with conversational qualification.*
  >
  > *This system transforms Greenscape Pro from a founder-choked bottleneck into an automated, margin-protected revenue machine.*
  >
  > *Thank you, and I look forward to our live walkthrough call!"*
