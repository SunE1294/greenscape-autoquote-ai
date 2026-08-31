'use client';

import React, { useEffect, useState } from 'react';
import { Proposal } from '@/lib/types';
import { ClientProposalView } from '@/components/ClientProposalView';
import { Loader2 } from 'lucide-react';

export default function PublicProposalPage({ params }: { params: { id: string } }) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const id = params?.id;
        if (!id) return;
        const res = await fetch(`/api/proposals?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setProposal(data);
        }
      } catch (e) {
        console.error('Failed to load proposal:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070c18] flex flex-col items-center justify-center text-emerald-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-medium">Loading Greenscape Pro Proposal...</span>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#070c18] flex flex-col items-center justify-center text-slate-300 gap-4 p-4 text-center">
        <h2 className="text-xl font-bold text-white">Proposal Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm">
          The requested proposal ID may have expired or is still being finalized by Marcus Tate.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all"
        >
          Return to Dashboard
        </a>
      </div>
    );
  }

  return <ClientProposalView proposal={proposal} />;
}
