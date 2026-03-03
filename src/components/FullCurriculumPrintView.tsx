import React from 'react';
import ReactMarkdown from 'react-markdown';
import { curriculum } from '../data/curriculum';
import { fpvProgramData } from '../data/fpvData';
import { BookOpen, Monitor, Shield, Zap, Target, Wrench, Battery, Radio } from 'lucide-react';

export function FullCurriculumPrintView() {
  return (
    <div className="bg-[#ffffff] text-[#000000] p-8 max-w-[210mm] mx-auto font-sans" id="curriculum-pdf-content">
      {/* Title Page */}
      <div className="min-h-[297mm] flex flex-col justify-center items-center text-center page-break-after-always">
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#dc2626] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="font-bold text-5xl text-[#ffffff]">B</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Briech UAS Academy</h1>
          <p className="text-xl text-[#4b5563] max-w-2xl mx-auto">
            Comprehensive Training Manual & FPV Initiator Program
          </p>
        </div>
        
        <div className="mt-12 text-sm text-[#6b7280]">
          <p>Generated on {new Date().toLocaleDateString()}</p>
          <p>Briech UAS - Africa's Premier Unmanned Aerial Systems Manufacturer</p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="min-h-[297mm] page-break-after-always p-12">
        <h2 className="text-3xl font-bold mb-8 border-b-2 border-[#dc2626] pb-4">Table of Contents</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#dc2626] uppercase tracking-wider">Core Curriculum</h3>
            <ul className="space-y-2">
              {curriculum.map((module, i) => (
                <li key={module.id} className="flex justify-between text-[#374151] border-b border-[#f3f4f6] py-1">
                  <span>{i + 1}. {module.title}</span>
                  <span className="text-[#9ca3af] text-sm">{module.lessons.length} Lessons</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-[#2563eb] uppercase tracking-wider">FPV Initiator Program</h3>
            <ul className="space-y-2">
              {fpvProgramData.modules.map((module, i) => (
                <li key={module.id} className="flex justify-between text-[#374151] border-b border-[#f3f4f6] py-1">
                  <span>{i + 1}. {module.title.split(' - ')[1]}</span>
                  <span className="text-[#9ca3af] text-sm">Module {i + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Core Curriculum Content */}
      <div className="space-y-12">
        <div className="page-break-before-always">
          <h2 className="text-4xl font-bold mb-2 text-[#dc2626]">Core Curriculum</h2>
          <p className="text-xl text-[#4b5563] mb-12">Standard Operating Procedures & Fleet Overview</p>
        </div>

        {curriculum.map((module) => (
          <div key={module.id} className="mb-12">
            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#e5e7eb] pb-4">
              <div className="p-3 bg-[#f3f4f6] rounded-lg">
                {/* Icons don't render well in print sometimes, keep it simple */}
                <span className="font-bold text-2xl text-[#9ca3af]">#{curriculum.indexOf(module) + 1}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{module.title}</h3>
                <p className="text-[#6b7280]">{module.description}</p>
              </div>
            </div>

            <div className="space-y-8 pl-4 border-l-4 border-[#f3f4f6] ml-4">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="mb-8 page-break-inside-avoid">
                  <h4 className="text-xl font-bold mb-4 text-[#1f2937] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span>
                    {lesson.title}
                    <span className="text-xs font-normal text-[#9ca3af] ml-auto border border-[#e5e7eb] px-2 py-1 rounded">
                      {lesson.duration}
                    </span>
                  </h4>
                  <div className="prose max-w-none text-sm text-justify" style={{
                    '--tw-prose-body': '#374151',
                    '--tw-prose-headings': '#111827',
                    '--tw-prose-links': '#2563eb',
                    '--tw-prose-bold': '#111827',
                    '--tw-prose-counters': '#6b7280',
                    '--tw-prose-bullets': '#d1d5db',
                    '--tw-prose-hr': '#e5e7eb',
                    '--tw-prose-quotes': '#111827',
                    '--tw-prose-quote-borders': '#e5e7eb',
                    '--tw-prose-captions': '#6b7280',
                    '--tw-prose-code': '#111827',
                    '--tw-prose-pre-code': '#e5e7eb',
                    '--tw-prose-pre-bg': '#1f2937',
                    '--tw-prose-th-borders': '#d1d5db',
                    '--tw-prose-td-borders': '#e5e7eb',
                  } as React.CSSProperties}>
                    <ReactMarkdown>{lesson.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-12"></div> {/* Spacer */}
          </div>
        ))}
      </div>

      {/* FPV Program Content */}
      <div className="space-y-12 page-break-before-always">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2 text-[#2563eb]">FPV Initiator Program</h2>
          <p className="text-xl text-[#4b5563]">{fpvProgramData.overview}</p>
        </div>

        {fpvProgramData.modules.map((module, index) => (
          <div key={module.id} className="mb-12 page-break-inside-avoid">
            <div className="flex items-center gap-4 mb-6 border-b-2 border-[#dbeafe] pb-4">
              <div className="p-3 bg-[#eff6ff] rounded-lg">
                <span className="font-bold text-2xl text-[#60a5fa]">#{index + 1}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{module.title}</h3>
                <p className="text-[#6b7280]">{module.description}</p>
              </div>
            </div>

            <div className="prose max-w-none text-sm text-justify pl-4 border-l-4 border-[#eff6ff] ml-4" style={{
              '--tw-prose-body': '#374151',
              '--tw-prose-headings': '#111827',
              '--tw-prose-links': '#2563eb',
              '--tw-prose-bold': '#111827',
              '--tw-prose-counters': '#6b7280',
              '--tw-prose-bullets': '#d1d5db',
              '--tw-prose-hr': '#e5e7eb',
              '--tw-prose-quotes': '#111827',
              '--tw-prose-quote-borders': '#e5e7eb',
              '--tw-prose-captions': '#6b7280',
              '--tw-prose-code': '#111827',
              '--tw-prose-pre-code': '#e5e7eb',
              '--tw-prose-pre-bg': '#1f2937',
              '--tw-prose-th-borders': '#d1d5db',
              '--tw-prose-td-borders': '#e5e7eb',
            } as React.CSSProperties}>
              <ReactMarkdown>{module.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {/* Equipment List */}
        <div className="page-break-before-always">
          <h3 className="text-2xl font-bold mb-6 text-[#1f2937]">Equipment & Materials</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[#6b7280] uppercase tracking-wider mb-4 text-sm">Drones & Accessories</h4>
              <ul className="text-sm space-y-2">
                {fpvProgramData.equipment.drones.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#3b82f6]">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#6b7280] uppercase tracking-wider mb-4 text-sm">Course Materials</h4>
              <ul className="text-sm space-y-2">
                {fpvProgramData.equipment.courseMaterials.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#22c55e]">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
