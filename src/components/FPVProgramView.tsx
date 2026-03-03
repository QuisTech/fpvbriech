import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, Users, BookOpen, Monitor, Shield, Zap, Target, Wrench, Battery, Radio, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fpvProgramData } from '../data/fpvData';

export function FPVProgramView() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

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

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
      >
        <button
          onClick={() => setSelectedModuleId(null)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Program Overview</span>
        </button>

        <div className="prose prose-invert prose-zinc max-w-none">
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>
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
          <span>New Program Available</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          FPV <span className="text-blue-500">Initiator</span> Program
        </h1>
        <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
          {fpvProgramData.overview}
        </p>
      </motion.div>

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
