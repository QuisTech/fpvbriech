import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, Download, ChevronDown, MoreHorizontal, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  cbtScore: number | null;
  cbtStatus: 'passed' | 'failed' | 'not_started';
  fpvProgress: number;
  lastActive: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@example.com', status: 'active', cbtScore: 85, cbtStatus: 'passed', fpvProgress: 60, lastActive: '2 hours ago' },
  { id: '2', name: 'Sarah Connor', email: 'sarah.c@example.com', status: 'active', cbtScore: 92, cbtStatus: 'passed', fpvProgress: 80, lastActive: '1 day ago' },
  { id: '3', name: 'Mike Ross', email: 'mike.r@example.com', status: 'pending', cbtScore: null, cbtStatus: 'not_started', fpvProgress: 0, lastActive: 'Never' },
  { id: '4', name: 'Jessica Pearson', email: 'jessica.p@example.com', status: 'active', cbtScore: 65, cbtStatus: 'failed', fpvProgress: 45, lastActive: '3 hours ago' },
  { id: '5', name: 'Harvey Specter', email: 'harvey.s@example.com', status: 'active', cbtScore: 98, cbtStatus: 'passed', fpvProgress: 100, lastActive: '5 mins ago' },
  { id: '6', name: 'Louis Litt', email: 'louis.l@example.com', status: 'inactive', cbtScore: 40, cbtStatus: 'failed', fpvProgress: 20, lastActive: '1 week ago' },
  { id: '7', name: 'Donna Paulsen', email: 'donna.p@example.com', status: 'active', cbtScore: 88, cbtStatus: 'passed', fpvProgress: 90, lastActive: '1 hour ago' },
];

export function AdminDashboardView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Records</h1>
          <p className="text-zinc-400">Manage and monitor student progress across all platforms.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors">
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            <Users size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Total Students</h3>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{MOCK_STUDENTS.length}</p>
          <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
            <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded">+12%</span> from last month
          </p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">CBT Pass Rate</h3>
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {Math.round((MOCK_STUDENTS.filter(s => s.cbtStatus === 'passed').length / MOCK_STUDENTS.filter(s => s.cbtStatus !== 'not_started').length) * 100)}%
          </p>
          <p className="text-sm text-zinc-500 mt-2">Based on completed tests</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Avg. FPV Progress</h3>
            <Clock className="text-purple-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {Math.round(MOCK_STUDENTS.reduce((acc, s) => acc + s.fpvProgress, 0) / MOCK_STUDENTS.length)}%
          </p>
          <p className="text-sm text-zinc-500 mt-2">Across all modules</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Pending Review</h3>
            <AlertCircle className="text-amber-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">3</p>
          <p className="text-sm text-zinc-500 mt-2">Requires attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          <button className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-medium">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">CBT Score</th>
                <th className="px-6 py-4">FPV Progress</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-medium border border-zinc-700">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{student.name}</div>
                        <div className="text-zinc-500 text-xs">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      student.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                      student.status === 'inactive' ? 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20' :
                      'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.cbtStatus === 'not_started' ? (
                      <span className="text-zinc-600 italic">Not Started</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-medium ${
                          student.cbtStatus === 'passed' ? 'text-emerald-500' : 'text-red-500'
                        }`}>
                          {student.cbtScore}%
                        </span>
                        {student.cbtStatus === 'passed' ? (
                          <CheckCircle size={14} className="text-emerald-500" />
                        ) : (
                          <XCircle size={14} className="text-red-500" />
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full rounded-full" 
                          style={{ width: `${student.fpvProgress}%` }}
                        />
                      </div>
                      <span className="text-zinc-400 text-xs w-8">{student.fpvProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {student.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
