import React, { useState } from 'react';
import { Menu, X, ChevronRight, CheckCircle, BookOpen, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { curriculum } from '../data/curriculum';

interface LayoutProps {
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: string[];
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onGoHome: () => void;
  onSelectFPV: () => void;
  isFPVSelected: boolean;
  children: React.ReactNode;
}

export function Layout({
  currentModuleId,
  currentLessonId,
  completedLessons,
  onSelectLesson,
  onSelectModule,
  onGoHome,
  onSelectFPV,
  isFPVSelected,
  children
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">B</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Briech UAS</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-zinc-800 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-65px)] p-4 space-y-8">
          
          {/* Main Curriculum */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">
              Core Curriculum
            </h3>
            {curriculum.map((module) => (
              <div key={module.id} className="space-y-2">
                <div
                  className={`flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors px-2 ${currentModuleId === module.id && !isFPVSelected ? 'text-red-500' : ''}`}
                  onClick={() => {
                    onSelectModule(module.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <module.icon size={16} />
                  <span>{module.title}</span>
                </div>
                <div className="space-y-1 pl-4 border-l border-zinc-800 ml-4">
                  {module.lessons.map((lesson) => {
                    const isActive = currentLessonId === lesson.id && currentModuleId === module.id && !isFPVSelected;
                    const isCompleted = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          onSelectLesson(module.id, lesson.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
                          isActive
                            ? 'bg-red-600/10 text-red-500 font-medium'
                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span>{lesson.title}</span>
                        {isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
                      </button>
                    );
                  })}
                  {module.quiz && (
                     <button
                     onClick={() => {
                       onSelectLesson(module.id, 'quiz');
                       setIsSidebarOpen(false);
                     }}
                     className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${
                       currentLessonId === 'quiz' && currentModuleId === module.id && !isFPVSelected
                         ? 'bg-red-600/10 text-red-500 font-medium'
                         : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                     }`}
                   >
                     <span className="italic">Module Quiz</span>
                   </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Additional Programs */}
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">
              Specialized Programs
            </h3>
            <button
              onClick={() => {
                onSelectFPV();
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                isFPVSelected
                  ? 'bg-blue-600/10 text-blue-500 font-medium border border-blue-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <MonitorPlay size={18} />
              <span>FPV Initiator Program</span>
            </button>
          </div>

        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span onClick={onGoHome} className="cursor-pointer hover:text-zinc-300">Home</span>
            {isFPVSelected ? (
              <>
                <ChevronRight size={14} />
                <span className="text-blue-400">FPV Initiator Program</span>
              </>
            ) : currentModuleId && (
              <>
                <ChevronRight size={14} />
                <span className="text-zinc-300">
                  {curriculum.find(m => m.id === currentModuleId)?.title}
                </span>
              </>
            )}
          </div>
          <div className="w-8" /> {/* Spacer for balance */}
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
