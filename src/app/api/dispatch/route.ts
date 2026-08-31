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

    const result = await executeMultiChannelDispatch({
      proposal,
      dispatchGhl,
      dispatchStripe,
      dispatchSlack,
      dispatchSms,
      dispatchedBy,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Dispatch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
