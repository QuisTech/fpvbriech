import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Lesson } from '../data/curriculum';

interface LessonViewProps {
  lesson: Lesson;
  onComplete: () => void;
  isCompleted: boolean;
}

export function LessonView({ lesson, onComplete, isCompleted }: LessonViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="prose prose-invert prose-zinc max-w-none">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      <div className="flex justify-end pt-8 border-t border-zinc-800">
        <button
          onClick={onComplete}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isCompleted ? 'Completed' : 'Mark as Complete'}
        </button>
      </div>
    </motion.div>
  );
}
