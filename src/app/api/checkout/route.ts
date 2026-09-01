import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { StorageAdapter } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposalId, leadName, leadEmail, propertyAddress, depositAmount, totalPrice, selectedTier, stripeSecretKey } = body;

    const stripeKey = stripeSecretKey || process.env.STRIPE_SECRET_KEY;

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'greenscape-autoquote-ai-09.vercel.app';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = `${proto}://${host}`;

    const amountInCents = Math.round(Number(depositAmount || 0) * 100);

    if (stripeKey && (stripeKey.startsWith('sk_test_') || stripeKey.startsWith('sk_live_'))) {
      try {
        const stripe = new Stripe(stripeKey, {
          apiVersion: '2023-10-16' as any,
          typescript: true,
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'usd',
                unit_amount: amountInCents,
                product_data: {
                  name: `50% Project Deposit - ${leadName || 'Homeowner'}`,
                  description: `Greenscape Pro Outdoor Living (Proposal #${proposalId || 'custom'}) for ${propertyAddress || 'Phoenix, AZ'}`,
                },
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          customer_email: leadEmail && leadEmail.includes('@') ? leadEmail : undefined,
          client_reference_id: proposalId,
          metadata: {
            proposal_id: proposalId || '',
            lead_name: leadName || '',
            selected_tier: selectedTier || 'better',
            total_price: String(totalPrice || ''),
            deposit_amount: String(depositAmount || ''),
          },
          success_url: `${baseUrl}/proposal/${proposalId}?deposit=success&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/proposal/${proposalId}?deposit=cancelled`,
        });

        if (session && session.url) {
          // Update proposal in DB with new stripe link
          if (proposalId) {
            const existing = await StorageAdapter.getProposalById(proposalId);
            if (existing) {
              existing.stripePaymentLink = session.url;
              existing.stripeDepositInvoiceId = session.id;
              await StorageAdapter.saveProposal(existing);
            }
          }

          return NextResponse.json({
            success: true,
            url: session.url,
            sessionId: session.id,
            isLiveStripe: true,
          });
        }
      } catch (stripeErr: any) {
        console.error('Stripe API error creating session:', stripeErr);
        return NextResponse.json({
          success: false,
          error: stripeErr.message || 'Stripe API Error',
        }, { status: 400 });
      }
    }

    // If no Stripe Secret Key configured yet in Vercel
    return NextResponse.json({
      success: false,
      requiresKey: true,
      error: 'STRIPE_SECRET_KEY is not configured in Vercel Environment Variables. Please add your Stripe Secret Key to enable live Stripe redirection.',
      fallbackUrl: `${baseUrl}/proposal/${proposalId}?deposit=demo_checkout&amount=${depositAmount}`,
    });
  } catch (error: any) {
    console.error('Checkout endpoint exception:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
