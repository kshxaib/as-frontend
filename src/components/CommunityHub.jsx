import React, { useEffect, useState } from 'react';
import {
  Globe,
  BookOpen,
  FileCheck2,
  Download,
  Search,
  RefreshCw,
  User,
  Calendar,
  Layers,
  Eye,
  Sparkles,
  Clock,
  Award,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { EmptyState } from './ui/EmptyState';
import { CommunityAnswerViewer } from './CommunityAnswerViewer';
import { CommunityPredictedPaperViewer } from './CommunityPredictedPaperViewer';
import api from '../api/client';

export const CommunityHub = () => {
  const {
    communityResources,
    communityAnswerSets,
    communityPredictedPapers,
    isLoadingCommunity,
    fetchCommunityData,
    downloadSolvedPdf,
    downloadResourceFile,
    downloadPredictedPaperPdf,
    openCommunityViewer,
    openCommunityPredictedViewer,
  } = useQuestionBankStore();

  const [activeSubTab, setActiveSubTab] = useState('resources'); // 'resources' | 'solved_sets' | 'predicted_papers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [downloadingPaperId, setDownloadingPaperId] = useState(null);

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

  const filteredPredictedPapers = (communityPredictedPapers || []).filter((p) => {
    const matchesSearch =
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subject && p.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.creator_name && p.creator_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || p.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const allSubjects = Array.from(
    new Set([
      ...communityResources.map((r) => r.subject),
      ...communityAnswerSets.map((s) => s.subject),
      ...(communityPredictedPapers || []).map((p) => p.subject),
    ].filter(Boolean))
  );

  const handleCardDownloadPdf = async (paper) => {
    try {
      setDownloadingPaperId(paper.id);
      const res = await api.get(`/community/predicted-papers/${paper.id}`);
      if (res.data?.paper_data) {
        const filename = `Predicted_${(paper.subject || 'Exam').replace(/\s+/g, '_')}_Paper.pdf`;
        await downloadPredictedPaperPdf(res.data.paper_data, filename);
      }
    } catch {
      // ignore
    } finally {
      setDownloadingPaperId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-[var(--border)]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--community)] flex items-center gap-1.5 mb-1">
              <Globe className="h-3.5 w-3.5 stroke-[1.5]" />
              The Commons
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight">
              Shared Academic Archive & Solved Papers
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              Open to all students. Browse notes, solved question banks, and AI-predicted examination papers.
            </p>
          </div>

          <button
            onClick={fetchCommunityData}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 font-mono text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <RefreshCw className={`h-3 w-3 stroke-[1.5] ${isLoadingCommunity ? 'animate-spin' : ''}`} />
            <span>Refresh Archive</span>
          </button>
        </div>

        {/* SubTab Switcher & Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-1 gap-1">
            <button
              onClick={() => setActiveSubTab('resources')}
              className={`flex items-center gap-2 rounded-[6px] px-3.5 py-1.5 font-mono text-xs transition-all ${
                activeSubTab === 'resources'
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] font-semibold border border-[var(--border)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Public Notes ({communityResources.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('solved_sets')}
              className={`flex items-center gap-2 rounded-[6px] px-3.5 py-1.5 font-mono text-xs transition-all ${
                activeSubTab === 'solved_sets'
                  ? 'bg-[var(--surface)] text-[var(--community)] font-semibold border border-[var(--border)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileCheck2 className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Solved Question Banks ({communityAnswerSets.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('predicted_papers')}
              className={`flex items-center gap-2 rounded-[6px] px-3.5 py-1.5 font-mono text-xs transition-all ${
                activeSubTab === 'predicted_papers'
                  ? 'bg-[var(--surface)] text-[var(--primary)] font-semibold border border-[var(--border)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 stroke-[1.5]" />
              <span>Predicted Papers ({(communityPredictedPapers || []).length})</span>
            </button>
          </div>

          {/* Search & Subject */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive..."
                className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
              />
            </div>

            {allSubjects.length > 0 && (
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
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
        <div className="mt-6">
          {isLoadingCommunity ? (
            <div className="py-24 text-center text-[var(--text-muted)]">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[var(--primary)] mb-2 stroke-[1.5]" />
              <p className="font-mono text-xs">Querying The Commons archive...</p>
            </div>
          ) : activeSubTab === 'resources' ? (
            /* Resources Grid */
            filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-strong)] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)] truncate">
                          {res.subject}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {res.uploader_name || 'Academic'}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-normal text-[var(--text-primary)] line-clamp-1">
                        {res.name}
                      </h3>

                      {res.chapters && (
                        <p className="mt-1 font-mono text-[11px] text-[var(--text-secondary)]">
                          Chapters: {res.chapters}
                        </p>
                      )}

                      {res.description && (
                        <p className="mt-2 text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(res.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{res.total_chunks || 0} chunks</span>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">Verified Note</span>
                      <button
                        onClick={() => downloadResourceFile(res.id, `${res.name.replace(/\s+/g, '_')}.pdf`)}
                        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--primary)] transition-all shadow-xs"
                      >
                        <Download className="h-3 w-3 stroke-[1.5]" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No Public Notes in The Commons Yet"
                description="Upload textbooks or notes and toggle 'The Commons' visibility to share with peers."
              />
            )
          ) : activeSubTab === 'solved_sets' ? (
            /* Solved Question Banks Grid */
            filteredAnswerSets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAnswerSets.map((set) => (
                  <div
                    key={set.id}
                    className="flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[rgba(200,168,32,0.4)] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-medium text-[var(--community)] bg-[rgba(200,168,32,0.1)] px-2 py-0.5 rounded-[4px] border border-[rgba(200,168,32,0.2)] truncate">
                          {set.subject || 'Subject'}
                        </span>
                        <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {set.author_name || 'Academic'}
                        </span>
                      </div>

                      <h3 className="font-display text-base font-normal text-[var(--text-primary)] line-clamp-2">
                        {set.question_bank_name}
                      </h3>

                      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)] font-mono">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {set.completed_questions}/{set.total_questions} Solved
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(set.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--community)] font-medium">Solved Manuscript</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openCommunityViewer(set.id)}
                          className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--community)] hover:text-[var(--community)] transition-all shadow-xs"
                        >
                          <Eye className="h-3 w-3 stroke-[1.5]" />
                          <span>View Answers</span>
                        </button>

                        <button
                          onClick={() =>
                            downloadSolvedPdf(
                              set.id,
                              `AcademicStack_${(set.subject || 'Subject').replace(/\s+/g, '_')}_${(set.question_bank_name || 'Solved_QB').replace(/\s+/g, '_')}.pdf`
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--community)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--community-foreground)] hover:opacity-90 transition-all shadow-xs"
                        >
                          <Download className="h-3 w-3 stroke-[2]" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileCheck2}
                title="No Solved Question Banks Shared Yet"
                description="Generate solutions for your question bank and click 'Share with The Commons' to contribute."
              />
            )
          ) : (
            /* ── Predicted Papers Grid (3rd SubTab) ── */
            filteredPredictedPapers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPredictedPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--primary)] hover:shadow-sm transition-all"
                  >
                    <div>
                      {/* Top Meta Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-medium text-[var(--primary)] bg-[rgba(15,118,110,0.1)] px-2.5 py-0.5 rounded-[4px] border border-[rgba(15,118,110,0.25)] truncate">
                          {paper.subject || 'Predicted Paper'}
                        </span>
                        {paper.views !== undefined && (
                          <span className="font-mono text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {paper.views} view{paper.views === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>

                      {/* Paper Title */}
                      <h3 className="font-display text-base font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                        {paper.title || 'Predicted Model Examination Paper'}
                      </h3>

                      {/* Prominent Creator Highlight Badge */}
                      <div className="mt-3 flex items-center gap-2 rounded-[8px] border border-[var(--primary)]/30 bg-gradient-to-r from-[rgba(15,118,110,0.12)] via-[rgba(15,118,110,0.05)] to-transparent p-2">
                        <div className="h-7 w-7 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                          {(paper.creator_name || 'S')[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider leading-none">
                            Predicted & Shared by
                          </p>
                          <p className="text-xs font-bold text-[var(--primary)] truncate mt-0.5">
                            {paper.creator_name || 'Student Scholar'}
                          </p>
                        </div>
                      </div>

                      {/* Exam Specs (Time, Marks, Date) */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-secondary)] font-mono">
                        {paper.maximum_marks && (
                          <span className="flex items-center gap-1 bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                            <Award className="h-3 w-3 text-[var(--primary)]" />
                            {paper.maximum_marks} Marks
                          </span>
                        )}
                        {paper.time_allowed && (
                          <span className="flex items-center gap-1 bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
                            <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                            {paper.time_allowed}
                          </span>
                        )}
                        {paper.created_at && (
                          <span className="flex items-center gap-1 text-[var(--text-muted)]">
                            <Calendar className="h-3 w-3" />
                            {new Date(paper.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-5 border-t border-[var(--border-subtle)] pt-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[var(--primary)] font-semibold flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        AI Model Paper
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openCommunityPredictedViewer(paper.id)}
                          className="inline-flex items-center gap-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all shadow-xs"
                        >
                          <Eye className="h-3 w-3 stroke-[1.5]" />
                          <span>View Full Paper</span>
                        </button>

                        <button
                          onClick={() => handleCardDownloadPdf(paper)}
                          disabled={downloadingPaperId === paper.id}
                          className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--primary)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
                        >
                          <Download className={`h-3 w-3 stroke-[2] ${downloadingPaperId === paper.id ? 'animate-spin' : ''}`} />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No Predicted Papers in The Commons Yet"
                description="Synthesize an AI Predicted Examination Paper and click 'Share with The Commons' to share with fellow students."
              />
            )
          )}
        </div>
      </div>

      {/* In-Browser Solved Answers Viewer Modal */}
      <CommunityAnswerViewer />

      {/* In-Browser Predicted Paper Viewer Modal */}
      <CommunityPredictedPaperViewer />
    </div>
  );
};
