import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Proposal, IntegrationLog, ExecutiveStats } from '@/lib/types';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (url && key && !url.includes('your-project-id') && key !== 'your-supabase-anon-key-here') {
    try {
      supabaseClient = createClient(url, key, {
        auth: { persistSession: false },
      });
      return supabaseClient;
    } catch (e) {
      console.warn('Could not initialize Supabase client:', e);
    }
  }
  return null;
}

export function isDatabaseConnected(): boolean {
  return getSupabase() !== null;
}

// In-Memory / Global Fallback Cache
const globalMemoryStore = {
  proposals: new Map<string, Proposal>(),
  logs: [] as IntegrationLog[],
};

// Seed realistic historical sample proposals
export function seedInitialData() {
  if (globalMemoryStore.proposals.size > 0) return;

  const initialSamples: Proposal[] = [
    {
      id: 'prop_arcadia_01',
      leadName: 'David & Sarah Miller',
      leadEmail: 'david.miller@azluxuryhomes.com',
      leadPhone: '(602) 555-0144',
      propertyAddress: '4820 E Camelback Rd, Arcadia, Phoenix, AZ 85018',
      city: 'Phoenix, AZ',
      status: 'approved',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
      rawNotes: 'Site walk notes 8/28. Miller residence. Need 850 sq ft French pattern travertine around existing pool. Install 14x18 custom Western Red cedar pergola with fan beam and stain. Build 48" gas fire pit with stucco to match house exterior. Add 500 sq ft ProGreen pet turf on north side. 10 LED solid brass low voltage lights on timer. HOA in Arcadia requires full 3D elevations. Target install mid-October.',
      summaryScope: 'Full outdoor living retreat featuring 850 sq ft French Pattern travertine decking, a 14x18 custom Cedar pergola, 48" gas fire pit, pet turf lawn, and low-voltage architectural lighting package.',
      siteConstraints: ['Arcadia HOA board review submittal required', 'Blue-Stake gas line marking needed before fire pit trenching', '48" gate access on west side'],
      hoaApprovalRequired: true,
      permitRequired: true,
      items: [
        {
          id: 'item_1',
          catalogItemId: 'demo-existing-concrete-soil',
          category: 'Demolition & Excavation',
          name: 'Site Demolition, Bobcat Excavation & Haul-Away',
          description: 'Demo old concrete walkway, grading for travertine base, haul 15 yards to dumpster.',
          quantity: 1,
          unit: 'allowance',
          unitCost: 1800,
          unitPrice: 2850,
          totalCost: 1800,
          totalPrice: 2850,
          margin: 0.368,
        },
        {
          id: 'item_2',
          catalogItemId: 'paver-travertine-tumbled',
          category: 'Hardscape',
          name: 'Premium Tumbled Travertine Pool Deck (French Pattern)',
          description: '850 sq ft tumbled French pattern travertine over 4" compacted base and dry-set sand bed.',
          quantity: 850,
          unit: 'sq_ft',
          unitCost: 14,
          unitPrice: 24,
          totalCost: 11900,
          totalPrice: 20400,
          margin: 0.417,
        },
        {
          id: 'item_3',
          catalogItemId: 'pergola-custom-cedar-14x18',
          category: 'Pergola & Shade',
          name: 'Custom Western Red Cedar Timber Pergola (14x18 ft)',
          description: '6x6 cedar posts, notched rafters, steel concrete footers, pre-stained.',
          quantity: 1,
          unit: 'unit',
          unitCost: 7400,
          unitPrice: 12500,
          totalCost: 7400,
          totalPrice: 12500,
          margin: 0.408,
        },
        {
          id: 'item_4',
          catalogItemId: 'fire-custom-gas-firepit',
          category: 'Fire & Water Features',
          name: 'Custom 48" Natural Gas Fire Pit (Block & Stucco)',
          description: '150k BTU brass burner, lava rock, travertine cap, connection to gas stub.',
          quantity: 1,
          unit: 'unit',
          unitCost: 2200,
          unitPrice: 3800,
          totalCost: 2200,
          totalPrice: 3800,
          margin: 0.421,
        },
        {
          id: 'item_5',
          catalogItemId: 'turf-pet-deluxe-80oz',
          category: 'Turf & Putting Green',
          name: 'ProGreen 80oz Artificial Turf',
          description: '500 sq ft heat-deflecting turf with antimicrobial pet infill.',
          quantity: 500,
          unit: 'sq_ft',
          unitCost: 5.2,
          unitPrice: 9.5,
          totalCost: 2600,
          totalPrice: 4750,
          margin: 0.453,
        },
        {
          id: 'item_6',
          catalogItemId: 'lighting-led-path-spot-system',
          category: 'Lighting',
          name: 'Architectural LED Landscape Lighting Package',
          description: '10 solid brass up/path lights + 300W transformer with astronomic timer.',
          quantity: 1,
          unit: 'unit',
          unitCost: 1650,
          unitPrice: 2950,
          totalCost: 1650,
          totalPrice: 2950,
          margin: 0.441,
        },
        {
          id: 'item_7',
          catalogItemId: 'permit-phoenix-hoa-package',
          category: 'Permits & Engineering',
          name: 'Phoenix HOA & City Permit Package',
          description: 'Structural engineering seal for shade cover, permit filing, HOA packet.',
          quantity: 1,
          unit: 'unit',
          unitCost: 650,
          unitPrice: 1150,
          totalCost: 650,
          totalPrice: 1150,
          margin: 0.435,
        }
      ],
      subtotalCost: 28200,
      subtotalPrice: 48400,
      totalCost: 28200,
      totalPrice: 48400,
      grossMarginPercent: 0.417,
      isMarginHealthy: true,
      depositRequired: 24200,
      renderRequest: {
        required: true,
        reason: 'Project value ($48,400) exceeds $30,000 threshold. High-ticket custom cedar pergola and travertine pool remodel requires Carlos Reyes 3D CAD render.',
        suggestedViews: ['Aerial 3D Master Plan', 'Pergola & Fire Pit Twilight', 'Pool Deck French Pattern Layout'],
        designBrief: 'Carlos: Render 14x18 cedar pergola over travertine patio. Emphasize fire pit evening glow and 10 brass LED accent lights against existing pool edge.',
        assignedTo: 'Carlos Reyes (Lead Designer)',
        status: 'completed',
        deadlineEstimate: '48 hours'
      },
      tiers: {
        good: {
          tier: 'good',
          name: 'Essential Outdoor Package',
          description: 'Belgard paver patio with standard pergola and turf.',
          totalPrice: 36300,
          depositAmount: 18150,
          estimatedWeeks: 2,
          highlightedItems: ['Belgard Pavers', 'Alumawood Pergola', 'Standard Turf']
        },
        better: {
          tier: 'better',
          name: 'Signature Living Package (Selected)',
          description: 'French pattern travertine, custom Cedar pergola, gas fire pit, and lighting.',
          totalPrice: 48400,
          depositAmount: 24200,
          estimatedWeeks: 3,
          highlightedItems: ['French Pattern Travertine', 'Custom Cedar Pergola', 'Custom Gas Fire Pit', 'ProGreen Turf', 'Solid Brass LED Lighting']
        },
        best: {
          tier: 'best',
          name: 'Resort Luxury Masterpiece',
          description: 'Adds 10ft BBQ kitchen island and sheer descent water wall.',
          totalPrice: 65340,
          depositAmount: 32670,
          estimatedWeeks: 5,
          highlightedItems: ['Everything in Signature', '10ft BBQ Island + Blaze Grill', 'Sheer Water Feature', 'Specimen Date Palms']
        }
      },
      selectedTier: 'better',
      stripePaymentLink: 'https://buy.stripe.com/test_greenscape_deposit_48400',
      slackDispatched: true,
      smsDispatched: true,
      dispatchedAt: new Date(Date.now() - 3600 * 1000 * 24 * 1).toISOString(),
      dispatchedBy: 'Marcus Tate',
      clientViewUrl: '/proposal/prop_arcadia_01'
    }
  ];

  initialSamples.forEach(p => globalMemoryStore.proposals.set(p.id, p));
}

