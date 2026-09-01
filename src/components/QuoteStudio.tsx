'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, MicOff, FileText, ArrowRight, Loader2, ShieldAlert, Volume2, RotateCcw } from 'lucide-react';
import { Proposal } from '@/lib/types';

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
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [rawNotes, setRawNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');

  // Real Web Speech API State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseNotesBeforeSpeechRef = useRef<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceDictation = () => {
    setSpeechError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setSpeechError('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    try {
      baseNotesBeforeSpeechRef.current = rawNotes ? rawNotes.trim() + ' ' : '';
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const currentSpeech = (finalTranscript + interimTranscript).trim();
        if (currentSpeech) {
          setRawNotes(baseNotesBeforeSpeechRef.current + currentSpeech);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error !== 'no-speech') {
          setSpeechError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to initialize speech recognition:', err);
      setSpeechError('Could not access microphone: ' + (err.message || 'Unknown error'));
      setIsListening(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setLeadName(preset.leadName);
    setLeadEmail(`${preset.leadName.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    setPropertyAddress(preset.propertyAddress);
    setRawNotes(preset.notes);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !propertyAddress || !rawNotes) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

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

      const savedSupabaseKey = typeof window !== 'undefined' ? localStorage.getItem('greenscape_supabase_key') : null;
      const savedOpenAiKey = typeof window !== 'undefined' ? localStorage.getItem('greenscape_openai_key') : null;

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
          apiKey: savedOpenAiKey || undefined,
          supabaseKey: savedSupabaseKey || undefined,
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
            Drop raw field notes, speak into the microphone, or load dimensional sketches. AI extracts scope, checks 200+ pricing items, guarantees 38% margin, and routes to Carlos if &gt;$30k.
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
          {(leadName || rawNotes || propertyAddress) && (
            <button
              type="button"
              onClick={() => {
                setLeadName('');
                setLeadEmail('');
                setLeadPhone('');
                setPropertyAddress('');
                setRawNotes('');
              }}
              className="px-2.5 py-1 text-[11px] font-medium bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-lg transition-colors flex items-center gap-1"
              title="Clear all fields"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
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

        {/* Raw Site Notes Textarea with Real Web Speech API Voice Dictation Button */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              Marcus&apos;s Raw Site Walk Notes & Audio Transcription
            </label>

            {/* Real Web Speech Microphone Toggle */}
            <button
              type="button"
              onClick={toggleVoiceDictation}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-lg border transition-all ${
                isListening
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 shadow-md shadow-rose-950/60 animate-pulse'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/80 border-emerald-700/60 text-emerald-300'
              }`}
              title={isListening ? 'Click to stop voice recording' : 'Click to start real-time microphone dictation'}
            >
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <MicOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Listening... Stop Dictation</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Voice Dictation</span>
                </>
              )}
            </button>
          </div>

          {/* Voice Listening Active Indicator Banner */}
          {isListening && (
            <div className="mb-2 p-2 rounded-lg bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
              <Volume2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Microphone active: Speak notes from the job site. Spoken words are transcribed into the field below in real time...</span>
            </div>
          )}

          {speechError && (
            <div className="mb-2 p-2 rounded-lg bg-rose-950/50 border border-rose-700/50 text-rose-300 text-xs">
              {speechError}
            </div>
          )}

          <textarea
            rows={5}
            required
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            className={`w-full bg-slate-900/90 border rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:ring-1 leading-relaxed font-mono transition-colors ${
              isListening
                ? 'border-emerald-500 focus:border-emerald-400 focus:ring-emerald-500 ring-1 ring-emerald-500/50'
                : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500'
            }`}
            placeholder="Type, paste, or click 'Live Voice Dictation' to speak notes from the job walk..."
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
