'use client';

import React, { useState } from 'react';
import { Proposal } from '@/lib/types';
import { 
  FileText, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  Eye, 
  Edit3,
  Flame
} from 'lucide-react';

interface ProposalsTableProps {
  proposals: Proposal[];
  onSelectProposal: (proposal: Proposal) => void;
}

export const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  onSelectProposal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = proposals.filter((p) => {
    const matchesSearch = 
      p.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Active Quotes &amp; Proposals Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full audit log of AI-generated scopes, Carlos 3D render queues, and client statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search client or address..."
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="sent_to_client">Sent to Client</option>
            <option value="deposit_paid">Deposit Paid</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Client &amp; Location</th>
              <th className="py-3.5 px-3">Total Value</th>
              <th className="py-3.5 px-3">Margin</th>
              <th className="py-3.5 px-3">Carlos 3D CAD</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Created</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((p) => {
              const formattedDate = new Date(p.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white text-xs">{p.leadName}</div>
                    <div className="text-[11px] text-slate-400">{p.propertyAddress}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-white text-xs">
                    ${p.totalPrice.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-mono">
                      {(p.grossMarginPercent * 100).toFixed(1)}%
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    {p.renderRequest.required ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        {p.renderRequest.status === 'completed' ? 'CAD Ready' : 'Carlos Queue'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">Standard 2D</span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                      p.status === 'approved' || p.status === 'sent_to_client'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        : p.status === 'deposit_paid'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    }`}>
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]">
                    {formattedDate}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => onSelectProposal(p)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 transition-colors"
                    >
                      Open Studio
                    </button>

                    <a
                      href={p.clientViewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 inline-flex text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                      title="Open Client Web View"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
