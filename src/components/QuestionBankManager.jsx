import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';

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
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-rose-400 hover:underline">Dismiss</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={clearFeedback} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <Layers className="h-4 w-4" />
              Exam Paper Management
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Question Banks & AI Extraction
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Upload university previous year question papers. Link them to indexed study materials and extract questions.
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
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Question Bank PDF</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question banks..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Question Banks List */}
        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-2" />
              <p className="text-xs">Loading question banks...</p>
            </div>
          ) : filteredBanks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanks.map((qb) => (
                <div
                  key={qb.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/20">
                        {qb.subject}
                      </span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400 uppercase">
                        {qb.status}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white tracking-tight line-clamp-1">
                      {qb.name}
                    </h3>

                    <div className="mt-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 p-3 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">Linked Resources: </span>
                      {qb.resource_ids ? (
                        <span className="text-indigo-300 font-mono">IDs [{qb.resource_ids}]</span>
                      ) : (
                        <span className="text-slate-500">None linked (All Resources)</span>
                      )}
                    </div>
                  </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (qb.status === 'extracted') {
                            setReExtractCandidate(qb);
                          } else {
                            extractQuestions(qb.id);
                          }
                        }}
                        disabled={!!extractingQBs[qb.id] || isUploadingQuestionBank}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className={`h-3.5 w-3.5 text-indigo-400 ${extractingQBs[qb.id] ? 'animate-spin' : ''}`} />
                        <span>{extractingQBs[qb.id] ? 'Extracting...' : qb.status === 'extracted' ? 'Re-extract' : 'AI Extract'}</span>
                      </button>

                      <button
                        onClick={() => downloadQuestionBankFile(qb.id, `${qb.name.replace(/\s+/g, '_')}.pdf`)}
                        title="Download Original Exam Paper PDF"
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleReviewBank(qb.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>Review & Solve</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
              <FileText className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-300">No Question Banks Found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Upload your semester question paper or assignment PDF to extract structured questions with AI.
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Upload First Paper
              </button>
            </div>
          )}
        </div>

        {/* Re-extract Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!reExtractCandidate}
          title="Re-extract Question Bank?"
          message={`Existing extracted questions for "${reExtractCandidate?.name}" will be replaced with fresh AI extraction. Any custom modifications will be reset.`}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white tracking-tight">Upload Question Bank PDF</h3>
              <p className="mt-1 text-xs text-slate-400">Select which study resources this question bank should draw knowledge from.</p>

              <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Paper Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. End Semester Exam 2025"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Database Management Systems"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Resource Linking Checkboxes */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Link Study Resources (for strict RAG grounding)
                  </label>
                  <div className="max-h-36 overflow-y-auto space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3">
                    {resources.length > 0 ? (
                      resources.map((r) => (
                        <label key={r.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedResourceIds.includes(r.id)}
                            onChange={() => handleToggleResourceId(r.id)}
                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                          />
                          <span className="truncate">{r.name} ({r.subject})</span>
                          {r.status === 'indexed' && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">indexed</span>
                          )}
                        </label>
                      ))
                    ) : (
                      <p className="text-[11px] text-slate-500 italic">No resources available. You can link them later.</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Question Bank PDF *</label>
                  <input
                    type="file"
                    required
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-indigo-400 hover:file:bg-slate-700"
                  />
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingQuestionBank}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isUploadingQuestionBank ? 'Uploading...' : 'Create Question Bank'}
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
