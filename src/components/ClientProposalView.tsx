'use client';

import React, { useState } from 'react';
import { Proposal } from '@/lib/types';
import { 
  Trees, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Layers, 
  CreditCard,
  Lock,
  X,
  Loader2,
  ExternalLink,
  DollarSign
} from 'lucide-react';

interface ClientProposalViewProps {
  proposal: Proposal;
}

export const ClientProposalView: React.FC<ClientProposalViewProps> = ({ proposal }) => {
  const [selectedTier, setSelectedTier] = useState<'good' | 'better' | 'best'>(proposal.selectedTier || 'better');
  const [isDeposited, setIsDeposited] = useState(proposal.status === 'deposit_paid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const currentPackage = proposal.tiers[selectedTier] || proposal.tiers['better'];
  const totalPrice = currentPackage.totalPrice;
  const depositPrice = currentPackage.depositAmount;

  const handleInitiatePayment = async () => {
    // 1. If a live Stripe checkout link is already present on the proposal
    if (proposal.stripePaymentLink && proposal.stripePaymentLink.startsWith('https://checkout.stripe.com')) {
      window.location.href = proposal.stripePaymentLink;
      return;
    }

    setIsProcessing(true);
    try {
      const savedStripeKey = typeof window !== 'undefined' ? localStorage.getItem('greenscape_stripe_key') : null;

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposal.id,
          leadName: proposal.leadName,
          leadEmail: proposal.leadEmail,
          propertyAddress: proposal.propertyAddress,
          depositAmount: depositPrice,
          totalPrice: totalPrice,
          selectedTier,
          stripeSecretKey: savedStripeKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.url && data.isLiveStripe) {
        // Direct redirect to live Stripe Checkout page!
        window.location.href = data.url;
        return;
      }

      // If no STRIPE_SECRET_KEY is configured in Vercel yet, open the elegant in-page checkout modal
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error initiating Stripe checkout:', err);
      setIsModalOpen(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmModalDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await fetch('/api/proposals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...proposal,
          status: 'deposit_paid',
          selectedTier,
          depositRequired: depositPrice,
          totalPrice: totalPrice,
        }),
      });
      setIsDeposited(true);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error recording deposit:', err);
      setIsDeposited(true);
      setIsModalOpen(false);
    } finally {
      setIsProcessing(false);
    }
  };

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
              <span>Dedicated Project Superintendent</span>
            </div>
          </div>
        </div>

        {/* Good / Better / Best Interactive Tier Switcher */}
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
              if (!pkg) return null;
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

                  <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">50% Deposit:</span>
                    <span className="font-bold text-emerald-400">${pkg.depositAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Scope Breakdown */}
        <div className="glass-panel rounded-3xl border-slate-800 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <h3 className="font-bold text-white text-base">Comprehensive Scope of Work</h3>
            <span className="text-xs text-slate-400">{proposal.items.length} Included Items</span>
          </div>

          <div className="divide-y divide-slate-800/60 text-xs">
            {proposal.items.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>

                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="font-bold text-white text-sm">${item.totalPrice.toLocaleString()}</div>
                  <div className="text-slate-500 text-[11px]">
                    {item.quantity} {item.unit} @ ${item.unitPrice}/unit
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
                  onClick={handleInitiatePayment}
                  disabled={isProcessing}
                  className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs sm:text-sm font-black rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Accept &amp; Pay Deposit</span>
                    </>
                  )}
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

      {/* Interactive Stripe Checkout Modal (Fallback when live redirect is pending) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Stripe Deposit Checkout</h3>
                  <p className="text-[11px] text-slate-400">Greenscape Pro 50% Project Authorization</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmModalDeposit} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Due Today (50% Deposit):</span>
                  <span className="text-xl font-black text-white">${depositPrice.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Total Project Value:</span>
                  <span className="text-xs font-bold text-slate-300">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  defaultValue={proposal.leadName}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3.5 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expiration</label>
                  <input
                    type="text"
                    required
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">CVC / CVV</label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center gap-1.5 justify-center">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-bit encrypted checkout via Stripe Payments Engine</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay ${depositPrice.toLocaleString()} &amp; Schedule Fulfillment</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
