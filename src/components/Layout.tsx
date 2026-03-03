import React, { useState } from 'react';
import { Menu, X, ChevronRight, CheckCircle, BookOpen, MonitorPlay, GraduationCap, Shield, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { curriculum } from '../data/curriculum';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  currentModuleId: string | null;
  currentLessonId: string | null;
  completedLessons: string[];
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  onSelectModule: (moduleId: string) => void;
  onGoHome: () => void;
  onSelectFPV: () => void;
  onSelectCBT: () => void;
  onSelectAdmin: () => void;
  isFPVSelected: boolean;
  isCBTSelected: boolean;
  isAdminSelected: boolean;
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
  onSelectCBT,
  onSelectAdmin,
  isFPVSelected,
  isCBTSelected,
  isAdminSelected,
  children
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 shrink-0">
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

        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          
          {/* Main Curriculum */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">
              Core Curriculum
            </h3>
            {curriculum.map((module) => (
              <div key={module.id} className="space-y-2">
                <button
                  className={`w-full text-left flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors px-2 py-1 rounded-lg ${
                    currentModuleId === module.id && !isFPVSelected && !isCBTSelected && !isAdminSelected
                      ? 'text-white bg-zinc-800' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                  onClick={() => {
                    onSelectModule(module.id);
                    setIsSidebarOpen(false);
                  }}
                >
                  <module.icon size={16} />
                  <span>{module.title}</span>
                </button>
                
                {currentModuleId === module.id && !isFPVSelected && !isCBTSelected && !isAdminSelected && (
                  <div className="space-y-1 pl-4 border-l border-zinc-800 ml-4">
                    {module.lessons.map((lesson) => {
                      const isActive = currentLessonId === lesson.id;
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
                          <span className="truncate">{lesson.title}</span>
                          {isCompleted && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
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
                         currentLessonId === 'quiz'
                           ? 'bg-red-600/10 text-red-500 font-medium'
                           : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                       }`}
                     >
                       <span className="italic">Module Quiz</span>
                     </button>
                    )}
                  </div>
                )}
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
            <button
              onClick={() => {
                onSelectCBT();
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                isCBTSelected
                  ? 'bg-emerald-600/10 text-emerald-500 font-medium border border-emerald-500/20'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <GraduationCap size={18} />
              <span>Final Assessment (CBT)</span>
            </button>
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">
                Administration
              </h3>
              <button
                onClick={() => {
                  onSelectAdmin();
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-all flex items-center gap-3 group ${
                  isAdminSelected
                    ? 'bg-purple-600/10 text-purple-500 font-medium border border-purple-500/20'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Shield size={18} />
                <span>Admin Dashboard</span>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{user?.name || 'Guest User'}</span>
                <span className="text-xs text-zinc-500 capitalize">{user?.role || 'Guest'}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
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
              ) : isCBTSelected ? (
                <>
                  <ChevronRight size={14} />
                  <span className="text-emerald-400">Final Assessment (CBT)</span>
                </>
              ) : isAdminSelected ? (
                <>
                  <ChevronRight size={14} />
                  <span className="text-purple-400">Admin Dashboard</span>
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
          </div>
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
