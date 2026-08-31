import React from 'react';
import { StorageAdapter } from '@/lib/db/supabase';
import { ClientProposalView } from '@/components/ClientProposalView';
import { notFound } from 'next/navigation';

export const revalidate = 0; // Dynamic route

export default async function PublicProposalPage({ params }: { params: { id: string } }) {
  const proposal = await StorageAdapter.getProposalById(params.id);

  if (!proposal) {
    // If not in database, attempt retrieval from memory seed
    const list = await StorageAdapter.listProposals();
    const match = list.find((p) => p.id === params.id);
    if (!match) return notFound();
    return <ClientProposalView proposal={match} />;
  }

  return <ClientProposalView proposal={proposal} />;
}
