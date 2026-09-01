import { NextRequest, NextResponse } from 'next/server';
import { StorageAdapter } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const proposal = await StorageAdapter.getProposalById(id);
      if (!proposal) {
        return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
      }
      return NextResponse.json(proposal);
    }

    const proposals = await StorageAdapter.listProposals();
    return NextResponse.json(proposals);
  } catch (error: any) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const saveResult = await StorageAdapter.saveProposal(body);
    return NextResponse.json({
      success: true,
      proposal: body,
      savedToDatabase: saveResult.dbInserted,
      dbError: saveResult.error,
    });
  } catch (error: any) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
