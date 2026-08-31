'use client';

import React from 'react';
import { Clock, TrendingUp, DollarSign, ShieldAlert, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { ExecutiveStats } from '../types';

interface KpiRibbonProps {
  stats: ExecutiveStats;
}

export const ExecutiveKpiRibbon: React.FC<KpiRibbonProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* 1. Turnaround Speed */}
      <div className="glass-panel p-4 rounded-xl relative overflow-hidden border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quote Turnaround Speed</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">15 Mins</span>
          <span className="text-xs text-rose-400 line-through">6–9 Days</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>97% faster turnaround eliminates competitor loss</span>
        </div>
      </div>

      {/* 2. Recovered Pipeline Revenue */}
      <div className="glass-panel p-4 rounded-xl relative overflow-hidden border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recovered Revenue (Est. Annual)</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-emerald-400 tracking-tight">+$784,000</span>
          <span className="text-xs text-slate-400">/ year</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>28+ high-ticket deals captured before competitors</span>
        </div>
      </div>

      {/* 3. Margin Guardrail */}
      <div className="glass-panel p-4 rounded-xl relative overflow-hidden border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Margin Guardrail</span>
          <div className="p-1.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <Flame className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">{(stats.averageMarginPercent * 100).toFixed(1)}%</span>
          <span className="text-xs text-emerald-400 font-semibold">(Min 38.0%)</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Real-time pricing check prevents underbidding</span>
        </div>
      </div>

      {/* 4. Carlos CAD Render Trigger */}
      <div className="glass-panel p-4 rounded-xl relative overflow-hidden border-emerald-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Carlos 3D CAD Queue (&gt;$30k)</span>
          <div className="p-1.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-indigo-300 tracking-tight">{stats.carlosRenderQueueCount} Projects</span>
          <span className="text-xs text-indigo-400 font-medium">Auto-Flagged</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-indigo-300">
          <span>Auto-generated briefs sent directly to Carlos</span>
        </div>
      </div>
    </div>
  );
};
