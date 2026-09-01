'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ExecutiveKpiRibbon } from '@/components/ExecutiveKpiRibbon';
import { QuoteStudio } from '@/components/QuoteStudio';
import { HumanInTheLoopEditor } from '@/components/HumanInTheLoopEditor';
import { ProposalsTable } from '@/components/ProposalsTable';
import { ProposalDispatchModal } from '@/components/ProposalDispatchModal';
import { SettingsModal } from '@/components/SettingsModal';
import { Proposal, ExecutiveStats, IntegrationLog } from '@/lib/types';
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  ShieldAlert, 
  Zap, 
  ArrowRight,
  Clock,
  UserCheck,
  Send
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'studio' | 'proposals' | 'roi'>('studio');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [stats, setStats] = useState<ExecutiveStats>({
    averageTurnaroundHours: 0.25,
    historicalTurnaroundDays: 7.5,
    totalProposalsGenerated: 2,
    totalPipelineValue: 94150,
    wonRevenueRecovered: 48400,
    averageMarginPercent: 0.412,
    carlosRenderQueueCount: 2,
    activeLimboCleared: 11,
  });

  // Fetch proposals & stats on mount
  useEffect(() => {
    fetchProposals();
    fetchStats();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/proposals');
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
        if (data.length > 0 && !selectedProposal) {
          setSelectedProposal(data[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching proposals:', e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const handleProposalGenerated = (newProposal: Proposal) => {
    setSelectedProposal(newProposal);
    setProposals([newProposal, ...proposals]);
    setActiveTab('studio');
    fetchStats();
  };

  const handleUpdateProposal = async (updated: Proposal) => {
    setSelectedProposal(updated);
    setProposals(proposals.map(p => p.id === updated.id ? updated : p));
    try {
      await fetch('/api/proposals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.error('Error saving updated proposal:', e);
    }
  };

  const handleDispatchComplete = (updated: Proposal, logs: IntegrationLog[]) => {
    handleUpdateProposal(updated);
    fetchStats();
  };

  const handleResetAndNewProposal = () => {
    setSelectedProposal(null);
    setIsDispatchModalOpen(false);
    setActiveTab('studio');
    fetchProposals();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewProposal={handleResetAndNewProposal}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Executive KPI Ribbon */}
        <ExecutiveKpiRibbon stats={stats} />

        {/* Tab 1: AI Quote Studio & HITL Review */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            {/* Input Studio */}
            <QuoteStudio onProposalGenerated={handleProposalGenerated} />

            {/* Human-in-the-Loop Review Studio (If Proposal Active) */}
            {selectedProposal ? (
              <HumanInTheLoopEditor
                proposal={selectedProposal}
                onUpdateProposal={handleUpdateProposal}
                onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
                onStartNew={handleResetAndNewProposal}
              />
            ) : (
              <div className="glass-panel p-8 rounded-2xl border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-500 border border-slate-800 flex items-center justify-center mx-auto">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">No Proposal Currently Selected</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click one of the presets above and hit <strong>Generate Proposal &amp; Scope</strong>, or select an existing quote from the Active Pipeline tab.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Pipeline Table */}
        {activeTab === 'proposals' && (
          <ProposalsTable
            proposals={proposals}
            onSelectProposal={(p) => {
              setSelectedProposal(p);
              setActiveTab('studio');
            }}
          />
        )}

        {/* Tab 3: Strategy & ROI Engine Breakdown */}
        {activeTab === 'roi' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border-emerald-500/20">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Zap className="w-4 h-4" /> Systemic Financial Impact Model
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                Greenscape Pro: Multi-Agent Automation Waterfall
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Prioritizing operational leverage based on ground truth discovery data. Moving quote turnaround from 6–9 days to under 15 minutes captures deals before competitors, unlocking over $784k in direct bottom-line revenue.
              </p>

              {/* Waterfall Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Agent 1 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                      P0 (Built &amp; Deployed)
                    </span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">+$784k - $1.12M / yr</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">1. AutoQuote AI (Proposal &amp; Scope Estimator)</h4>
                  <p className="text-xs text-slate-300">
                    Replaces Marcus&apos;s 6–9 day manual spreadsheet quoting cycle. Enforces 38%+ margin guardrails and auto-triggers Carlos 3D renders for jobs &gt;$30k.
                  </p>
                </div>

                {/* Agent 2 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-700/50">
                      P1 (Next Sprint)
                    </span>
                    <span className="text-xs font-bold text-blue-400 font-mono">+$224k - $336k Cash Flow</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">2. OnboardFlow AI (Post-Sign HOA &amp; Permit Drag)</h4>
                  <p className="text-xs text-slate-300">
                    Automates HOA architectural packets, city permit status tracking, and 50% deposit chasing to compress 4–6 week stall to &lt;2 weeks.
                  </p>
                </div>

                {/* Agent 3 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700/50">
                      P2 (Week 2)
                    </span>
                    <span className="text-xs font-bold text-purple-400 font-mono">+$784k Latent Pipeline</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">3. ReviveFlow AI (1,400 Closed-Lost Reactivator)</h4>
                  <p className="text-xs text-slate-300">
                    Contextual 1-on-1 re-engagement in Marcus&apos;s authentic voice targeting 3-year historical GHL lead database at 0 acquisition cost.
                  </p>
                </div>

                {/* Agent 4 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                      P3 (Week 3)
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">Frees 10 hrs/wk + Reviews</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">4. JobsitePulse AI (Proactive Progress Updates)</h4>
                  <p className="text-xs text-slate-300">
                    Synthesizes daily Jobber crew logs and CompanyCam photos into branded homeowner progress carousels, eliminating anxiety calls.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dispatch Modal */}
      {selectedProposal && (
        <ProposalDispatchModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          proposal={selectedProposal}
          onDispatchComplete={handleDispatchComplete}
          onResetAndNewProposal={handleResetAndNewProposal}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-400">
        <p>Built for isthispossible.ai Technical Evaluation · Greenscape Pro Automation Suite</p>
      </footer>
    </div>
  );
}
