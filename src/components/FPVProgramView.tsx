import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, Users, BookOpen, Monitor, Shield, Zap, Target, Wrench, Battery, Radio, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fpvProgramData } from '../data/fpvData';
import { QuizView } from './QuizView';

export function FPVProgramView() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (selectedModuleId) {
    const module = fpvProgramData.modules.find(m => m.id === selectedModuleId);
    if (!module) return <div>Module not found</div>;

    if (showQuiz && module.quiz) {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <button
            onClick={() => setShowQuiz(false)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Module Content</span>
          </button>
          
          <QuizView 
            questions={module.quiz}
            onComplete={(score) => console.log('Quiz completed with score:', score)}
            onBack={() => setShowQuiz(false)}
          />
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <button
          onClick={() => {
            setSelectedModuleId(null);
            setShowQuiz(false);
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Program Overview</span>
        </button>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 md:p-12">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6 text-sm font-medium text-blue-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <BookOpen size={14} />
                FPV Module
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {module.title}
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl">
              {module.description}
            </p>
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
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>

        {/* Quiz Button */}
        {module.quiz && (
          <div className="flex justify-end pt-8 border-t border-zinc-800">
            <button
              onClick={() => setShowQuiz(true)}
              className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-900/20"
            >
              <span>Take Module Quiz</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center border-2 border-white/30 group-hover:border-white transition-colors">
                <GraduationCap size={14} strokeWidth={3} />
              </div>
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
          <Zap size={14} />
          <span>{fpvProgramData.timeline}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          FPV <span className="text-blue-500">Initiator</span> Program
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
          {fpvProgramData.overview}
        </p>
      </motion.div>

      {/* Instructor Manual Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Instructor Manual</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Program Philosophy</h3>
              <p className="text-zinc-300 text-sm italic border-l-2 border-red-500 pl-4 py-1">
                "{fpvProgramData.instructorManual.philosophy.corePrinciple}"
              </p>
              <ul className="mt-4 space-y-2">
                {fpvProgramData.instructorManual.philosophy.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-zinc-400 text-sm">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Responsibilities</h3>
              <ul className="space-y-2">
                {fpvProgramData.instructorManual.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">10-Day Schedule</h2>
          </div>
          
          <div className="space-y-4">
            {fpvProgramData.instructorManual.schedule.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                <div className="font-mono text-blue-400 font-bold shrink-0 w-20">
                  {item.day}
                </div>
                <div className="text-zinc-300 text-sm">
                  {item.focus}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Certification Pass Requirements</h3>
            <ul className="grid sm:grid-cols-2 gap-2">
              {fpvProgramData.instructorManual.certificationRequirements.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Target size={12} className="text-blue-500" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Modules Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-blue-500" />
          Course Modules
        </h2>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {fpvProgramData.modules.map((module, idx) => (
            <motion.div
              key={idx}
              variants={item}
              onClick={() => setSelectedModuleId(module.id)}
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-800 transition-colors group cursor-pointer"
            >
              <div className="text-xs font-mono text-blue-500 mb-2 uppercase tracking-wider">
                Module {idx + 1}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {module.title.split(' - ')[1]}
              </h3>
              <p className="text-sm text-zinc-400">
                {module.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Equipment & Materials */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">Included Equipment</h2>
          </div>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Drones & Accessories</h3>
              <ul className="grid gap-3">
                {fpvProgramData.equipment.drones.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                <Target size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Course Materials</h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {fpvProgramData.equipment.courseMaterials.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-zinc-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                <Monitor size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Training & Support</h2>
            </div>
            <div className="space-y-6">
              <div className="prose prose-invert prose-sm">
                <p className="text-zinc-400">{fpvProgramData.details.contactHours.description}</p>
              </div>
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Platform Support</h3>
                <ul className="space-y-3">
                  {fpvProgramData.details.support.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-zinc-300 text-sm">
                      <Shield size={16} className="text-purple-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
