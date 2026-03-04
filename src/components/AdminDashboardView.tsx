import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Filter, Download, ChevronDown, MoreHorizontal, CheckCircle, XCircle, Clock, AlertCircle, Settings } from 'lucide-react';
import { collection, onSnapshot, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { curriculum } from '../data/curriculum';
import { ParticipantSetup } from './ParticipantSetup';

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  cbtScore: number | null;
  cbtStatus: 'passed' | 'failed' | 'not_started';
  fpvProgress: number;
  lastActive: string;
  completedLessons?: string[];
}

export function AdminDashboardView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSystemTools, setShowSystemTools] = useState(false);
  const [isCBTEnabled, setIsCBTEnabled] = useState(false);

  // Calculate total lessons for progress percentage
  const totalLessons = curriculum.reduce((acc, module) => acc + module.lessons.length, 0);

  useEffect(() => {
    if (!db) return;

    // Listen to CBT settings
    const settingsRef = doc(db, 'settings', 'cbt');
    const unsubscribeSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setIsCBTEnabled(docSnap.data().enabled || false);
      } else {
        setIsCBTEnabled(false);
      }
    }, (error) => {
      console.error("Error listening to settings:", error);
    });

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const studentsData: Student[] = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Calculate status based on lastActive
        let status: 'active' | 'inactive' | 'pending' = 'active';
        if (!data.lastActive) {
          status = 'pending';
        } else {
          const lastActiveDate = new Date(data.lastActive);
          const now = new Date();
          const diffDays = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 7) status = 'inactive';
        }

        // Calculate progress
        const completedCount = data.completedLessons?.length || 0;
        const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        return {
          id: doc.id,
          name: data.name || 'Unknown',
          email: data.email || '',
          role: data.role || 'student',
          status,
          cbtScore: data.cbtScore || null,
          cbtStatus: data.cbtStatus || 'not_started',
          fpvProgress: progress, // Using general progress as FPV progress proxy for now
          lastActive: data.lastActive ? new Date(data.lastActive).toLocaleDateString() : 'Never',
          completedLessons: data.completedLessons || []
        };
      });
      
      // Filter out admin users if needed, or keep them
      setStudents(studentsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
      if (error.code === 'resource-exhausted') {
        setLoading(false);
        // Set empty students list or keep previous data to prevent crash
        // Optionally set an error flag to display UI feedback
      }
    });

    return () => {
      unsubscribeSettings();
      unsubscribe();
    };
  }, [totalLessons]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'CBT Score', 'CBT Status', 'FPV Progress (%)', 'Last Active'];
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        `"${student.name}"`,
        `"${student.email}"`,
        student.role,
        student.status,
        student.cbtScore || 'N/A',
        student.cbtStatus,
        student.fpvProgress,
        `"${student.lastActive}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'student_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleCBT = async () => {
    try {
      const newState = !isCBTEnabled;
      setIsCBTEnabled(newState);
      await setDoc(doc(db, 'settings', 'cbt'), { enabled: newState }, { merge: true });
    } catch (error) {
      console.error("Error updating CBT settings:", error);
      setIsCBTEnabled(!isCBTEnabled); // Revert on error
    }
  };

  if (loading) {
    return <div className="text-white">Loading student data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Student Records</h1>
          <p className="text-zinc-400">Manage and monitor student progress across all platforms.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button 
            onClick={() => setShowSystemTools(!showSystemTools)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${showSystemTools ? 'bg-zinc-700 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
          >
            <Settings size={18} />
            System Tools
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
            <Users size={18} />
            Add Student
          </button>
        </div>
      </div>

      {showSystemTools && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 overflow-hidden space-y-6"
        >
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Exam Controls</h3>
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Enable CBT Access</h4>
                <p className="text-sm text-zinc-400">Allow students to start the final assessment. Keep disabled until exam day.</p>
              </div>
              <button
                onClick={toggleCBT}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${
                  isCBTEnabled ? 'bg-emerald-500' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isCBTEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-white mb-4">System Administration</h3>
            <div className="bg-zinc-950 rounded-lg p-4 border border-zinc-800">
              <p className="text-sm text-zinc-400 mb-4">
                Use these tools to manage system-wide settings and data. 
                <strong> Note:</strong> Initializing participants will use a secondary authentication instance to create accounts without logging you out.
              </p>
              <ParticipantSetup />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Total Students</h3>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{students.length}</p>
          <p className="text-sm text-emerald-500 mt-2 flex items-center gap-1">
            <span className="bg-emerald-500/10 px-1.5 py-0.5 rounded">Live</span> Real-time data
          </p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">CBT Pass Rate</h3>
            <CheckCircle className="text-emerald-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {students.filter(s => s.cbtStatus !== 'not_started').length > 0 
              ? Math.round((students.filter(s => s.cbtStatus === 'passed').length / students.filter(s => s.cbtStatus !== 'not_started').length) * 100) 
              : 0}%
          </p>
          <p className="text-sm text-zinc-500 mt-2">Based on completed tests</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Avg. Progress</h3>
            <Clock className="text-purple-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {students.length > 0 
              ? Math.round(students.reduce((acc, s) => acc + s.fpvProgress, 0) / students.length) 
              : 0}%
          </p>
          <p className="text-sm text-zinc-500 mt-2">Across all modules</p>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-400 font-medium">Pending Review</h3>
            <AlertCircle className="text-amber-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">
            {students.filter(s => s.status === 'pending').length}
          </p>
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
                <th className="px-6 py-4">Course Progress</th>
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
                          {student.cbtScore ? Math.round(student.cbtScore) : 0}%
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
