-- ==============================================================================
-- GREENSCAPE PRO DATABASE SCHEMA (PostgreSQL / Supabase)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  lead_name TEXT NOT NULL,
  lead_email TEXT,
  lead_phone TEXT,
  property_address TEXT NOT NULL,
  city TEXT DEFAULT 'Phoenix, AZ',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'sent_to_client', 'deposit_paid', 'in_fulfillment')),
  raw_notes TEXT NOT NULL,
  summary_scope TEXT,
  site_constraints JSONB DEFAULT '[]'::jsonb,
  hoa_approval_required BOOLEAN DEFAULT true,
  permit_required BOOLEAN DEFAULT true,
  
  -- Financial Calculations
  subtotal_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  subtotal_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  gross_margin_percent NUMERIC(5, 3) NOT NULL DEFAULT 0.380,
  is_margin_healthy BOOLEAN DEFAULT true,
  deposit_required NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  
  -- 3D CAD Render Trigger (Carlos Reyes > $30k)
  render_required BOOLEAN DEFAULT false,
  render_status TEXT DEFAULT 'not_required',
  render_details JSONB DEFAULT '{}'::jsonb,
  
  -- Tiers & Selection
  tier_packages JSONB DEFAULT '{}'::jsonb,
  selected_tier TEXT DEFAULT 'better',
  
  -- External Integrations Tracking
  ghl_contact_id TEXT,
  ghl_opportunity_id TEXT,
  stripe_payment_link TEXT,
  stripe_deposit_invoice_id TEXT,
  slack_dispatched BOOLEAN DEFAULT false,
  sms_dispatched BOOLEAN DEFAULT false,
  dispatched_at TIMESTAMPTZ,
  dispatched_by TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Proposal Line Items Table
CREATE TABLE IF NOT EXISTS proposal_items (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  catalog_item_id TEXT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL,
  unit_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  margin NUMERIC(5, 3) NOT NULL DEFAULT 0.380,
  tier TEXT DEFAULT 'better',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Carlos Reyes 3D Render Workflow Table
CREATE TABLE IF NOT EXISTS render_requests (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  assigned_to TEXT DEFAULT 'Carlos Reyes (Lead Designer)',
  reason TEXT NOT NULL,
  suggested_views JSONB DEFAULT '[]'::jsonb,
  design_brief TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'not_required')),
  cad_files_url TEXT,
  deadline_estimate TEXT DEFAULT '48 hours',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. External Integrations Audit Log
CREATE TABLE IF NOT EXISTS integrations_log (
  id TEXT PRIMARY KEY,
  proposal_id TEXT REFERENCES proposals(id) ON DELETE SET NULL,
  service TEXT NOT NULL CHECK (service IN ('GHL', 'Stripe', 'Slack', 'Twilio', 'Jobber', 'CompanyCam')),
  event TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'simulated')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  response JSONB NOT NULL DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid query & analytics
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposal_items_proposal_id ON proposal_items(proposal_id);
CREATE INDEX IF NOT EXISTS idx_integrations_log_proposal_id ON integrations_log(proposal_id);
