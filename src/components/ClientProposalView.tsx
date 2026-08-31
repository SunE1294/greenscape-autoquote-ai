'use client';

import React, { useState } from 'react';
import { Proposal } from '../types';
import { 
  Trees, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  Layers, 
  CreditCard,
  Download,
  Clock
} from 'lucide-react';

interface ClientProposalViewProps {
  proposal: Proposal;
}

export const ClientProposalView: React.FC<ClientProposalViewProps> = ({ proposal }) => {
  const [selectedTier, setSelectedTier] = useState<'good' | 'better' | 'best'>(proposal.selectedTier || 'better');
  const [isDeposited, setIsDeposited] = useState(proposal.status === 'deposit_paid');

  const currentPackage = proposal.tiers[selectedTier];
  const totalPrice = currentPackage.totalPrice;
  const depositPrice = currentPackage.depositAmount;

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Luxury Contractor Brand Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/40">
              <Trees className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">GREENSCAPE <span className="text-emerald-400">PRO</span></h1>
              <p className="text-xs text-slate-300">High-End Residential Outdoor Living · Phoenix, AZ</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-400" /> (602) 555-0199</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-emerald-400" /> proposals@greenscapepro.com</span>
              </div>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 inline-block">
              Official Proposal
            </span>
            <div className="text-xs text-slate-400 font-mono mt-1.5">ID: #{proposal.id}</div>
            <div className="text-xs text-slate-400">Prepared for: <strong>{proposal.leadName}</strong></div>
          </div>
        </div>

        {/* Hero Scope Overview */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <MapPin className="w-4 h-4" /> Project Location &amp; Scope Overview
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {proposal.propertyAddress}
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {proposal.summaryScope}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full HOA &amp; City Permit Handling</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Estimated Duration: <strong>{currentPackage.estimatedWeeks} Weeks</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Dedicated On-Site Crew Lead</span>
            </div>
          </div>
        </div>

        {/* 3-Tier Interactive Package Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Choose Your Outdoor Living Package
            </h3>
            <span className="text-xs text-slate-400">Select tier to customize your investment</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['good', 'better', 'best'] as const).map((tierKey) => {
              const pkg = proposal.tiers[tierKey];
              const isSelected = selectedTier === tierKey;
              const isRecommended = tierKey === 'better';

              return (
                <div
                  key={tierKey}
                  onClick={() => setSelectedTier(tierKey)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'glass-panel-glow border-emerald-500 shadow-xl shadow-emerald-950/60 scale-[1.02]'
                      : 'glass-panel border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-black">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{pkg.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <div className="text-2xl font-black text-white mt-2">
                      ${pkg.totalPrice.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mt-4 space-y-1.5 pt-3 border-t border-slate-800 text-xs text-slate-300">
                      {pkg.highlightedItems.map((h, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 text-xs flex justify-between text-slate-400">
                    <span>50% Deposit: <strong className="text-white">${pkg.depositAmount.toLocaleString()}</strong></span>
                    <span>Timeline: <strong className="text-white">{pkg.estimatedWeeks} Wks</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Detail Table */}
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Itemized Specifications &amp; Inclusions</h3>
            <p className="text-xs text-slate-400">Full transparent breakdown of materials, craft, and site preparation.</p>
          </div>

          <div className="divide-y divide-slate-800/80">
            {proposal.items.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white font-mono">
                    ${item.totalPrice.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.quantity} {item.unit} @ ${item.unitPrice}/{item.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & Deposit Bar */}
          <div className="bg-slate-900/90 p-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase">Total Investment</span>
              <div className="text-3xl font-black text-white">${totalPrice.toLocaleString()}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold uppercase">50% Deposit Due to Start</span>
                <div className="text-2xl font-black text-emerald-400">${depositPrice.toLocaleString()}</div>
              </div>

              {!isDeposited ? (
                <button
                  onClick={() => {
                    setIsDeposited(true);
                    alert(`Stripe Checkout Session Triggered: Processing $${depositPrice.toLocaleString()} deposit for ${proposal.leadName}. Project officially moved to Fulfillment!`);
                  }}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CreditCard className="w-4 h-4" />
                  Accept &amp; Pay Deposit
                </button>
              ) : (
                <div className="px-5 py-3 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Deposit Paid · Project Scheduled!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="text-center py-6 text-xs text-slate-400 space-y-1">
          <p>Greenscape Pro · ROC License #321984 · Bonded &amp; Insured in the State of Arizona</p>
          <p>Proposals valid for 30 days from presentation.</p>
        </div>
      </div>
    </div>
  );
};
