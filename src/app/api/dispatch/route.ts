import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { executeMultiChannelDispatch } from '@/lib/integrations/dispatcher';
import { StorageAdapter } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposal, dispatchGhl, dispatchStripe, dispatchSlack, dispatchSms, dispatchedBy, stripeSecretKey, supabaseKey } = body;

    if (!proposal || !proposal.id) {
      return NextResponse.json({ error: 'Valid proposal object is required for dispatch' }, { status: 400 });
    }

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'greenscape-autoquote-ai-09.vercel.app';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const appUrl = `${proto}://${host}`;

    // Execute multi-channel webhooks & Stripe session
    const result = await executeMultiChannelDispatch({
      proposal,
      dispatchGhl,
      dispatchStripe,
      dispatchSlack,
      dispatchSms,
      dispatchedBy,
      appUrl,
      stripeSecretKey,
    });

    // ACTIVE SUPABASE INSTANTIATION & INSERTION DIRECTLY IN API ROUTE
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fptuqhbzqehhjrclkwrg.supabase.co';
    const activeKey = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let dbSaved = false;
    let dbErrorMessage: string | null = null;

    if (activeKey && !activeKey.endsWith('...')) {
      try {
        const supabase = createClient(supabaseUrl, activeKey, {
          auth: { persistSession: false },
        });

        const proposalPayload = {
          id: result.proposal.id,
          lead_name: result.proposal.leadName,
          lead_email: result.proposal.leadEmail,
          lead_phone: result.proposal.leadPhone,
          property_address: result.proposal.propertyAddress,
          city: result.proposal.city || 'Phoenix, AZ',
          status: 'sent_to_client',
          raw_notes: result.proposal.rawNotes,
          summary_scope: result.proposal.summaryScope,
          site_constraints: result.proposal.siteConstraints || [],
          hoa_approval_required: result.proposal.hoaApprovalRequired ?? true,
          permit_required: result.proposal.permitRequired ?? true,
          subtotal_cost: result.proposal.subtotalCost,
          subtotal_price: result.proposal.subtotalPrice,
          total_cost: result.proposal.totalCost,
          total_price: result.proposal.totalPrice,
          gross_margin_percent: result.proposal.grossMarginPercent,
          is_margin_healthy: result.proposal.isMarginHealthy,
          deposit_required: result.proposal.depositRequired,
          render_required: result.proposal.renderRequest?.required || false,
          render_status: result.proposal.renderRequest?.status || 'not_required',
          render_details: result.proposal.renderRequest || {},
          tier_packages: result.proposal.tiers || {},
          selected_tier: result.proposal.selectedTier || 'better',
          stripe_payment_link: result.stripePaymentLink,
          stripe_deposit_invoice_id: result.stripeSessionId,
          slack_dispatched: true,
          sms_dispatched: true,
          dispatched_at: new Date().toISOString(),
          dispatched_by: dispatchedBy || 'Marcus Tate',
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('proposals').upsert([ proposalPayload ]).select();
        if (error) {
          console.error('Supabase Proposal Insert Error:', error);
          dbErrorMessage = error.message;
        } else {
          dbSaved = true;
        }

        // Active insert into proposal_items
        if (result.proposal.items && result.proposal.items.length > 0) {
          const itemsPayload = result.proposal.items.map((item, idx) => ({
            id: item.id || `item_${result.proposal.id}_${idx + 1}`,
            proposal_id: result.proposal.id,
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

          const { error: itemsError } = await supabase.from('proposal_items').upsert(itemsPayload);
          if (itemsError) console.error('Supabase Proposal Items Insert Error:', itemsError);
        }
      } catch (err: any) {
        console.error('Supabase direct client error:', err);
        dbErrorMessage = err.message;
      }
    }

    // Fail-safe storage write via PostgreSQL pooler if Supabase key was missing or errored
    if (!dbSaved) {
      const storageResult = await StorageAdapter.saveProposal(result.proposal, activeKey);
      if (storageResult.dbInserted) {
        dbSaved = true;
      } else if (!dbErrorMessage && storageResult.error) {
        dbErrorMessage = storageResult.error;
      }
    }

    return NextResponse.json({
      ...result,
      savedToDatabase: dbSaved,
      dbError: dbErrorMessage || undefined,
    });
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
