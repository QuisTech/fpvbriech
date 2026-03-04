import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { cbtData, CBTQuestion } from '../data/cbtData';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function CBTView() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(cbtData.durationMinutes * 60);
  const [score, setScore] = useState(0);

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

  const handleStart = () => {
    setStarted(true);
    setFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeLeft(cbtData.durationMinutes * 60);
    setScore(0);
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [cbtData.questions[currentQuestionIndex].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < cbtData.questions.length - 1) {
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
    cbtData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = (correctCount / cbtData.questions.length) * 100;
    setScore(finalScore);
    setFinished(true);

    if (user && db) {
      try {
        await setDoc(doc(db, 'users', user.id), {
          cbtScore: finalScore,
          cbtStatus: finalScore >= cbtData.passingScore ? 'passed' : 'failed',
          cbtDate: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        console.error("Error saving CBT score:", error);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = cbtData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / cbtData.questions.length) * 100;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl"
        >
          <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{cbtData.title}</h1>
          <p className="text-zinc-400 mb-8 text-lg leading-relaxed">
            {cbtData.description}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Duration</div>
              <div className="text-white font-mono text-xl">{cbtData.durationMinutes} Minutes</div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Questions</div>
              <div className="text-white font-mono text-xl">{cbtData.questions.length}</div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-xl">
              <div className="text-zinc-500 text-sm uppercase tracking-wider mb-1">Passing Score</div>
              <div className="text-white font-mono text-xl">{cbtData.passingScore}%</div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Assessment
          </button>
        </motion.div>
      </div>
    );
  }

  if (finished) {
    const passed = score >= cbtData.passingScore;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-2xl w-full shadow-2xl"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {passed ? (
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-500" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {passed ? 'Assessment Passed!' : 'Assessment Failed'}
          </h2>
          <p className="text-zinc-400 mb-8">
            {passed 
              ? 'Congratulations! You have demonstrated the required knowledge.' 
              : 'You did not meet the passing score. Please review the material and try again.'}
          </p>

          <div className="text-6xl font-bold mb-8 font-mono">
            <span className={passed ? 'text-emerald-500' : 'text-red-500'}>
              {Math.round(score)}%
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Retake Test
            </button>
            {passed && (
              <button
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-6 rounded-2xl sticky top-4 z-10 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div>
          <h2 className="text-white font-bold text-lg mb-1">Question {currentQuestionIndex + 1} of {cbtData.questions.length}</h2>
          <div className="text-zinc-500 text-sm">{currentQuestion.category}</div>
        </div>
        <div className={`font-mono text-xl font-bold px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500/20 text-red-500' : 'bg-zinc-800 text-zinc-300'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Card */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl min-h-[400px] flex flex-col"
        >
          <h3 className="text-2xl font-medium text-white mb-8 leading-snug">
            {currentQuestion.question}
          </h3>

          <div className="space-y-4 flex-1">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-800/30 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-zinc-600 group-hover:border-zinc-400'
                }`}>
                  {answers[currentQuestion.id] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-lg">{option}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-8 border-t border-zinc-800">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestionIndex === 0
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <ArrowLeft size={20} />
              Previous
            </button>

            {currentQuestionIndex === cbtData.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-emerald-900/20"
              >
                Submit Assessment
                <CheckCircle size={20} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
              >
                Next Question
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
