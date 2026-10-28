import React, { useState, useMemo } from 'react';
import { EXPERIMENTS, Experiment } from './data/experimentsData.ts';
import { ExperimentDetail } from './components/ExperimentDetail.tsx';
import { FullManualDocument } from './components/FullManualDocument.tsx';
import { generateLabManualPdf } from './utils/pdfGenerator.ts';
import {
  Download,
  FileText,
  Search,
  CheckCircle2,
  Terminal,
  Layers,
  Code2,
  ExternalLink,
  BookOpen,
  Eye,
  FileCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [selectedExp, setSelectedExp] = useState<Experiment>(EXPERIMENTS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'single' | 'fullDocument' | 'pdfPreview'>('single');
  const [crtMode, setCrtMode] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState<boolean>(false);

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    return EXPERIMENTS.filter((exp) => {
      const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesQuery =
        exp.title.toLowerCase().includes(query) ||
        exp.aim.toLowerCase().includes(query) ||
        exp.theory.toLowerCase().includes(query) ||
        `exp ${exp.number}`.includes(query) ||
        `experiment ${exp.number}`.includes(query) ||
        exp.correctedCode.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['All', 'Primitives', 'Rasterization', 'Curves', '2D Transforms', 'Clipping', '3D & Fractals'];

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      // First try to trigger direct file download of pre-rendered high-quality lab manual PDF
      const link = document.createElement('a');
      link.href = '/Computer_Graphics_Lab_Manual_Experiments_1_to_12.pdf';
      link.download = 'Computer_Graphics_Lab_Manual_Experiments_1_to_12.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Fallback: generate in-memory via jsPDF
      const doc = generateLabManualPdf();
      doc.save('Computer_Graphics_Lab_Manual_Experiments_1_to_12.pdf');
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 1000);
    }
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col font-sans transition-colors duration-300 ${
        crtMode ? 'bg-[#030704]' : 'bg-[#0b0f19]'
      }`}
    >
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-bold shadow-inner">
              <Code2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base text-white tracking-tight">
                  Computer Graphics Lab Manual
                </h1>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  12 Experiments Numbered & Corrected
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                All 12 Practical Experiments • Syntax Verified • Logic 100% Unaltered
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowAttachmentsModal(true)}
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg border border-slate-700 transition"
              title="View source attachments map"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Source Scans</span>
            </button>

            <button
              onClick={() => setCrtMode(!crtMode)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium transition ${
                crtMode
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600 shadow-[0_0_12px_rgba(74,222,128,0.2)]'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle classic DOS CRT screen emulation"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CRT Mode</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'fullDocument' ? 'single' : 'fullDocument')}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border font-medium transition ${
                viewMode === 'fullDocument'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{viewMode === 'fullDocument' ? 'Exit Document View' : 'Full Manual'}</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-lg shadow-blue-500/20 border border-blue-400/30 transition transform active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Downloading PDF...' : 'Download PDF Manual'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {/* Full Document View */}
        {viewMode === 'fullDocument' ? (
          <FullManualDocument onDownloadPdf={handleDownloadPdf} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar: Experiments Navigation */}
            <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
              {/* Search & Filter Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 12 experiments..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition font-medium ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experiments List */}
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {filteredExperiments.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-900/50 rounded-lg border border-slate-800">
                    No experiments match your search.
                  </div>
                ) : (
                  filteredExperiments.map((exp) => {
                    const isSelected = selectedExp.id === exp.id;
                    return (
                      <button
                        key={exp.id}
                        onClick={() => setSelectedExp(exp)}
                        className={`w-full text-left p-3 rounded-xl border transition flex items-start gap-3 ${
                          isSelected
                            ? 'bg-blue-950/60 border-blue-500/80 shadow-md shadow-blue-950/50'
                            : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {exp.number}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                              {exp.category}
                            </span>
                            {exp.syntaxErrorsFound.length > 0 && (
                              <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800/60 px-1.5 py-0.2 rounded">
                                {exp.syntaxErrorsFound.length} fix{exp.syntaxErrorsFound.length > 1 ? 'es' : ''}
                              </span>
                            )}
                          </div>
                          <h3
                            className={`text-xs font-semibold truncate ${
                              isSelected ? 'text-white' : 'text-slate-200'
                            }`}
                          >
                            {exp.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{exp.aim}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Quick Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Manual Status: Complete</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Contains all 12 experiments from provided attachments (P-1 to P-12, Cohen-Sutherland, Midpoint Circle, 3D Scenes).
                  Download the ready PDF or browse individually.
                </p>
                <div className="pt-1">
                  <a
                    href="/Computer_Graphics_Lab_Manual_Experiments_1_to_12.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Open Generated PDF Directly</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Right Main Area: Selected Experiment Detail */}
            <section className="lg:col-span-8 xl:col-span-9">
              <ExperimentDetail
                experiment={selectedExp}
                allExperiments={EXPERIMENTS}
                onSelectExperiment={(exp) => setSelectedExp(exp)}
                crtMode={crtMode}
                onToggleCrt={() => setCrtMode(!crtMode)}
                onDownloadPdf={handleDownloadPdf}
              />
            </section>
          </div>
        )}
      </main>

      {/* Source Attachments Mapping Modal */}
      {showAttachmentsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileCode className="w-5 h-5 text-blue-400" />
                <span>Source File Attachments Mapping (12 Experiments)</span>
              </div>
              <button
                onClick={() => setShowAttachmentsModal(false)}
                className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <p>
                Each experiment was faithfully extracted from the 10 PDFs and handwritten notebook scan images you provided.
                Every code syntax error was corrected while strictly preserving the mathematical logic:
              </p>

              <div className="divide-y divide-slate-800 pt-2">
                {EXPERIMENTS.map((e) => (
                  <div key={e.id} className="py-2.5 flex items-start justify-between gap-4">
                    <div>
                      <strong className="text-blue-400 font-mono">Exp {e.number}: </strong>
                      <span className="text-white font-medium">{e.title}</span>
                      <p className="text-[11px] text-slate-400">Attached file: <code className="text-amber-300">{e.originalFileName}</code></p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedExp(e);
                        setViewMode('single');
                        setShowAttachmentsModal(false);
                      }}
                      className="text-xs text-blue-400 hover:underline shrink-0"
                    >
                      View &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>Computer Graphics Lab Practical Manual • CS302 / CGL</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleDownloadPdf} className="hover:text-slate-300 transition">
              Download PDF File
            </button>
            <span>•</span>
            <button onClick={() => setViewMode('fullDocument')} className="hover:text-slate-300 transition">
              All Experiments View
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
