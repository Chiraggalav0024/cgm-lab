import React, { useState } from 'react';
import { Experiment } from '../data/experimentsData.ts';
import { ExperimentSimulator } from './ExperimentSimulator.tsx';
import {
  Code,
  Play,
  FileCheck,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Terminal,
  ExternalLink,
  Info,
} from 'lucide-react';

interface ExperimentDetailProps {
  experiment: Experiment;
  allExperiments: Experiment[];
  onSelectExperiment: (exp: Experiment) => void;
  crtMode: boolean;
  onToggleCrt: () => void;
  onDownloadPdf: () => void;
}

export const ExperimentDetail: React.FC<ExperimentDetailProps> = ({
  experiment,
  allExperiments,
  onSelectExperiment,
  crtMode,
  onToggleCrt,
  onDownloadPdf,
}) => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'code' | 'syntax' | 'theory'>('simulation');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(experiment.correctedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentIndex = allExperiments.findIndex((e) => e.id === experiment.id);
  const prevExp = currentIndex > 0 ? allExperiments[currentIndex - 1] : null;
  const nextExp = currentIndex < allExperiments.length - 1 ? allExperiments[currentIndex + 1] : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white font-mono text-xs font-bold px-2.5 py-0.5 rounded">
              EXPERIMENT {experiment.number} of 12
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded border border-slate-700">
              {experiment.category}
            </span>
            <span className="text-xs text-slate-400">Source: {experiment.originalFileName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{experiment.title}</h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
            {isCopied ? 'Code Copied!' : 'Copy C Code'}
          </button>

          <button
            onClick={onToggleCrt}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition ${
              crtMode
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            {crtMode ? 'CRT Phosphor: ON' : 'CRT Mode'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition ${
            activeTab === 'simulation'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Interactive Graphic Simulation</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition ${
            activeTab === 'code'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Corrected C Code</span>
        </button>

        <button
          onClick={() => setActiveTab('syntax')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition ${
            activeTab === 'syntax'
              ? 'border-amber-500 text-amber-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Syntax Bug Fixes ({experiment.syntaxErrorsFound.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition ${
            activeTab === 'theory'
              ? 'border-blue-500 text-blue-400 bg-slate-900/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Aim & Algorithm</span>
        </button>
      </div>

      {/* Tab 1: Interactive Simulation */}
      {activeTab === 'simulation' && (
        <div className="space-y-4">
          <ExperimentSimulator experiment={experiment} crtMode={crtMode} />
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p>
              This canvas dynamically executes the exact mathematical algorithms specified in the C graphics code
              (DDA, Bresenham, Midpoint, Oblique 3D, Sierpinski fractals, etc.). You can adjust sliders above to test real-time transformations.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Corrected C Code */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900 px-4 py-2 rounded-t-lg border border-slate-800 border-b-0">
            <span className="font-mono text-slate-200">experiment_{experiment.number}.c</span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-medium">● Turbo C 3.0 & GCC libgraph Ready</span>
              <button
                onClick={handleCopyCode}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-b-lg p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-2xl leading-relaxed">
            <pre className="whitespace-pre">{experiment.correctedCode}</pre>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-blue-400" />
              How to Compile & Run on Turbo C / Modern Linux/Mac/Windows:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                <span className="font-bold text-blue-400">1. Classic Turbo C++ 3.0 / DOSBox:</span>
                <p className="text-slate-400">
                  Open in TC editor, verify BGI path points to <code className="text-amber-300">C:\TURBOC3\BGI</code>.
                  Press <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">Alt + F9</kbd> to compile,{' '}
                  <kbd className="bg-slate-800 px-1 py-0.5 rounded text-white">Ctrl + F9</kbd> to execute.
                </p>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400">2. Modern GCC (Ubuntu/Debian libgraph):</span>
                <p className="text-slate-400 font-mono">
                  gcc exp_{experiment.number}.c -lgraph -lm -o exp_{experiment.number}
                </p>
                <p className="text-slate-500 text-[11px]">Or use OpenBGI / WinBGIm on Windows MinGW.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Syntax Errors & Fixes */}
      {activeTab === 'syntax' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Identified Syntax Errors in Scanned Source / Handwritten Notes:</span>
            </div>
            <p className="text-xs text-slate-300">
              The user requested to fix all incorrect code syntax while preserving the original algorithm logic.
              Here is the itemized breakdown of issues detected and fixed in this experiment:
            </p>

            <div className="divide-y divide-slate-800 text-xs">
              {experiment.syntaxErrorsFound.map((err, idx) => (
                <div key={idx} className="py-3 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-mono font-bold text-amber-400">Location: {err.location}</span>
                    <span className="text-[11px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800">
                      Syntax Defect
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                    <div>
                      <span className="text-red-400 font-semibold">Original Issue: </span>
                      <code className="text-slate-300">{err.issue}</code>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">Applied Correction: </span>
                      <code className="text-emerald-300">{err.fix}</code>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-950/40 border border-blue-900/60 rounded-lg p-3 text-xs text-blue-300 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                <strong>Logic Guarantee:</strong> The underlying algorithms, coordinate arrays, and formulas have been
                kept strictly intact with only structural, syntax, and operator fixes applied.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Theory, Aim & Algorithm */}
      {activeTab === 'theory' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 text-xs text-slate-300">
            <div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Aim & Objective</h3>
              <p className="text-sm text-slate-100 bg-slate-950 p-3 rounded-lg border border-slate-800">{experiment.aim}</p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Theoretical Background</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                {experiment.theory}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Step-by-Step Algorithm</h3>
              <ol className="list-decimal list-inside space-y-1.5 bg-slate-950 p-4 rounded-lg border border-slate-800">
                {experiment.algorithm.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Prev / Next Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
        {prevExp ? (
          <button
            onClick={() => onSelectExperiment(prevExp)}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-800 transition"
          >
            <ChevronLeft className="w-4 h-4 text-blue-400" />
            <span>Exp {prevExp.number}: {prevExp.title.substring(0, 22)}...</span>
          </button>
        ) : (
          <div />
        )}

        {nextExp && (
          <button
            onClick={() => onSelectExperiment(nextExp)}
            className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg border border-slate-800 transition"
          >
            <span>Exp {nextExp.number}: {nextExp.title.substring(0, 22)}...</span>
            <ChevronRight className="w-4 h-4 text-blue-400" />
          </button>
        )}
      </div>
    </div>
  );
};
