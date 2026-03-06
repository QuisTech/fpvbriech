import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, RotateCcw, Shield, Plane } from 'lucide-react';
import { cbtDataPart1, cbtDataPart2, CBTQuestion } from '../data/cbtData';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

type CBT_PART = 1 | 2;

export function CBTView() {
  const { user } = useAuth();
  const [selectedPart, setSelectedPart] = useState<CBT_PART | null>(null);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  
  const [isCBTPart1Enabled, setIsCBTPart1Enabled] = useState(false);
  const [isCBTPart2Enabled, setIsCBTPart2Enabled] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Dynamic values based on selected part
  const activeData = selectedPart === 1 ? cbtDataPart1 : cbtDataPart2;
  const [timeLeft, setTimeLeft] = useState(activeData.durationMinutes * 60);
  const [score, setScore] = useState(0);

  const checkStatus = async () => {
    if (!db) {
      setSettingsError("Database connection not available");
      return;
    }
    setLoadingSettings(true);
    setSettingsError(null);
    try {
      const snap = await getDoc(doc(db, 'settings', 'cbt'));
      if (snap.exists()) {
        const data = snap.data();
        setIsCBTPart1Enabled(data.part1Enabled === true);
        setIsCBTPart2Enabled(data.part2Enabled === true);
      } else {
        setIsCBTPart1Enabled(false);
        setIsCBTPart2Enabled(false);
      }
    } catch (err: any) {
      console.error("Manual check error:", err);
      setSettingsError(err.message);
    } finally {
      setLoadingSettings(false);
    }
  };

  useEffect(() => {
    if (!db) {
      setSettingsError("Database connection not available");
      setLoadingSettings(false);
      return;
    }

    const settingsRef = doc(db, 'settings', 'cbt');
    
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      setSettingsError(null);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsCBTPart1Enabled(data.part1Enabled === true);
        setIsCBTPart2Enabled(data.part2Enabled === true);
      } else {
        setIsCBTPart1Enabled(false);
        setIsCBTPart2Enabled(false);
      }
      setLoadingSettings(false);
    }, (error) => {
      console.error("Error listening to CBT settings:", error);
      setSettingsError(error.message);
      setLoadingSettings(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started && !finished) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleStart = (part: CBT_PART) => {
    setSelectedPart(part);
    const data = part === 1 ? cbtDataPart1 : cbtDataPart2;
    setStarted(true);
    setFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(data.durationMinutes * 60);
    setScore(0);
  };

  const handleAnswer = (optionIndex: number) => {
    if (!activeData) return;
    setAnswers({
      ...answers,
      [activeData.questions[currentQuestionIndex].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < activeData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    activeData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / activeData.questions.length) * 100;
    const finalStatus = finalScore >= activeData.passingScore ? 'passed' : 'failed';
    setScore(finalScore);
    setFinished(true);

    if (user && db && selectedPart) {
      try {
        const updateData: any = {};
        if (selectedPart === 1) {
          updateData.cbt1Score = finalScore;
          updateData.cbt1Status = finalStatus;
          updateData.cbt1Date = new Date().toISOString();
        } else {
          updateData.cbt2Score = finalScore;
          updateData.cbt2Status = finalStatus;
          updateData.cbt2Date = new Date().toISOString();
        }

        await setDoc(doc(db, 'users', user.id), updateData, { merge: true });
      } catch (error: any) {
        console.error("Error saving CBT score:", error);
        if (error.code === 'resource-exhausted') {
          alert("Warning: Could not save your score to the server due to high traffic (Quota Exceeded). Please take a screenshot of this result as proof of completion.");
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Selection Screen
  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 w-full">
        <div className="text-center max-w-2xl mb-4">
          <h1 className="text-3xl font-bold text-white mb-4">Computer Based Testing Hub</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Select the assessment you have been instructed to take. Ensure you have a stable connection and the allotted time available before beginning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
          {/* Part 1 Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-bl-full blur-2xl -z-0 transition-all duration-500 group-hover:bg-blue-600/20" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{cbtDataPart1.title}</h2>
              <p className="text-zinc-400 mb-8 flex-1 leading-relaxed text-sm">
                {cbtDataPart1.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock size={12} /> Time
                  </div>
                  <div className="text-white font-mono">{cbtDataPart1.durationMinutes}m</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Questions
                  </div>
                  <div className="text-white font-mono">{cbtDataPart1.questions.length}</div>
                </div>
              </div>

              <button
                onClick={() => handleStart(1)}
                disabled={loadingSettings || (!isCBTPart1Enabled && user?.role !== 'admin')}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all transform ${
                  loadingSettings || (!isCBTPart1Enabled && user?.role !== 'admin')
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                    : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5'
                }`}
              >
                {loadingSettings 
                  ? 'Loading Status...' 
                  : (!isCBTPart1Enabled && user?.role !== 'admin')
                    ? 'Assessment Locked' 
                    : 'Start Part 1'
                }
              </button>
            </div>
          </motion.div>

          {/* Part 2 Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col shadow-2xl relative overflow-hidden group"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-bl-full blur-2xl -z-0 transition-all duration-500 group-hover:bg-purple-600/20" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                <Plane className="w-7 h-7 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{cbtDataPart2.title}</h2>
              <p className="text-zinc-400 mb-8 flex-1 leading-relaxed text-sm">
                {cbtDataPart2.description}
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock size={12} /> Time
                  </div>
                  <div className="text-white font-mono">{cbtDataPart2.durationMinutes}m</div>
                </div>
                <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <CheckCircle size={12} /> Questions
                  </div>
                  <div className="text-white font-mono">{cbtDataPart2.questions.length}</div>
                </div>
              </div>

              <button
                onClick={() => handleStart(2)}
                disabled={loadingSettings || (!isCBTPart2Enabled && user?.role !== 'admin')}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all transform ${
                  loadingSettings || (!isCBTPart2Enabled && user?.role !== 'admin')
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                    : 'bg-purple-600 hover:bg-purple-500 text-white hover:shadow-lg hover:shadow-purple-600/20 hover:-translate-y-0.5'
                }`}
              >
                {loadingSettings 
                  ? 'Loading Status...' 
                  : (!isCBTPart2Enabled && user?.role !== 'admin')
                    ? 'Assessment Locked' 
                    : 'Start Part 2'
                }
              </button>
            </div>
          </motion.div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-4xl px-4">
          {(!isCBTPart1Enabled || !isCBTPart2Enabled) && user?.role !== 'admin' && !loadingSettings && (
             <div className="flex items-center justify-center gap-3 text-amber-500/80 text-sm bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 w-full backdrop-blur-sm">
               <AlertCircle size={18} className="shrink-0" />
               <span>One or more assessments are locked. They will be opened by the administrator when it is time.</span>
             </div>
          )}
          
          <button 
            onClick={checkStatus}
            className="text-sm text-zinc-500 hover:text-white flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <RotateCcw size={14} />
            Refresh Exam Status
          </button>
          
          {settingsError && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 w-full animate-pulse">
              <AlertCircle size={16} />
              <span>Network Error: {settingsError}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Common Question Flow starts here
  if (finished && activeData) {
    const passed = score >= activeData.passingScore;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl relative overflow-hidden"
        >
          {/* Subtle success/fail background glow */}
          <div className={`absolute -top-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${passed ? 'bg-emerald-500' : 'bg-red-500'}`} />

          <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl ${passed ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
            {passed ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </div>
          
          <h2 className="relative z-10 text-4xl font-bold text-white mb-3 tracking-tight">
            {passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h2>
          <p className="relative z-10 text-zinc-400 mb-10 text-lg">
            {passed 
              ? `Congratulations! You have demonstrated the required knowledge for ${activeData.title}.` 
              : `You did not meet the passing score for ${activeData.title}. Please review the material and try again.`}
          </p>

          <div className="relative z-10 mb-10">
            <div className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Final Score</div>
            <div className="text-7xl font-bold font-mono tracking-tighter mix-blend-screen">
              <span className={passed ? 'text-emerald-400' : 'text-red-400 drop-shadow-lg'}>
                {Math.round(score)}%
              </span>
            </div>
            <div className="text-zinc-500 mt-2 text-sm">Passing required: {activeData.passingScore}%</div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-4 px-4">
            <button
              onClick={() => {
                setStarted(false);
                setSelectedPart(null);
              }}
              className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 border border-zinc-700"
            >
              <RotateCcw size={18} />
              Return to Hub
            </button>
            {passed && (
              <button
                className={`flex-1 py-4 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  selectedPart === 1 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40' 
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/40'
                }`}
                onClick={() => window.print()}
              >
                Print Certificate
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Test Rendering
  if (!activeData) return null;
  
  const currentQuestion = activeData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / activeData.questions.length) * 100;
  
  // Choose accent color based on part
  const accentColorClass = selectedPart === 1 ? 'bg-blue-600' : 'bg-purple-600';
  const borderFocusClass = selectedPart === 1 ? 'border-blue-500' : 'border-purple-500';
  const bgFocusClass = selectedPart === 1 ? 'bg-blue-500' : 'bg-purple-500';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900/90 border border-zinc-800 p-5 rounded-2xl sticky top-4 z-50 shadow-xl backdrop-blur-md">
        <div>
          <h2 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
            <span className="text-zinc-500 font-mono text-sm max-w-[200px] truncate md:max-w-none">
              {activeData.title}
            </span>
          </h2>
          <div className="flex items-center gap-3">
             <span className="text-zinc-300 font-medium bg-zinc-800 px-3 py-1 rounded-full text-xs">
               Question {currentQuestionIndex + 1} of {activeData.questions.length}
             </span>
             <span className="text-zinc-500 text-xs hidden sm:inline-block">•</span>
             <span className="text-zinc-400 text-xs tracking-wider uppercase font-medium hidden sm:inline-block">
               {currentQuestion.category}
             </span>
          </div>
        </div>
        <div className={`font-mono text-2xl font-bold px-4 py-2 rounded-xl border ${timeLeft < 300 ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse' : 'bg-zinc-950 text-white border-zinc-800'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={`h-full ${accentColorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: 0.25 }}
          className="bg-zinc-900 border border-zinc-800/80 p-6 sm:p-10 rounded-3xl min-h-[500px] flex flex-col shadow-2xl relative"
        >
          {/* Subtle Question Number Watermark */}
          <div className="absolute top-8 right-10 text-[120px] font-black text-zinc-800/30 select-none pointer-events-none -z-0 font-mono leading-none">
             {currentQuestionIndex + 1}
          </div>

          <div className="relative z-10 flex-1 flex flex-col">
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-10 leading-tight">
              {currentQuestion.question}
            </h3>

            <div className="space-y-4 sm:space-y-5 flex-1 max-w-3xl">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-200 flex items-start gap-5 group ${
                      isSelected
                        ? `${borderFocusClass} ${bgFocusClass}/10 text-white shadow-lg`
                        : 'border-zinc-800 bg-zinc-950/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className={`w-7 h-7 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? `${borderFocusClass} ${bgFocusClass}`
                        : 'border-zinc-600 group-hover:border-zinc-400 bg-zinc-900'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />}
                    </div>
                    <span className="text-lg sm:text-xl leading-snug">{option}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between mt-12 pt-8 border-t border-zinc-800/80">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-6 sm:px-8 py-4 rounded-xl font-semibold transition-all ${
                  currentQuestionIndex === 0
                    ? 'text-zinc-600 bg-zinc-900 cursor-not-allowed border border-transparent'
                    : 'text-zinc-300 bg-zinc-950 border border-zinc-800 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg'
                }`}
              >
                <ArrowLeft size={20} className={currentQuestionIndex === 0 ? 'opacity-50' : ''} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {currentQuestionIndex === activeData.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-3 px-8 sm:px-10 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-emerald-900/30 hover:-translate-y-0.5"
                >
                  <span>Submit Exam</span>
                  <CheckCircle size={22} className="shrink-0" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-3 px-8 sm:px-10 py-4 text-white rounded-xl font-bold transition-all shadow-xl hover:-translate-y-0.5 ${
                    selectedPart === 1 
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30' 
                      : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30'
                  }`}
                >
                  <span className="hidden sm:inline">Next Question</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight size={22} className="shrink-0" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
