import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { FPVProgramView } from './components/FPVProgramView';
import { curriculum } from './data/curriculum';

export default function App() {
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [isFPVSelected, setIsFPVSelected] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('briech-uas-progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('briech-uas-progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const handleSelectModule = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(null);
    setIsFPVSelected(false);
  };

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    setCurrentModuleId(moduleId);
    setCurrentLessonId(lessonId);
    setIsFPVSelected(false);
  };

  const handleSelectFPV = () => {
    setIsFPVSelected(true);
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
      isFPVSelected={isFPVSelected}
      onGoHome={() => {
        setCurrentModuleId(null);
        setCurrentLessonId(null);
        setIsFPVSelected(false);
      }}
    >
      {renderContent()}
    </Layout>
  );
}
