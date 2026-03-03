import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Clock, CheckCircle, RotateCcw, Download, Loader2 } from 'lucide-react';
import { curriculum } from '../data/curriculum';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { FullCurriculumPrintView } from './FullCurriculumPrintView';

interface DashboardProps {
  onSelectModule: (moduleId: string) => void;
  completedLessons: string[];
  onResetProgress: () => void;
}

export function Dashboard({ onSelectModule, completedLessons, onResetProgress }: DashboardProps) {
  const totalLessons = curriculum.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progress = (completedLessons.length / totalLessons) * 100;
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    
    setIsGeneratingPdf(true);
    
    // Temporarily make it visible for html2canvas to capture it correctly
    // We use a portal or just ensure it's in the DOM but hidden from view via z-index/position
    // The current absolute positioning off-screen is usually fine for html2canvas
    // but sometimes it needs to be "visible" in the viewport.
    // Let's try standard off-screen first. If it fails to render content, we might need a different trick.
    
    const element = printRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'Briech_UAS_Academy_Curriculum.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800 }, // Set windowWidth to force desktop layout
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-12 relative">
      {/* Hidden Print View - Positioned absolute but z-index -50 to be "visible" to DOM but behind everything? 
          Actually off-screen left is best. 
      */}
      <div className="absolute left-[-9999px] top-0 w-[800px]">
        <div ref={printRef}>
          <FullCurriculumPrintView />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Welcome to <span className="text-red-600">Briech UAS</span> Academy
          </h1>
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-start md:self-auto"
          >
            {isGeneratingPdf ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Curriculum'}</span>
          </button>
        </div>
        <p className="text-xl text-zinc-400 max-w-2xl">
          Master the operation, maintenance, and tactical deployment of Africa's premier unmanned aerial systems.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Course Progress</h2>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 font-mono">{Math.round(progress)}% Complete</span>
            {completedLessons.length > 0 && (
              <button
                onClick={onResetProgress}
                className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors"
                title="Reset all progress"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-red-600"
          />
        </div>
        <div className="mt-4 flex gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-500" />
            <span>{completedLessons.length} Lessons Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>~2 Hours Remaining</span>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {curriculum.map((module, index) => {
          const moduleLessons = module.lessons.map(l => l.id);
          const completedCount = moduleLessons.filter(id => completedLessons.includes(id)).length;
          const isCompleted = completedCount === moduleLessons.length;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectModule(module.id)}
              className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <module.icon size={120} />
              </div>

              <div className="relative z-10 space-y-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCompleted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-600/20 text-red-500'
                }`}>
                  <module.icon size={24} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-2">
                    {module.description}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-zinc-800/50">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                    {module.lessons.length} Lessons • {module.quiz ? '1 Quiz' : 'No Quiz'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
