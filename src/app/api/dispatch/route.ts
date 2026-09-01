import { NextRequest, NextResponse } from 'next/server';
import { executeMultiChannelDispatch } from '@/lib/integrations/dispatcher';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { proposal, dispatchGhl, dispatchStripe, dispatchSlack, dispatchSms, dispatchedBy } = body;

    if (!proposal || !proposal.id) {
      return NextResponse.json({ error: 'Valid proposal object is required for dispatch' }, { status: 400 });
    }

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'greenscape-autoquote-ai-09.vercel.app';
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    const appUrl = `${proto}://${host}`;

    const result = await executeMultiChannelDispatch({
      proposal,
      dispatchGhl,
      dispatchStripe,
      dispatchSlack,
      dispatchSms,
      dispatchedBy,
      appUrl,
      stripeSecretKey: body.stripeSecretKey,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
