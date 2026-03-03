import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { QuizQuestion } from '../data/curriculum';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

export function QuizView({ questions, onComplete, onBack }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedOption === questions[currentQuestionIndex].correctAnswer;
    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      onComplete(newScore);
    }
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    const passed = percentage >= 70;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center ${
            passed ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
          }`}
        >
          {passed ? <CheckCircle size={48} /> : <XCircle size={48} />}
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">
            {passed ? 'Quiz Passed!' : 'Quiz Failed'}
          </h2>
          <p className="text-zinc-400 text-lg">
            You scored {score} out of {questions.length} ({percentage.toFixed(0)}%)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setSelectedOption(null);
              setShowResult(false);
            }}
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-semibold transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
          >
            Back to Module
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between text-zinc-500 text-sm uppercase tracking-wider font-mono">
        <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                selectedOption === index
                  ? 'border-red-500 bg-red-500/10 text-white shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
              }`}
            >
              <span className="text-lg">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end pt-8 border-t border-zinc-800">
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedOption !== null
                ? 'bg-white text-black hover:bg-zinc-200 shadow-lg hover:shadow-white/10'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
