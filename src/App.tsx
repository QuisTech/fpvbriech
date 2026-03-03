import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { FPVProgramView } from './components/FPVProgramView';
import { CBTView } from './components/CBTView';
import { LoginView } from './components/LoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { curriculum } from './data/curriculum';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isFPVSelected, setIsFPVSelected] = useState(false);
  const [isCBTSelected, setIsCBTSelected] = useState(false);
  const [isAdminSelected, setIsAdminSelected] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('briech-uas-progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('briech-uas-progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const handleSelectModule = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(null);
    setIsFPVSelected(false);
    setIsCBTSelected(false);
    setIsAdminSelected(false);
  };

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
    setIsFPVSelected(false);
    setIsCBTSelected(false);
    setIsAdminSelected(false);
  };

  const handleSelectFPV = () => {
    setIsFPVSelected(true);
    setIsCBTSelected(false);
    setIsAdminSelected(false);
    setCurrentModuleId(null);
    setCurrentLessonId(null);
  };

  const handleSelectCBT = () => {
    setIsCBTSelected(true);
    setIsFPVSelected(false);
    setIsAdminSelected(false);
    setCurrentModuleId(null);
    setCurrentLessonId(null);
  };

  const handleSelectAdmin = () => {
    setIsAdminSelected(true);
    setIsCBTSelected(false);
    setIsFPVSelected(false);
    setCurrentModuleId(null);
    setCurrentLessonId(null);
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId));
    } else {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all course progress? This cannot be undone.')) {
      setCompletedLessons([]);
    }
  };

  const handleCompleteQuiz = (score: number) => {
    // Logic to handle quiz completion
  };

  const renderContent = () => {
    if (isAdminSelected) {
      return <AdminDashboardView />;
    }

    if (isCBTSelected) {
      return <CBTView />;
    }

    if (isFPVSelected) {
      return <FPVProgramView />;
    }

    if (!currentModuleId) {
      return (
        <Dashboard
          onSelectModule={handleSelectModule}
          completedLessons={completedLessons}
          onResetProgress={handleResetProgress}
        />
      );
    }

    const module = curriculum.find((m) => m.id === currentModuleId);
    if (!module) return <div>Module not found</div>;

    if (!currentLessonId) {
      const firstLesson = module.lessons[0];
      return (
        <LessonView
          lesson={firstLesson}
          onComplete={() => handleCompleteLesson(firstLesson.id)}
          isCompleted={completedLessons.includes(firstLesson.id)}
        />
      );
    }

    if (currentLessonId === 'quiz') {
      if (!module.quiz) return <div>No quiz for this module</div>;
      return (
        <QuizView
          questions={module.quiz}
          onComplete={handleCompleteQuiz}
          onBack={() => setCurrentLessonId(null)}
        />
      );
    }

    const lesson = module.lessons.find((l) => l.id === currentLessonId);
    if (!lesson) return <div>Lesson not found</div>;

    return (
      <LessonView
        lesson={lesson}
        onComplete={() => handleCompleteLesson(lesson.id)}
        isCompleted={completedLessons.includes(lesson.id)}
      />
    );
  };

  return (
    <Layout
      currentModuleId={currentModuleId}
      currentLessonId={currentLessonId || (currentModuleId ? curriculum.find(m => m.id === currentModuleId)?.lessons[0].id || null : null)}
      completedLessons={completedLessons}
      onSelectLesson={handleSelectLesson}
      onSelectModule={handleSelectModule}
      onSelectFPV={handleSelectFPV}
      onSelectCBT={handleSelectCBT}
      onSelectAdmin={handleSelectAdmin}
      isFPVSelected={isFPVSelected}
      isCBTSelected={isCBTSelected}
      isAdminSelected={isAdminSelected}
      onGoHome={() => {
        setCurrentModuleId(null);
        setCurrentLessonId(null);
        setIsFPVSelected(false);
        setIsCBTSelected(false);
        setIsAdminSelected(false);
      }}
    >
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
