import { NextRequest, NextResponse } from 'next/server';
import { extractProposalFromNotes } from '@/lib/ai/extractor';
import { StorageAdapter } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadName, leadEmail, leadPhone, propertyAddress, city, rawNotes, apiKey, model } = body;

    if (!leadName || !propertyAddress || !rawNotes) {
      return NextResponse.json(
        { error: 'Missing required fields: leadName, propertyAddress, and rawNotes are required.' },
        { status: 400 }
      );
    }

    const result = await extractProposalFromNotes({
      leadName,
      leadEmail,
      leadPhone,
      propertyAddress,
      city,
      rawNotes,
      apiKey,
      model,
    });

    // Save to persistent database
    const saveResult = await StorageAdapter.saveProposal(result.proposal);

    return NextResponse.json({
      ...result,
      savedToDatabase: saveResult.dbInserted,
      dbError: saveResult.error,
      proposalId: saveResult.id,
    });
  } catch (error: any) {
    console.error('API Error generating proposal:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error while generating proposal' },
      { status: 500 }
    );
  }
}
