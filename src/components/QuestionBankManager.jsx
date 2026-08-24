import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  ArrowRight,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Workflow,
  Link,
  Layers,
  X,
  Loader2,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { StatusBadge } from './ui/StatusBadge';
import { EmptyState } from './ui/EmptyState';

export const QuestionBankManager = () => {
  const {
    questionBanks,
    resources,
    isLoading,
    isUploadingQuestionBank,
    extractingQBs,
    error,
    successMessage,
    fetchQuestionBanks,
    fetchResources,
    uploadQuestionBank,
    selectQuestionBank,
    extractQuestions,
    setActiveTab,
    downloadQuestionBankFile,
    clearFeedback,
  } = useQuestionBankStore();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reExtractCandidate, setReExtractCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchQuestionBanks();
    fetchResources();
  }, [fetchQuestionBanks, fetchResources, user]);

  const handleToggleResourceId = (id) => {
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('user_id', user?.id || 1);
    formData.append('name', name);
    formData.append('subject', subject);
    formData.append('resource_ids', selectedResourceIds.join(','));
    formData.append('file', file);

    const res = await uploadQuestionBank(formData);
    if (res.success) {
      setIsUploadModalOpen(false);
      setName('');
      setSubject('');
      setSelectedResourceIds([]);
      setFile(null);
    }
  };

  const handleReviewBank = async (bankId) => {
    await selectQuestionBank(bankId);
    setActiveTab('review');
  };

  const filteredBanks = questionBanks.filter((qb) =>
    qb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qb.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Feedback Banners */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3.5 text-xs text-[var(--error)]">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">Dismiss</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-[8px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-3.5 text-xs text-[var(--success)]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs hover:underline font-mono">Dismiss</button>
          </div>
        )}

        {/* Top Masthead */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-[var(--border)]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-1">
              <Layers className="h-3.5 w-3.5 stroke-[1.5]" />
              Examination Archive
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight">
              Question Banks & Exam Ingestion
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              Ingest semester question papers, link relevant study notes, and extract questions with explicit mark allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('login');
                } else {
                  setIsUploadModalOpen(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2]" />
              <span>Upload Question Paper</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question banks by title or subject..."
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Question Banks List */}
        <div className="mt-6">
          {isLoading ? (
            <div className="py-24 text-center text-[var(--text-muted)]">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[var(--primary)] mb-2 stroke-[1.5]" />
              <p className="font-mono text-xs">Retrieving examination archives...</p>
            </div>
          ) : filteredBanks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBanks.map((qb) => {
                const isExtracting = !!extractingQBs[qb.id];
                return (
                  <div
                    key={qb.id}
                    className="flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-strong)] transition-all"
                  >
                    <div>
                      {/* Subject & Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)] truncate">
                          {qb.subject}
                        </span>
                        {qb.status === 'extracted' ? (
                          <StatusBadge variant="success">Extracted</StatusBadge>
                        ) : isExtracting ? (
                          <StatusBadge variant="amber" pulse>Extracting...</StatusBadge>
                        ) : (
                          <StatusBadge variant="neutral">Pending</StatusBadge>
                        )}
                      </div>

                      <h3 className="font-display text-base font-normal text-[var(--text-primary)] line-clamp-1">
                        {qb.name}
                      </h3>

                      {/* Linked Resources Strip */}
                      <div className="mt-3 rounded-[6px] bg-[var(--surface-well)] border border-[var(--border-subtle)] p-2.5 text-xs text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5 mb-1 font-mono text-[11px]">
                          <Link className="h-3 w-3 stroke-[1.5] text-[var(--community)]" />
                          <span className="font-medium text-[var(--text-secondary)]">Linked Notes:</span>
                        </div>
                        {qb.resource_ids ? (
                          <p className="font-mono text-[10px] text-[var(--community)] truncate">
                            Resource IDs: [{qb.resource_ids}]
                          </p>
                        ) : (
                          <p className="text-[11px] text-[var(--text-disabled)] italic">
                            All indexed study materials
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (qb.status === 'extracted') {
                              setReExtractCandidate(qb);
                            } else {
                              extractQuestions(qb.id);
                            }
                          }}
                          disabled={isExtracting || isUploadingQuestionBank}
                          className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ai)] hover:bg-[rgba(245,158,11,0.15)] transition-all disabled:opacity-40"
                        >
                          <Workflow className={`h-3 w-3 stroke-[1.5] ${isExtracting ? 'animate-spin' : ''}`} />
                          <span>{isExtracting ? 'Extracting...' : qb.status === 'extracted' ? 'Re-extract' : 'AI Extract'}</span>
                        </button>

                        <button
                          onClick={() => downloadQuestionBankFile(qb.id, `${qb.name.replace(/\s+/g, '_')}.pdf`)}
                          title="Download Original Exam PDF"
                          className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleReviewBank(qb.id)}
                        className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-[var(--primary)] hover:underline transition-colors"
                      >
                        <span>Review & Solve</span>
                        <ArrowRight className="h-3 w-3 stroke-[2]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Layers}
              title="No Question Banks Found"
              description="Upload university previous year examination papers or semester tests to extract questions and allocate marks with AI."
              actionText="Upload First Question Paper"
              onAction={() => setIsUploadModalOpen(true)}
            />
          )}
        </div>

        {/* Re-extract Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!reExtractCandidate}
          title="Re-extract Question Bank?"
          message={`Existing extracted questions for "${reExtractCandidate?.name}" will be replaced with fresh AI extraction. Any custom question modifications will be reset.`}
          confirmText="Yes, Re-extract Questions"
          cancelText="Cancel"
          confirmVariant="warning"
          iconType="sparkles"
          onConfirm={() => {
            if (reExtractCandidate) {
              extractQuestions(reExtractCandidate.id);
              setReExtractCandidate(null);
            }
          }}
          onCancel={() => setReExtractCandidate(null)}
        />

        {/* Live Question Extraction Progress Modal */}
        <AiProgressModal
          isOpen={Object.values(extractingQBs).some(Boolean)}
          type="extraction"
          title="AI Question Extraction in Progress"
          subtitle="AcademicStack is scanning exam paper layout, parsing questions, and resolving marks with AI router."
        />

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)] my-auto">

              
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute right-4 top-4 rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="h-4 w-4 stroke-[1.5]" />
              </button>

              <div className="pb-4 border-b border-[var(--border-subtle)] pr-6 mb-5">
                <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
                  Upload Question Bank PDF
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Link specific study resources to ground the examination answer generation pipeline.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. End Semester Exam 2025"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Database Management Systems"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                {/* Resource Linking Checkboxes */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                    Link Study Resources (for strict RAG grounding)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-2 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-3">
                    {resources.length > 0 ? (
                      resources.map((r) => (
                        <label key={r.id} className="flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedResourceIds.includes(r.id)}
                            onChange={() => handleToggleResourceId(r.id)}
                            className="rounded border-[var(--border)] bg-[var(--surface)] text-[var(--primary)] focus:ring-0"
                          />
                          <span className="truncate">{r.name} ({r.subject})</span>
                          {r.status === 'indexed' && (
                            <span className="font-mono text-[9px] text-[var(--success)] bg-[rgba(34,197,94,0.1)] px-1 rounded border border-[rgba(34,197,94,0.2)]">
                              indexed
                            </span>
                          )}
                        </label>
                      ))
                    ) : (
                      <p className="text-[11px] text-[var(--text-disabled)] italic font-mono">
                        No study materials uploaded yet. All indexed notes will be used by default.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Exam Paper PDF *
                  </label>
                  <input
                    type="file"
                    required
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-1.5 file:px-3 file:rounded-[6px] file:border-0 file:text-xs file:font-semibold file:bg-[var(--surface-well)] file:text-[var(--text-primary)] hover:file:bg-[var(--surface-muted)] cursor-pointer"
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingQuestionBank}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isUploadingQuestionBank && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{isUploadingQuestionBank ? 'Uploading Paper...' : 'Create Question Bank'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
