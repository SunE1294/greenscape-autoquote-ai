'use client';

import React, { useState } from 'react';
import { Proposal, IntegrationLog } from '@/lib/types';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  MessageSquare, 
  DollarSign, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
  onDispatchComplete: (updatedProposal: Proposal, logs: IntegrationLog[]) => void;
  onResetAndNewProposal?: () => void;
}

export const ProposalDispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  proposal,
  onDispatchComplete,
  onResetAndNewProposal,
}) => {
  const [dispatchGhl, setDispatchGhl] = useState(true);
  const [dispatchStripe, setDispatchStripe] = useState(true);
  const [dispatchSlack, setDispatchSlack] = useState(true);
  const [dispatchSms, setDispatchSms] = useState(true);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  if (!isOpen) return null;

  const handleExecuteDispatch = async () => {
    setIsDispatching(true);
    try {
      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal,
          dispatchGhl,
          dispatchStripe,
          dispatchSlack,
          dispatchSms,
          dispatchedBy: 'Marcus Tate',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResultData(data);
        setDispatchSuccess(true);
        onDispatchComplete(data.proposal, data.logs);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                1-Click Multi-Channel Approval Dispatch
              </h2>
              <p className="text-xs text-slate-400">
                Push approved proposal to GHL CRM, Stripe 50% deposit, Slack, and client SMS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {!dispatchSuccess ? (
            <>
              {/* Proposal Summary Pill */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Recipient:</span>
                  <div className="text-sm font-bold text-white">{proposal.leadName}</div>
                  <div className="text-xs text-slate-400">{proposal.propertyAddress}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Approved Total:</span>
                  <div className="text-lg font-black text-emerald-400">${proposal.totalPrice.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400 font-mono">50% Dep: ${proposal.depositRequired.toLocaleString()}</span>
                </div>
              </div>

              {/* Channels Selector */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Automated Dispatch Channels:
                </span>

                {/* 1. GHL CRM */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dispatchGhl}
                    onChange={(e) => setDispatchGhl(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      GoHighLevel (GHL) Contact & Opportunity Sync
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Updates pipeline stage to &quot;Proposal Sent&quot; with ${proposal.totalPrice.toLocaleString()} value and attaches PDF scope.
                    </p>
                  </div>
                </label>

                {/* 2. Stripe Deposit Link */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dispatchStripe}
                    onChange={(e) => setDispatchStripe(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Stripe 50% Deposit Payment Link Generator
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Generates secure checkout link for ${proposal.depositRequired.toLocaleString()} (50% upfront deposit).
                    </p>
                  </div>
                </label>

                {/* 3. Slack Channel */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dispatchSlack}
                    onChange={(e) => setDispatchSlack(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Slack Team Alert (#proposals-ready &amp; #carlos-cad-queue)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Notifies Marcus &amp; Jenna. {proposal.renderRequest.required ? 'Automatically alerts Carlos Reyes for 3D CAD design.' : ''}
                    </p>
                  </div>
                </label>

                {/* 4. Twilio SMS */}
                <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={dispatchSms}
                    onChange={(e) => setDispatchSms(e.target.checked)}
                    className="mt-1 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      Client Instant SMS Notification (Marcus Voice)
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sends personalized text to {proposal.leadPhone} with link to client proposal landing page.
                    </p>
                  </div>
                </label>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-950 text-emerald-400 border border-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/60">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Proposal Dispatched Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  All channels synchronized in real-time. Client has received SMS and Stripe deposit checkout link.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                    ID: {proposal.id}
                  </span>
                  {resultData?.savedToDatabase ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/50 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Supabase DB Row Synced
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800/50">
                      ✓ Saved to Persistence Engine
                    </span>
                  )}
                </div>
              </div>

              {resultData?.stripePaymentLink && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left text-xs">
                  <span className="text-slate-400 font-semibold">Live Stripe Deposit URL:</span>
                  <div className="font-mono text-emerald-400 break-all text-[11px] mt-1">
                    {resultData.stripePaymentLink}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {dispatchSuccess ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Stay on this Proposal
              </button>

              <button
                onClick={() => {
                  if (onResetAndNewProposal) {
                    onResetAndNewProposal();
                  } else {
                    onClose();
                  }
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Done &amp; Create New Proposal</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleExecuteDispatch}
                disabled={isDispatching}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isDispatching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Dispatching Webhooks &amp; DB...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm &amp; Dispatch Channels</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
