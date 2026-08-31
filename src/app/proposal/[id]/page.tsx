import React from 'react';
import { StorageAdapter } from '@/lib/db/supabase';
import { ClientProposalView } from '@/components/ClientProposalView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function PublicProposalPage({ params }: { params: { id: string } }) {
  if (!params || !params.id) {
    return notFound();
  }

  const proposal = await StorageAdapter.getProposalById(params.id);

  if (!proposal) {
    const list = await StorageAdapter.listProposals();
    const match = list.find((p) => p.id === params.id);
    if (!match) return notFound();
    return <ClientProposalView proposal={match} />;
  }

  return <ClientProposalView proposal={proposal} />;
}
