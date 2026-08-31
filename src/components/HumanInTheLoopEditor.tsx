'use client';

import React, { useState } from 'react';
import { 
  Proposal, 
  ProposalLineItem, 
  PricingCatalogItem 
} from '@/lib/types';
import { GREENSCAPE_PRICING_CATALOG } from '@/lib/pricingCatalog';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Plus, 
  Trash2, 
  Send, 
  ExternalLink, 
  Layers, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';

interface HumanInTheLoopEditorProps {
  proposal: Proposal;
  onUpdateProposal: (updated: Proposal) => void;
  onOpenDispatchModal: () => void;
}

export const HumanInTheLoopEditor: React.FC<HumanInTheLoopEditorProps> = ({
  proposal,
  onUpdateProposal,
  onOpenDispatchModal,
}) => {
  const [activeTier, setActiveTier] = useState<'good' | 'better' | 'best'>(proposal.selectedTier || 'better');
  const [editingBrief, setEditingBrief] = useState(false);
  const [briefText, setBriefText] = useState(proposal.renderRequest.designBrief);

  // Recalculate financial totals dynamically
  const updateLineItem = (index: number, updates: Partial<ProposalLineItem>) => {
    const updatedItems = [...proposal.items];
    const current = updatedItems[index];
    const updated: ProposalLineItem = { ...current, ...updates };

    // Recompute total cost, total price, and margin
    updated.totalCost = Number((updated.quantity * updated.unitCost).toFixed(2));
    updated.totalPrice = Number((updated.quantity * updated.unitPrice).toFixed(2));
    updated.margin = updated.totalPrice > 0 
      ? Number(((updated.totalPrice - updated.totalCost) / updated.totalPrice).toFixed(3)) 
      : 0;

    updatedItems[index] = updated;
    recalculateProposal(updatedItems);
  };

  const deleteLineItem = (index: number) => {
    const updatedItems = proposal.items.filter((_, i) => i !== index);
    recalculateProposal(updatedItems);
  };

  const addCatalogItem = (catalogItem: PricingCatalogItem) => {
    const newItem: ProposalLineItem = {
      id: 'item_' + (proposal.items.length + 1),
      catalogItemId: catalogItem.id,
      category: catalogItem.category,
      name: catalogItem.name,
      description: catalogItem.description,
      quantity: 1,
      unit: catalogItem.unit,
      unitCost: catalogItem.baseCost,
      unitPrice: catalogItem.defaultRetailPrice,
      totalCost: catalogItem.baseCost,
      totalPrice: catalogItem.defaultRetailPrice,
      margin: catalogItem.margin,
    };
    recalculateProposal([...proposal.items, newItem]);
  };

  const recalculateProposal = (items: ProposalLineItem[]) => {
    const subtotalCost = Number(items.reduce((acc, i) => acc + i.totalCost, 0).toFixed(2));
    const subtotalPrice = Number(items.reduce((acc, i) => acc + i.totalPrice, 0).toFixed(2));
    const grossMarginPercent = subtotalPrice > 0 
      ? Number(((subtotalPrice - subtotalCost) / subtotalPrice).toFixed(3)) 
      : 0;
    const isMarginHealthy = grossMarginPercent >= 0.38;

    const isOver30k = subtotalPrice >= 30000;
    const renderRequest = {
      ...proposal.renderRequest,
      required: isOver30k,
      status: isOver30k ? proposal.renderRequest.status : 'not_required',
      designBrief: briefText,
    };

    const goodTotal = Number((subtotalPrice * 0.75).toFixed(2));
    const bestTotal = Number((subtotalPrice * 1.35).toFixed(2));

    const updated: Proposal = {
      ...proposal,
      items,
      subtotalCost,
      subtotalPrice,
      totalCost: subtotalCost,
      totalPrice: subtotalPrice,
      grossMarginPercent,
      isMarginHealthy,
      depositRequired: Number((subtotalPrice * 0.5).toFixed(2)),
      renderRequest,
      tiers: {
        good: {
          ...proposal.tiers.good,
          totalPrice: goodTotal,
          depositAmount: Number((goodTotal * 0.5).toFixed(2)),
        },
        better: {
          ...proposal.tiers.better,
          totalPrice: subtotalPrice,
          depositAmount: Number((subtotalPrice * 0.5).toFixed(2)),
        },
        best: {
          ...proposal.tiers.best,
          totalPrice: bestTotal,
          depositAmount: Number((bestTotal * 0.5).toFixed(2)),
        },
      },
      selectedTier: activeTier,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProposal(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Founder Review & Status */}
      <div className="glass-panel-glow p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              Human-In-The-Loop Approval Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">#{proposal.id}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            {proposal.leadName} · Proposal Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            📍 {proposal.propertyAddress} · Phoenix Metro
          </p>
        </div>

        {/* 1-Click Multi-Channel Dispatch Trigger */}
        <div className="flex items-center gap-3">
          <a
            href={proposal.clientViewUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Client View
          </a>

          <button
            onClick={onOpenDispatchModal}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Approve & 1-Click Dispatch
          </button>
        </div>
      </div>

      {/* Margin Health Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        proposal.isMarginHealthy
          ? 'bg-emerald-950/40 border-emerald-600/30 text-emerald-200'
          : 'bg-rose-950/50 border-rose-600/40 text-rose-200'
      }`}>
        <div className="flex items-center gap-3">
          {proposal.isMarginHealthy ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <div>
            <div className="text-xs sm:text-sm font-bold flex items-center gap-2">
              <span>{proposal.isMarginHealthy ? 'Margin Guardrail Passed' : 'Warning: Margin Below Target!'}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-black/40">
                {(proposal.grossMarginPercent * 100).toFixed(1)}% Gross Margin (Target: &gt;= 38.0%)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {proposal.isMarginHealthy 
                ? 'Pricing structure protects Greenscape Pro profitability and crew labor buffer.' 
                : 'Margin is under 38.0%. Adjust unit prices or reduce material allowances to restore standard profit.'}
            </p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="text-xs text-slate-400">Total Gross Profit:</span>
          <div className="text-sm font-black text-white">
            ${(proposal.totalPrice - proposal.totalCost).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Carlos Reyes 3D CAD Render Workflow Card (Auto-Triggered if > $30,000) */}
      {proposal.renderRequest.required && (
        <div className="glass-panel p-5 rounded-2xl border-indigo-500/30 bg-indigo-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">Carlos Reyes 3D CAD Render Trigger</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    &gt;$30k Rule Triggered
                  </span>
                </div>
                <p className="text-xs text-indigo-300/80 mt-0.5">
                  Assigned to: <strong>Carlos Reyes (Lead Designer)</strong> · Turnaround: <strong>48 Hours</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">Status:</span>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/40">
                {proposal.renderRequest.status === 'completed' ? 'CAD Renders Ready' : 'Pending Carlos Design'}
              </span>
            </div>
          </div>

          <div className="mt-3 text-xs">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="font-semibold text-slate-200">Auto-Generated CAD Brief for Carlos:</span>
              <button
                onClick={() => setEditingBrief(!editingBrief)}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3 h-3" /> {editingBrief ? 'Save Brief' : 'Edit Brief'}
              </button>
            </div>

            {editingBrief ? (
              <textarea
                rows={2}
                value={briefText}
                onChange={(e) => setBriefText(e.target.value)}
                onBlur={() => {
                  setEditingBrief(false);
                  recalculateProposal(proposal.items);
                }}
                className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-400"
              />
            ) : (
              <p className="p-2.5 rounded-lg bg-slate-900/80 border border-indigo-900/40 text-slate-300 font-mono text-[11px] leading-relaxed">
                {briefText || proposal.renderRequest.designBrief}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Suggested Viewports:</span>
              {proposal.renderRequest.suggestedViews.map((v, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Package Tier Switcher (Good / Better / Best) */}
      <div className="glass-panel p-4 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            3-Tier Scope Generator (Good / Better / Best)
          </span>
          <span className="text-xs text-slate-400">Select default package presentation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['good', 'better', 'best'] as const).map((tierKey) => {
            const pkg = proposal.tiers[tierKey];
            const isSelected = activeTier === tierKey;
            return (
              <button
                key={tierKey}
                type="button"
                onClick={() => {
                  setActiveTier(tierKey);
                  onUpdateProposal({ ...proposal, selectedTier: tierKey });
                }}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isSelected ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {pkg.name}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-lg font-black text-white mt-1">
                  ${pkg.totalPrice.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                  {pkg.description}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between">
                  <span>50% Deposit: <strong>${pkg.depositAmount.toLocaleString()}</strong></span>
                  <span>Est: <strong>{pkg.estimatedWeeks} wks</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Line-Item Estimation Table */}
      <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Line Item Scope & Financial Breakdown</h3>
            <p className="text-xs text-slate-400">Edit quantities, unit rates, or add catalog materials in real-time.</p>
          </div>

          {/* Quick Add from 200+ Pricing Sheet */}
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => {
                const item = GREENSCAPE_PRICING_CATALOG.find(i => i.id === e.target.value);
                if (item) addCatalogItem(item);
                e.target.value = '';
              }}
              defaultValue=""
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="" disabled>+ Add from 200+ Pricing Sheet...</option>
              {GREENSCAPE_PRICING_CATALOG.map(c => (
                <option key={c.id} value={c.id}>
                  [{c.category}] {c.name} (${c.defaultRetailPrice}/{c.unit})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Item & Category</th>
                <th className="py-3 px-2 w-20">Qty</th>
                <th className="py-3 px-2 w-16">Unit</th>
                <th className="py-3 px-2 w-24">Unit Cost</th>
                <th className="py-3 px-2 w-24">Unit Retail</th>
                <th className="py-3 px-2 w-24 text-right">Total Price</th>
                <th className="py-3 px-2 w-20 text-center">Margin</th>
                <th className="py-3 px-2 w-12 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {proposal.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-sans font-semibold text-white text-xs">{item.name}</div>
                    <div className="font-sans text-[11px] text-slate-400 line-clamp-1">{item.description}</div>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-sans font-medium bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                  </td>

                  {/* Editable Quantity */}
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(idx, { quantity: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded px-1.5 py-1 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-slate-400 font-sans text-xs">
                    {item.unit}
                  </td>

                  {/* Editable Unit Cost */}
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      step="any"
                      value={item.unitCost}
                      onChange={(e) => updateLineItem(idx, { unitCost: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded px-1.5 py-1 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </td>

                  {/* Editable Unit Retail Price */}
                  <td className="py-2.5 px-2">
                    <input
                      type="number"
                      step="any"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-emerald-700/60 rounded px-1.5 py-1 text-emerald-300 font-semibold text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </td>

                  <td className="py-2.5 px-2 text-right font-bold text-white text-xs">
                    ${item.totalPrice.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      item.margin >= 0.38 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' 
                        : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                    }`}>
                      {(item.margin * 100).toFixed(0)}%
                    </span>
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={() => deleteLineItem(idx)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                      title="Remove Line Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Totals Footer */}
        <div className="bg-slate-900/90 p-4 sm:p-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-300">
            <div>Internal Cost: <strong>${proposal.totalCost.toLocaleString()}</strong></div>
            <div>Target Profit: <strong>${(proposal.totalPrice - proposal.totalCost).toLocaleString()}</strong> ({(proposal.grossMarginPercent * 100).toFixed(1)}%)</div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <span className="text-xs text-slate-400">Total Project Retail</span>
              <div className="text-2xl font-black text-white">${proposal.totalPrice.toLocaleString()}</div>
            </div>

            <div className="pl-4 border-l border-slate-700">
              <span className="text-xs text-emerald-400 font-semibold">50% Stripe Deposit</span>
              <div className="text-xl font-black text-emerald-400">${proposal.depositRequired.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
