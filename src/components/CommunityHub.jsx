import React, { useEffect, useState } from 'react';
import {
  Globe,
  BookOpen,
  FileCheck2,
  Download,
  ExternalLink,
  Search,
  RefreshCw,
  Award,
  Layers,
  User,
  Calendar,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const CommunityHub = () => {
  const {
    communityResources,
    communityAnswerSets,
    isLoadingCommunity,
    fetchCommunityData,
    downloadSolvedPdf,
    downloadResourceFile,
  } = useQuestionBankStore();

  const [activeSubTab, setActiveSubTab] = useState('resources'); // 'resources' | 'solved_sets'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const filteredResources = communityResources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.chapters && r.chapters.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || r.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredAnswerSets = communityAnswerSets.filter((s) => {
    const matchesSearch =
      s.question_bank_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || s.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const allSubjects = Array.from(
    new Set([
      ...communityResources.map((r) => r.subject),
      ...communityAnswerSets.map((s) => s.subject),
    ].filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Globe className="h-4 w-4" />
              Community Knowledge Hub
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Shared Academic Knowledge & Solved Papers
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Open to all students. Browse and download textbooks, verified notes, and AI-reviewed solved question banks.
            </p>
          </div>

          <button
            onClick={fetchCommunityData}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoadingCommunity ? 'animate-spin' : ''}`} />
            Refresh Hub
          </button>
        </div>

        {/* SubTab Switcher & Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex rounded-2xl border border-slate-800 bg-slate-900/80 p-1">
            <button
              onClick={() => setActiveSubTab('resources')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeSubTab === 'resources'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Public Notes & Textbooks ({communityResources.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('solved_sets')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeSubTab === 'solved_sets'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Solved Question Banks ({communityAnswerSets.length})</span>
            </button>
          </div>

          {/* Search & Subject */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search community items..."
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {allSubjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">All Subjects</option>
                {allSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mt-8">
          {isLoadingCommunity ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-2" />
              <p className="text-xs">Fetching shared community content...</p>
            </div>
          ) : activeSubTab === 'resources' ? (
            /* Resources Grid */
            filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/20">
                          {res.subject}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {res.uploader_name}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-white tracking-tight line-clamp-1">
                        {res.name}
                      </h3>

                      {res.chapters && (
                        <p className="mt-1 text-xs text-indigo-300">
                          Chapters: {res.chapters}
                        </p>
                      )}

                      {res.description && (
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                      <span className="text-[11px] text-slate-500">
                        {new Date(res.created_at).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() => downloadResourceFile(res.id, `${res.name.replace(/\s+/g, '_')}.pdf`)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/90 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
                <BookOpen className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-base font-semibold text-slate-300">No Community Resources Yet</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Be the first to share your notes with the student community from the Study Resources tab!
                </p>
              </div>
            )
          ) : (
            /* Solved Question Banks Grid */
            filteredAnswerSets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnswerSets.map((set) => (
                  <div
                    key={set.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                          {set.subject}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {set.author_name}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-white tracking-tight line-clamp-1">
                        {set.question_bank_name}
                      </h3>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 flex-1 text-center">
                          <span className="text-[10px] text-slate-500 uppercase block">Solved Questions</span>
                          <span className="text-sm font-bold text-white">
                            {set.completed_questions} / {set.total_questions}
                          </span>
                        </div>
                        <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-2.5 flex-1 text-center">
                          <span className="text-[10px] text-slate-500 uppercase block">Status</span>
                          <span className="text-xs font-semibold text-emerald-400 uppercase">
                            AI Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                      <span className="text-[11px] text-slate-500">
                        {new Date(set.created_at).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() =>
                          downloadSolvedPdf(
                            set.id,
                            `AcademicStack_${(set.subject || 'Subject').replace(/\s+/g, '_')}_${(set.question_bank_name || 'Solved_QB').replace(/\s+/g, '_')}.pdf`
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Solved PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
                <FileCheck2 className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-4 text-base font-semibold text-slate-300">No Solved Papers Shared Yet</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Generate solutions for your question bank and click "Share with Community" to publish here.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