// Initial auto-seed
seedInitialData();

export interface SaveProposalResult {
  success: boolean;
  id: string;
  dbInserted: boolean;
  error?: string;
}

export const StorageAdapter = {
  async saveProposal(proposal: Proposal): Promise<SaveProposalResult> {
    const supabase = getSupabase();
    let dbInserted = false;
    let dbError: string | undefined = undefined;

    if (supabase) {
      try {
        // 1. Real SQL / Supabase INSERT/UPSERT into `proposals` table
        const { error: proposalError } = await supabase.from('proposals').upsert({
          id: proposal.id,
          lead_name: proposal.leadName,
          lead_email: proposal.leadEmail,
          lead_phone: proposal.leadPhone,
          property_address: proposal.propertyAddress,
          city: proposal.city || 'Phoenix, AZ',
          status: proposal.status,
          raw_notes: proposal.rawNotes,
          summary_scope: proposal.summaryScope,
          site_constraints: proposal.siteConstraints || [],
          hoa_approval_required: proposal.hoaApprovalRequired ?? true,
          permit_required: proposal.permitRequired ?? true,
          subtotal_cost: proposal.subtotalCost,
          subtotal_price: proposal.subtotalPrice,
          total_cost: proposal.totalCost,
          total_price: proposal.totalPrice,
          gross_margin_percent: proposal.grossMarginPercent,
          is_margin_healthy: proposal.isMarginHealthy,
          deposit_required: proposal.depositRequired,
          render_required: proposal.renderRequest?.required || false,
          render_status: proposal.renderRequest?.status || 'not_required',
          render_details: proposal.renderRequest || {},
          tier_packages: proposal.tiers || {},
          selected_tier: proposal.selectedTier || 'better',
          stripe_payment_link: proposal.stripePaymentLink,
          stripe_deposit_invoice_id: proposal.stripeDepositInvoiceId,
          slack_dispatched: proposal.slackDispatched || false,
          sms_dispatched: proposal.smsDispatched || false,
          dispatched_at: proposal.dispatchedAt,
          dispatched_by: proposal.dispatchedBy,
          updated_at: new Date().toISOString(),
        });

        if (proposalError) {
          console.error('Supabase proposals table upsert error:', proposalError);
          dbError = proposalError.message;
        } else {
          dbInserted = true;
        }

        // 2. Real SQL / Supabase INSERT/UPSERT into `proposal_items` table
        if (proposal.items && proposal.items.length > 0) {
          const lineItems = proposal.items.map((item, idx) => ({
            id: item.id || `item_${proposal.id}_${idx + 1}`,
            proposal_id: proposal.id,
            catalog_item_id: item.catalogItemId || null,
            category: item.category || 'Hardscape',
            name: item.name,
            description: item.description || '',
            quantity: item.quantity,
            unit: item.unit || 'unit',
            unit_cost: item.unitCost,
            unit_price: item.unitPrice,
            total_cost: item.totalCost,
            total_price: item.totalPrice,
            margin: item.margin,
            tier: item.tier || 'better',
          }));

          const { error: itemsError } = await supabase.from('proposal_items').upsert(lineItems);
          if (itemsError) {
            console.error('Supabase proposal_items table upsert error:', itemsError);
            dbError = (dbError ? dbError + '; ' : '') + itemsError.message;
          }
        }

        // 3. Real SQL / Supabase INSERT/UPSERT into `render_requests` table (if Carlos render needed)
        if (proposal.renderRequest && proposal.renderRequest.required) {
          const { error: renderError } = await supabase.from('render_requests').upsert({
            id: `render_${proposal.id}`,
            proposal_id: proposal.id,
            assigned_to: proposal.renderRequest.assignedTo || 'Carlos Reyes (Lead Designer)',
            reason: proposal.renderRequest.reason,
            suggested_views: proposal.renderRequest.suggestedViews || [],
            design_brief: proposal.renderRequest.designBrief,
            status: proposal.renderRequest.status || 'pending',
            deadline_estimate: proposal.renderRequest.deadlineEstimate || '48 hours',
          });
          if (renderError) {
            console.error('Supabase render_requests table upsert error:', renderError);
          }
        }
      } catch (e: any) {
        console.error('Exception writing to Supabase database:', e);
        dbError = e.message;
      }
    } else {
      console.warn('Supabase credentials not detected; using in-memory store.');
    }

    // Always keep memory store updated for instantaneous UI feedback
    globalMemoryStore.proposals.set(proposal.id, proposal);

    return {
      success: true,
      id: proposal.id,
      dbInserted,
      error: dbError,
    };
  },

  async getProposalById(id: string): Promise<Proposal | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, proposal_items(*)')
          .eq('id', id)
          .single();

        if (data && !error) {
          return {
            id: data.id,
            leadName: data.lead_name,
            leadEmail: data.lead_email,
            leadPhone: data.lead_phone,
            propertyAddress: data.property_address,
            city: data.city,
            status: data.status,
            rawNotes: data.raw_notes,
            summaryScope: data.summary_scope,
            siteConstraints: data.site_constraints || [],
            hoaApprovalRequired: data.hoa_approval_required,
            permitRequired: data.permit_required,
            items: (data.proposal_items || []).map((item: any) => ({
              id: item.id,
              catalogItemId: item.catalog_item_id,
              category: item.category,
              name: item.name,
              description: item.description,
              quantity: Number(item.quantity),
              unit: item.unit,
              unitCost: Number(item.unit_cost),
              unitPrice: Number(item.unit_price),
              totalCost: Number(item.total_cost),
              totalPrice: Number(item.total_price),
              margin: Number(item.margin),
              tier: item.tier,
            })),
            subtotalCost: Number(data.subtotal_cost),
            subtotalPrice: Number(data.subtotal_price),
            totalCost: Number(data.total_cost),
            totalPrice: Number(data.total_price),
            grossMarginPercent: Number(data.gross_margin_percent),
            isMarginHealthy: data.is_margin_healthy,
            depositRequired: Number(data.deposit_required),
            renderRequest: data.render_details || { required: false, status: 'not_required' },
            tiers: data.tier_packages,
            selectedTier: data.selected_tier || 'better',
            stripePaymentLink: data.stripe_payment_link,
            stripeDepositInvoiceId: data.stripe_deposit_invoice_id,
            slackDispatched: data.slack_dispatched,
            smsDispatched: data.sms_dispatched,
            dispatchedAt: data.dispatched_at,
            dispatchedBy: data.dispatched_by,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            clientViewUrl: `/proposal/${data.id}`,
          };
        }
      } catch (e) {
        console.warn('Supabase query error:', e);
      }
    }
    return globalMemoryStore.proposals.get(id) || null;
  },

  async listProposals(): Promise<Proposal[]> {
    seedInitialData();
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('proposals')
          .select('*, proposal_items(*)')
          .order('created_at', { ascending: false });

        if (data && data.length > 0 && !error) {
          const dbProposals: Proposal[] = data.map((row: any) => ({
            id: row.id,
            leadName: row.lead_name,
            leadEmail: row.lead_email,
            leadPhone: row.lead_phone,
            propertyAddress: row.property_address,
            city: row.city,
            status: row.status,
            rawNotes: row.raw_notes,
            summaryScope: row.summary_scope,
            siteConstraints: row.site_constraints || [],
            hoaApprovalRequired: row.hoa_approval_required,
            permitRequired: row.permit_required,
            items: (row.proposal_items || []).map((item: any) => ({
              id: item.id,
              catalogItemId: item.catalog_item_id,
              category: item.category,
              name: item.name,
              description: item.description,
              quantity: Number(item.quantity),
              unit: item.unit,
              unitCost: Number(item.unit_cost),
              unitPrice: Number(item.unit_price),
              totalCost: Number(item.total_cost),
              totalPrice: Number(item.total_price),
              margin: Number(item.margin),
              tier: item.tier,
            })),
            subtotalCost: Number(row.subtotal_cost),
            subtotalPrice: Number(row.subtotal_price),
            totalCost: Number(row.total_cost),
            totalPrice: Number(row.total_price),
            grossMarginPercent: Number(row.gross_margin_percent),
            isMarginHealthy: row.is_margin_healthy,
            depositRequired: Number(row.deposit_required),
            renderRequest: row.render_details || { required: false, status: 'not_required' },
            tiers: row.tier_packages,
            selectedTier: row.selected_tier || 'better',
            stripePaymentLink: row.stripe_payment_link,
            stripeDepositInvoiceId: row.stripe_deposit_invoice_id,
            slackDispatched: row.slack_dispatched,
            smsDispatched: row.sms_dispatched,
            dispatchedAt: row.dispatched_at,
            dispatchedBy: row.dispatched_by,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            clientViewUrl: `/proposal/${row.id}`,
          }));

          dbProposals.forEach(p => globalMemoryStore.proposals.set(p.id, p));
          return dbProposals;
        }
      } catch (e) {
        console.warn('Supabase list error:', e);
      }
    }
    return Array.from(globalMemoryStore.proposals.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async logIntegration(log: IntegrationLog): Promise<void> {
    globalMemoryStore.logs.unshift(log);
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('integrations_log').insert({
          id: log.id,
          proposal_id: log.proposalId,
          service: log.service,
          event: log.event,
          status: log.status,
          payload: log.payload,
          response: log.response,
          timestamp: log.timestamp,
        });
      } catch (e) {
        console.warn('Supabase integration log warning:', e);
      }
    }
  },

  async getExecutiveStats(): Promise<ExecutiveStats> {
    const list = await this.listProposals();
    const totalPipelineValue = list.reduce((acc, p) => acc + p.totalPrice, 0);
    const wonList = list.filter(p => p.status === 'approved' || p.status === 'deposit_paid');
    const wonRevenueRecovered = wonList.reduce((acc, p) => acc + p.totalPrice, 0);
    const avgMargin = list.length > 0
      ? Number((list.reduce((acc, p) => acc + p.grossMarginPercent, 0) / list.length).toFixed(3))
      : 0.405;
    const carlosCount = list.filter(p => p.renderRequest.required && p.renderRequest.status !== 'completed').length;

    return {
      averageTurnaroundHours: 0.25,
      historicalTurnaroundDays: 7.5,
      totalProposalsGenerated: list.length,
      totalPipelineValue,
      wonRevenueRecovered,
      averageMarginPercent: avgMargin,
      carlosRenderQueueCount: carlosCount,
      activeLimboCleared: 11,
    };
  }
};
