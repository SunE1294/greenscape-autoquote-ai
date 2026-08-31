export type ProjectCategory = 
  | 'Hardscape'
  | 'Landscape'
  | 'Pergola & Shade'
  | 'Fire & Water Features'
  | 'Outdoor Kitchen'
  | 'Turf & Putting Green'
  | 'Masonry & Retaining'
  | 'Irrigation & Drainage'
  | 'Lighting'
  | 'Permits & Engineering'
  | 'Demolition & Excavation';

export interface PricingCatalogItem {
  id: string;
  category: ProjectCategory;
  name: string;
  description: string;
  unit: 'sq_ft' | 'linear_ft' | 'unit' | 'pallet' | 'zone' | 'allowance' | 'hour';
  baseCost: number;       // Direct labor + material cost
  defaultRetailPrice: number; // Standard client retail price
  margin: number;         // (defaultRetailPrice - baseCost) / defaultRetailPrice
  typicalLaborHours: number;
  isPopularInPhoenix: boolean;
}

export interface ProposalLineItem {
  id: string;
  catalogItemId?: string;
  category: ProjectCategory;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;      // Internal cost
  unitPrice: number;     // Client retail price
  totalCost: number;     // quantity * unitCost
  totalPrice: number;    // quantity * unitPrice
  margin: number;        // (totalPrice - totalCost) / totalPrice
  isOptional?: boolean;
  tier?: 'good' | 'better' | 'best';
}

export interface RenderRequest {
  required: boolean;
  reason: string;
  suggestedViews: string[];
  designBrief: string;
  assignedTo: string; // Carlos Reyes
  status: 'pending' | 'in_progress' | 'completed' | 'not_required';
  deadlineEstimate: string;
}

export interface TierPackage {
  tier: 'good' | 'better' | 'best';
  name: string;
  description: string;
  totalPrice: number;
  depositAmount: number;
  estimatedWeeks: number;
  highlightedItems: string[];
}

export interface Proposal {
  id: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  propertyAddress: string;
  city: string;
  status: 'draft' | 'under_review' | 'approved' | 'sent_to_client' | 'deposit_paid' | 'in_fulfillment';
  createdAt: string;
  updatedAt: string;
  rawNotes: string;
  summaryScope: string;
  siteConstraints: string[];
  hoaApprovalRequired: boolean;
  permitRequired: boolean;
  
  // Financials
  items: ProposalLineItem[];
  subtotalCost: number;
  subtotalPrice: number;
  totalCost: number;
  totalPrice: number;
  grossMarginPercent: number; // e.g. 0.39 (39%)
  isMarginHealthy: boolean;   // >= 0.38
  marginAlertReason?: string;
  depositRequired: number;    // 50% of totalPrice
  
  // 3D Render Trigger
  renderRequest: RenderRequest;
  
  // Tiers (Good / Better / Best)
  tiers: {
    good: TierPackage;
    better: TierPackage;
    best: TierPackage;
  };
  selectedTier: 'good' | 'better' | 'best';

  // Integrations & Dispatch Tracking
  ghlContactId?: string;
  ghlOpportunityId?: string;
  stripePaymentLink?: string;
  stripeDepositInvoiceId?: string;
  slackDispatched: boolean;
  smsDispatched: boolean;
  dispatchedAt?: string;
  dispatchedBy?: string; // Marcus Tate
  clientViewUrl?: string;
}

export interface IntegrationLog {
  id: string;
  proposalId: string;
  service: 'GHL' | 'Stripe' | 'Slack' | 'Twilio' | 'Jobber' | 'CompanyCam';
  event: string;
  status: 'success' | 'failed' | 'simulated';
  payload: Record<string, any>;
  response: Record<string, any>;
  timestamp: string;
}

export interface ExecutiveStats {
  averageTurnaroundHours: number; // e.g. 0.25 hrs (15 mins) vs 168 hrs (7 days)
  historicalTurnaroundDays: number; // 7.5 days
  totalProposalsGenerated: number;
  totalPipelineValue: number;
  wonRevenueRecovered: number;
  averageMarginPercent: number;
  carlosRenderQueueCount: number;
  activeLimboCleared: number;
}
