import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'motion/react';
import { Lesson } from '../data/curriculum';
import { CheckCircle, Clock, BookOpen } from 'lucide-react';

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
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6 text-sm font-medium text-blue-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              <BookOpen size={14} />
              Lesson Content
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Clock size={14} />
              {lesson.duration}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="prose prose-lg prose-invert prose-zinc max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
        prose-p:text-zinc-400 prose-p:leading-relaxed
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
        prose-strong:text-white prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-zinc-600
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-zinc-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
        prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-300 prose-code:font-mono prose-code:text-sm
        prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
        prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-zinc-800
      ">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      {/* Action Bar */}
      <div className="flex justify-end pt-8 border-t border-zinc-800">
        <button
          onClick={onComplete}
          className={`
            group flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${isCompleted
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
            }
          `}
        >
          <span>{isCompleted ? 'Lesson Completed' : 'Mark as Complete'}</span>
          <div className={`
            w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
            ${isCompleted ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-white/30 group-hover:border-white'}
          `}>
            {isCompleted && <CheckCircle size={14} strokeWidth={3} />}
          </div>
        </button>
      </div>
    </motion.div>
  );
}
