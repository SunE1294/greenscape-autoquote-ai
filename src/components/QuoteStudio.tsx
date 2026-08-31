'use client';

import React, { useState } from 'react';
import { Sparkles, Mic, FileText, UploadCloud, ArrowRight, Loader2, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';
import { Proposal } from '../types';

interface QuoteStudioProps {
  onProposalGenerated: (proposal: Proposal) => void;
}

const PRESET_SCENARIOS = [
  {
    title: 'Arcadia Luxury Backyard (Travertine + Cedar Pergola)',
    leadName: 'David & Sarah Miller',
    propertyAddress: '4820 E Camelback Rd, Arcadia, Phoenix, AZ 85018',
    notes: 'Miller residence site walk. Wants 850 sq ft tumbled French pattern travertine around existing pool. Add 14x18 custom Western Red cedar pergola with fan beam and stain. Build custom 48" gas fire pit with stucco to match house exterior. Add 500 sq ft ProGreen pet turf on north side. 10 solid brass LED lights on timer. HOA in Arcadia requires full 3D elevations. Target install mid-October.',
  },
  {
    title: 'Scottsdale Outdoor Kitchen & Putting Green',
    leadName: 'Robert Vance',
    propertyAddress: '9210 N 104th St, Scottsdale, AZ 85258',
    notes: 'Vance residence. 650 sq ft Belgard Catalina pavers. 12x16 Alumawood solid insulated cover. 10-ft custom BBQ island with Blaze 32" grill and outdoor fridge. 4-hole custom putting green 350 sq ft. Scottsdale HOA fast-track. Client budget around $45k.',
  },
  {
    title: 'Paradise Valley Resort Oasis (Water Wall & Pergola)',
    leadName: 'Victoria Sterling',
    propertyAddress: '6100 N Mockingbird Ln, Paradise Valley, AZ 85253',
    notes: 'Sterling estate. Demo old concrete deck (1000 sq ft). Install 1200 sq ft premium ivory tumbled travertine. Motorized louvered pergola 16x20. 3-blade sheer descent water wall feature (10ft). Desert modern specimen plant package with 24" box palms and agaves. Total project will easily be $70k+. Wants Carlos CAD design by Friday.',
  },
];

export const QuoteStudio: React.FC<QuoteStudioProps> = ({ onProposalGenerated }) => {
  const [leadName, setLeadName] = useState(PRESET_SCENARIOS[0].leadName);
  const [leadEmail, setLeadEmail] = useState('david.miller@azluxuryhomes.com');
  const [leadPhone, setLeadPhone] = useState('(602) 555-0144');
  const [propertyAddress, setPropertyAddress] = useState(PRESET_SCENARIOS[0].propertyAddress);
  const [rawNotes, setRawNotes] = useState(PRESET_SCENARIOS[0].notes);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setLeadName(preset.leadName);
    setLeadEmail(`${preset.leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    setPropertyAddress(preset.propertyAddress);
    setRawNotes(preset.notes);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !propertyAddress || !rawNotes) return;

    setIsGenerating(true);
    setGenerationStep('Analyzing unstructured site walk notes...');

    setTimeout(() => {
      setGenerationStep('Mapping line items to Greenscape 200+ pricing catalog...');
    }, 600);

    setTimeout(() => {
      setGenerationStep('Calculating labor allowances & enforcing 38%+ gross margin...');
    }, 1200);

    setTimeout(() => {
      setGenerationStep('Evaluating $30k threshold for Carlos Reyes 3D CAD trigger...');
    }, 1800);

    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName,
          leadEmail,
          leadPhone,
          propertyAddress,
          city: 'Phoenix, AZ',
          rawNotes,
        }),
      });

      const data = await res.json();
      if (data.proposal) {
        onProposalGenerated(data.proposal);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border-emerald-500/20 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Site Walk to Proposal Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
              P0 Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Drop raw field notes, voice memos, or dimensional sketches. AI extracts scope, checks 200+ pricing items, guarantees 38% margin, and routes to Carlos if &gt;$30k.
          </p>
        </div>

        {/* Presets Button Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Sample Scenarios:</span>
          {PRESET_SCENARIOS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg transition-colors"
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleGenerate} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Client / Homeowner Name
            </label>
            <input
              type="text"
              required
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. David & Sarah Miller"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Property Address (Phoenix Metro)
            </label>
            <input
              type="text"
              required
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g. 4820 E Camelback Rd, Arcadia, Phoenix, AZ"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Contact Phone & Email
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="(602) 555-0144"
              />
              <input
                type="email"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="client@email.com"
              />
            </div>
          </div>
        </div>

        {/* Raw Site Notes Textarea with Mock Audio Button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Marcus&apos;s Raw Site Walk Notes & Audio Transcription
            </label>
            <button
              type="button"
              onClick={() => alert('Simulated Voice Dictation: Marcus can speak into his mobile phone at the job site; speech is transcribed and piped directly here.')}
              className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40"
            >
              <Mic className="w-3 h-3" /> Voice Dictation Active
            </button>
          </div>
          <textarea
            rows={5}
            required
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed font-mono"
            placeholder="Type or paste messy notes from the job walk..."
          />
        </div>

        {/* Generate Button & Progress State */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Guarantees 38%+ margin · Auto-flags Carlos CAD render if &gt;$30k</span>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl transition-all ${
              isGenerating
                ? 'bg-slate-800 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{generationStep || 'Building Proposal...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Proposal & Scope (P0 Engine)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
