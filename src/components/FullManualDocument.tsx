import React from 'react';
import { EXPERIMENTS } from '../data/experimentsData.ts';
import { Download, FileText, CheckCircle2, AlertTriangle, Copy, Check } from 'lucide-react';

interface FullManualDocumentProps {
  onDownloadPdf: () => void;
}

export const FullManualDocument: React.FC<FullManualDocumentProps> = ({ onDownloadPdf }) => {
  const [copiedId, setCopiedId] = React.useState<number | null>(null);

  const handleCopy = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden my-6">
      {/* Document Action Toolbar */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-400" />
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">Computer Graphics Laboratory Record</h2>
            <p className="text-xs text-slate-400">All 12 Numbered Experiments • Syntax-Corrected C Graphics Code</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition"
          >
            <Download className="w-4 h-4" />
            Download Complete Lab Manual (PDF)
          </button>
        </div>
      </div>

      <div className="p-8 sm:p-12 space-y-12">
        {/* Cover / Title Header */}
        <div className="text-center border-b-2 border-slate-200 pb-10 space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            COMPUTER GRAPHICS & MULTIMEDIA LABORATORY MANUAL
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Practical record containing all 12 laboratory experiments. All original mathematical logic and coordinate values
            are strictly preserved, with complete syntax error fixes for Turbo C (BGI) & ANSI C.
          </p>

          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block">Course:</span>
              <strong className="text-slate-800">Computer Graphics</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Total Experiments:</span>
              <strong className="text-slate-800">12 Practical Codes</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Syntax Status:</span>
              <strong className="text-emerald-600 font-bold">100% Corrected</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Logic Status:</span>
              <strong className="text-blue-600 font-bold">Original Preserved</strong>
            </div>
          </div>
        </div>

        {/* Index / Table of Contents */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
            <span>Table of Laboratory Experiments</span>
          </h3>
          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            {EXPERIMENTS.map((exp) => (
              <div key={exp.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-blue-600 font-mono w-14 shrink-0">Exp {exp.number}</span>
                  <div>
                    <a href={`#exp-${exp.number}`} className="font-semibold text-slate-800 hover:text-blue-600 transition">
                      {exp.title}
                    </a>
                    <span className="text-xs text-slate-500 block">{exp.aim}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400 shrink-0 bg-slate-100 px-2 py-0.5 rounded">
                  {exp.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* All Experiments Full Content */}
        <div className="space-y-16 pt-8">
          {EXPERIMENTS.map((exp) => (
            <article
              key={exp.id}
              id={`#exp-${exp.number}`}
              className="border-t-2 border-slate-200 pt-8 space-y-6 scroll-mt-20"
            >
              {/* Experiment Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded">
                    EXPERIMENT {exp.number}
                  </span>
                  <span className="text-xs text-slate-500">Source: {exp.originalFileName}</span>
                </div>
                <button
                  onClick={() => handleCopy(exp.id, exp.correctedCode)}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
                >
                  {copiedId === exp.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === exp.id ? 'Copied' : 'Copy C Code'}
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{exp.title}</h2>

              {/* Aim */}
              <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Aim / Objective</h4>
                <p className="text-sm text-slate-800">{exp.aim}</p>
              </div>

              {/* Theory */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Theory & Mathematical Principles</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{exp.theory}</p>
              </div>

              {/* Algorithm Steps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Algorithm</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                  {exp.algorithm.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <span className="text-slate-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Syntax Errors & Bug Fixes Callout */}
              {exp.syntaxErrorsFound.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Syntax Errors Identified in Original Submission & Applied Fixes:</span>
                  </div>
                  <ul className="space-y-1.5 pt-1 text-slate-700">
                    {exp.syntaxErrorsFound.map((err, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="font-bold text-amber-800 shrink-0">• [{err.location}]:</span>
                        <span>
                          <strong className="text-red-700 font-medium">Issue:</strong> {err.issue} &rarr;{' '}
                          <strong className="text-emerald-700 font-medium">Fixed:</strong> {err.fix}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Source Code */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-semibold">Pristine C Source Code (ANSI C / Turbo C):</span>
                  <span>Syntax: Corrected | Logic: Unaltered</span>
                </div>
                <div className="bg-slate-950 text-slate-200 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 max-h-96">
                  <pre>{exp.correctedCode}</pre>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
