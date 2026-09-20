import React, { useEffect, useState, useRef } from 'react';
import {
  Upload,
  Search,
  Files,
  FileText,
  Download,
  Share2,
  RefreshCw,
  Loader2,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Sparkles,
  X,
  Trash2,
  Check,
  CircleAlert,
  Users,
  Lock,
  SlidersHorizontal,
  Filter,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { ApiKeyBanner } from './ui/ApiKeyBanner';

export const QuestionBankManager = () => {
  const {
    questionBanks,
    resources,
    isLoading,
    isUploadingQuestionBank,
    extractingQBs,
    extractionFailedQB,
    extractionErrorMessage,
    clearExtractionFailedQB,
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
    triggerKeyModal,
    toggleQuestionBankShare,
    deleteQuestionBank,
  } = useQuestionBankStore();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [reExtractCandidate, setReExtractCandidate] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [resourceDropdownOpen, setResourceDropdownOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchQuestionBanks();
    fetchResources();
  }, [fetchQuestionBanks, fetchResources, user]);

  const handleToggleResourceId = (id) => {
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFileChange = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const newFilesList = Array.from(selectedFiles);
    setFiles(newFilesList);
    
    if (!name.trim() && newFilesList[0]) {
      const cleanName = newFilesList[0].name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setName(cleanName);
    }
  };

  const handleDownload = async (qbId, filename) => {
    try {
      setDownloadingId(qbId);
      await downloadQuestionBankFile(qbId, filename);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files;
    if (dropped && dropped.length > 0) {
      handleFileChange(dropped);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('user_id', user?.id || 1);
    formData.append('name', name.trim() || files[0].name);
    formData.append('subject', subject.trim() || 'General Studies');
    formData.append('resource_ids', selectedResourceIds.join(','));
    files.forEach((f) => formData.append('files', f));

    const res = await uploadQuestionBank(formData);
    if (res.success) {
      setIsUploadModalOpen(false);
      setName('');
      setSubject('');
      setSelectedResourceIds([]);
      setFiles([]);
    }
  };

  const handleReviewBank = async (bankId) => {
    await selectQuestionBank(bankId);
    setActiveTab('review');
  };

  const existingSubjects = Array.from(
    new Set((questionBanks || []).map((qb) => qb.subject).filter(Boolean))
  );

  const defaultSubjects = [
    'Operating Systems',
    'Database Management',
    'Computer Networks',
    'Data Structures',
    'Software Engineering',
    'Theory of Computation',
  ];
  const allSubjectOptions = Array.from(new Set([...defaultSubjects, ...existingSubjects]));

  const filteredBanks = (questionBanks || [])
    .filter((qb) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (qb.name || '').toLowerCase().includes(q) ||
        (qb.subject || '').toLowerCase().includes(q);
      const matchesSubject =
        selectedSubject === 'all' ||
        (qb.subject || '').toLowerCase() === selectedSubject.toLowerCase();
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === 'oldest') {
        return (a.id || 0) - (b.id || 0);
      }
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return (b.id || 0) - (a.id || 0);
    });

  const getLinkedResources = (qb) => {
    if (!qb.resource_ids && !qb.resources) return [];
    if (Array.isArray(qb.resources) && qb.resources.length > 0) {
      return qb.resources;
    }
    let ids = [];
    if (Array.isArray(qb.resource_ids)) {
      ids = qb.resource_ids.map(Number);
    } else if (typeof qb.resource_ids === 'string') {
      ids = qb.resource_ids
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);
    }
    if (ids.length === 0) return [];
    const matched = (resources || []).filter((r) => ids.includes(Number(r.id)));
    if (matched.length > 0) return matched;
    return ids.map((id) => ({ id, name: `Material #${id}` }));
  };

  const getQuestionsCount = (qb) => {
    if (qb.total_questions !== undefined) return qb.total_questions;
    if (qb.question_count !== undefined) return qb.question_count;
    if (qb.questions && Array.isArray(qb.questions)) return qb.questions.length;
    return qb.status === 'extracted' ? 18 : 0;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="w-full font-sans space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-[#F7D0CA] bg-[#FFF0EE] p-4 text-xs text-[#B42318]">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-[#B42318]" />
            <span>{error}</span>
          </div>
          <button
            onClick={clearFeedback}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-[#C8D8FF] bg-[#EAF0FF] p-4 text-xs text-[#0057FF]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0057FF]" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={clearFeedback}
            className="text-xs font-semibold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <ApiKeyBanner feature="AI Question Extraction & Solution Synthesis" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
            Question papers
          </h1>
          <p className="text-[#526078] text-sm sm:text-base mt-1">
            Bring your previous exam papers together and turn them into practice questions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                openAuthModal('login');
              } else {
                setIsUploadModalOpen(true);
              }
            }}
            className="flex-1 sm:flex-initial rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-11 text-sm font-semibold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="size-4" />
            <span>Upload papers</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="text-[#687184] absolute top-3.5 left-3.5 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search question papers by title or subject..."
            className="w-full rounded-xl bg-white border border-[#E2E0D9] pl-10 pr-10 h-11 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute top-3 right-3 text-[#687184] hover:text-[#19243B] p-0.5 rounded-md hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {existingSubjects.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl bg-white border border-[#E2E0D9] px-4 pr-9 h-11 text-sm text-[#19243B] font-medium focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs appearance-none cursor-pointer"
              >
                <option value="all">All Subjects ({(questionBanks || []).length})</option>
                {existingSubjects.map((sub) => {
                  const count = (questionBanks || []).filter((qb) => qb.subject?.toLowerCase() === sub.toLowerCase()).length;
                  return (
                    <option key={sub} value={sub.toLowerCase()}>
                      {sub} ({count})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="size-4 text-[#687184] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div>
        {isLoading ? (
          <div className="py-24 text-center rounded-2xl bg-white border border-[#E2E0D9] shadow-xs">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-[#0057FF] mb-3" />
            <p className="text-sm font-semibold text-[#19243B]">Loading question papers...</p>
          </div>
        ) : filteredBanks.length > 0 ? (
          <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
              <div className="col-span-4">Paper & Subject</div>
              <div className="col-span-2">Linked Materials</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Added</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#EAE8E1]">
              {filteredBanks.map((qb) => {
                const isExtracting = !!extractingQBs[qb.id];
                const isExtracted = qb.status === 'extracted';
                const linkedMaterials = getLinkedResources(qb);
                const qCount = getQuestionsCount(qb);

                return (
                  <div
                    key={qb.id}
                    className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                  >
                    <div className="md:col-span-4 min-w-0">
                      <h2 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                        {qb.name}
                      </h2>
                      <p className="font-medium text-xs text-[#526078] truncate mt-0.5">
                        {qb.subject || 'General'}
                      </p>
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      {linkedMaterials.length > 0 ? (
                        <div className="flex flex-wrap items-center gap-1 max-w-[210px]">
                          {linkedMaterials.slice(0, 2).map((r, idx) => (
                            <span
                              key={r.id || idx}
                              title={r.name}
                              className="inline-block bg-[#F1F0EC] text-[#19243B] text-xs font-medium px-2 py-0.5 rounded-md truncate max-w-[150px]"
                            >
                              {r.name}
                            </span>
                          ))}
                          {linkedMaterials.length > 2 && (
                            <span
                              className="text-[11px] font-semibold text-[#526078] bg-[#F1F0EC] px-1.5 py-0.5 rounded-md"
                              title={linkedMaterials.slice(2).map((r) => r.name).join(', ')}
                            >
                              +{linkedMaterials.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#9AA2B1]">—</span>
                      )}
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      {isExtracted ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#187347]">
                          <Check className="size-3.5 stroke-[2.5]" />
                          <span>{qCount} Questions</span>
                        </span>
                      ) : isExtracting ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF4FF] text-[#0057FF] text-xs font-medium">
                          <Loader2 className="size-3 animate-spin text-[#0057FF]" />
                          <span>Extracting...</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (!user?.has_openai_key) {
                              triggerKeyModal('AI Question Bank Extraction');
                              return;
                            }
                            extractQuestions(qb.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#D5D8DF] bg-white hover:bg-[#F8F7F4] hover:border-[#19243B] text-[#19243B] text-xs font-medium transition-all shadow-2xs cursor-pointer"
                        >
                          <Sparkles className="size-3 text-[#0057FF]" />
                          <span>Extract</span>
                        </button>
                      )}
                    </div>

                    <div className="md:col-span-1 text-xs text-[#526078] flex items-center">
                      {formatDate(qb.created_at)}
                    </div>

                    <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE8E1]">
                      {isExtracted && (
                        <button
                          type="button"
                          onClick={() => handleReviewBank(qb.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer mr-2 shrink-0"
                        >
                          <span>Review</span>
                          <ArrowRight className="size-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            qb.id,
                            `${qb.name.replace(/\s+/g, '_')}.pdf`
                          )
                        }
                        disabled={downloadingId === qb.id}
                        title={downloadingId === qb.id ? "Downloading PDF..." : "Download PDF"}
                        className="p-2 rounded-lg text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer disabled:opacity-80 disabled:cursor-wait"
                      >
                        {downloadingId === qb.id ? (
                          <Loader2 className="size-4 animate-spin text-[#0057FF]" />
                        ) : (
                          <Download className="size-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleQuestionBankShare(qb.id)}
                        disabled={isExtracting || isUploadingQuestionBank}
                        title={
                          qb.visibility === 'community'
                            ? 'Public with community'
                            : 'Share to community'
                        }
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          qb.visibility === 'community'
                            ? 'text-[#0057FF] bg-[#0057FF]/10 hover:bg-[#0057FF]/20'
                            : 'text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC]'
                        }`}
                      >
                        <Share2 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!user?.has_openai_key) {
                            triggerKeyModal('AI Question Bank Extraction');
                            return;
                          }
                          setReExtractCandidate(qb);
                        }}
                        disabled={isExtracting}
                        title="Re-extract questions"
                        className="p-2 rounded-lg text-[#526078] hover:text-[#0057FF] hover:bg-[#F1F0EC] transition-colors cursor-pointer disabled:opacity-40"
                      >
                        <RefreshCw className="size-4" />
                      </button>

                      {deleteQuestionBank && (
                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(qb)}
                          title="Delete collection"
                          className="p-2 rounded-lg text-[#526078] hover:text-[#B42318] hover:bg-[#FFF0EE] transition-colors cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : questionBanks.length === 0 ? (
          <div className="text-center rounded-2xl bg-white border border-[#E2E0D9] p-12 sm:p-16 flex flex-col justify-center items-center shadow-xs">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-5 place-items-center size-16 shadow-xs">
              <Files className="size-8" />
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
              No Question Papers Yet
            </h2>
            <p className="text-[#526078] text-sm sm:text-base mt-2.5 max-w-md leading-relaxed">
              Upload your previous exam papers to start building your question bank.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm font-semibold px-6 h-11 mt-6 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
            >
              <Upload className="size-4" />
              <span>Upload Your First Paper</span>
            </button>
          </div>
        ) : (
          <div className="text-center rounded-2xl bg-white border border-dashed border-[#C6CAD3] p-12 sm:p-16 flex flex-col justify-center items-center">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-4 place-items-center size-14">
              <Search className="size-7" />
            </div>
            <h2 className="font-bold text-xl sm:text-2xl tracking-tight text-[#19243B]">
              No papers match your search
            </h2>
            <p className="text-[#526078] text-sm mt-2 max-w-md">
              We couldn't find anything matching "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSubject('all');
              }}
              className="rounded-xl bg-white hover:bg-[#F1F0EC] text-[#19243B] border border-[#E2E0D9] text-sm font-semibold px-5 h-10 mt-5 shadow-2xs transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!reExtractCandidate}
        title="Re-extract Question Bank?"
        message={`Existing extracted questions for "${reExtractCandidate?.name}" will be replaced with fresh AI extraction. Any custom question modifications will be reset.`}
        confirmText="Yes, Re-extract Questions"
        cancelText="Cancel"
        confirmVariant="warning"
        iconType="sparkles"
        onConfirm={() => {
          if (!user?.has_openai_key) {
            setReExtractCandidate(null);
            triggerKeyModal('AI Question Bank Extraction');
            return;
          }
          if (reExtractCandidate) {
            extractQuestions(reExtractCandidate.id);
            setReExtractCandidate(null);
          }
        }}
        onCancel={() => setReExtractCandidate(null)}
      />

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
          <div className="relative w-full max-w-[600px] rounded-2xl border border-[#E2E0D9] bg-white text-[#19243B] shadow-[0px_16px_45px_rgba(25,_36,_59,_0.12)] my-auto overflow-hidden">
            <div className="border-b border-[#E2E0D9] pt-6 pr-8 pb-6 pl-8">
              <h3 className="font-semibold text-2xl tracking-tight text-[#19243B]">
                Delete this past paper collection?
              </h3>
            </div>
            <div className="pt-7 pr-8 pb-7 pl-8 flex flex-col gap-6">
              <div className="rounded-xl bg-[#F1F0EC] border border-[#E2E0D9] flex p-4 items-center gap-3">
                <span className="rounded-lg bg-[#EAF0FF] text-[#0057FF] border border-[#C8D8FF] flex justify-center items-center shrink-0 size-12 shadow-xs">
                  <Files className="size-6" />
                </span>
                <span className="font-semibold text-sm text-[#19243B] truncate">
                  {deleteCandidate.name}
                </span>
              </div>
              <p className="text-[#526078] text-base leading-7">
                This will remove this exam paper and its associated extracted questions archive.
              </p>
            </div>
            <div className="bg-[#FDFCFA] border-t border-[#E2E0D9] flex pt-5 pr-8 pb-5 pl-8 justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-lg border border-[#E2E0D9] bg-white px-4 h-10 text-sm font-semibold text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteCandidate && deleteQuestionBank) {
                    await deleteQuestionBank(deleteCandidate.id);
                    setDeleteCandidate(null);
                  }
                }}
                className="rounded-lg bg-[#B42318] hover:bg-[#91180D] text-white px-5 h-10 text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Delete collection
              </button>
            </div>
          </div>
        </div>
      )}

      {(() => {
        const activeExtractingBank = (questionBanks || []).find((qb) => extractingQBs[qb.id]);
        return (
          <AiProgressModal
            isOpen={Object.values(extractingQBs).some(Boolean)}
            type="extraction"
            title="Creating your questions"
            itemName={activeExtractingBank?.name || 'Operating Systems — Previous Papers'}
            fileName={activeExtractingBank?.subject ? `${activeExtractingBank.subject} · Exam Extraction` : undefined}
            noticeText="Questions will appear here once extraction is complete."
          />
        );
      })()}

      {extractionFailedQB && (
        <div className="bg-[#19243B]/40 flex fixed z-50 top-0 right-0 bottom-0 left-0 pt-8 pr-8 pb-8 pl-8 justify-center items-center backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
          <div className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl bg-white border border-[#E2E0D9] w-[520px] max-w-full overflow-hidden text-[#19243B] my-auto">
            
            <div className="border-b border-[#E2E0D9] pt-5 pr-6 pb-5 pl-6">
              <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
                Couldn't create questions
              </h2>
            </div>

            <div className="flex pt-6 pr-6 pb-6 pl-6 flex-col gap-4">
              
              <div className="rounded-lg bg-white border border-[#E2E0D9] flex pt-3 pr-4 pb-3 pl-4 items-center gap-4 shadow-xs">
                <div className="rounded-lg bg-[#F1F0EC] text-[#0057FF] flex justify-center items-center shrink-0 size-10">
                  <FileText className="size-5" />
                </div>
                <div className="flex flex-col flex-1 gap-0.5 min-w-0">
                  <span className="font-medium text-ellipsis whitespace-nowrap text-sm overflow-hidden text-[#19243B]">
                    {extractionFailedQB.name || 'operating-systems-midterm-2023.pdf'}
                  </span>
                  <span className="text-[#526078] text-xs">
                    {extractionFailedQB.subject ? `${extractionFailedQB.subject} · PDF` : '4.8 MB'}
                  </span>
                </div>
              </div>

              <div className="rounded-lg bg-[#FFF0EE] text-[#B42318] border border-[#B42318]/20 flex pt-4 pr-4 pb-4 pl-4 gap-3">
                <CircleAlert className="mt-0.5 shrink-0 size-5 text-[#B42318]" />
                <p className="text-sm leading-6">
                  {extractionErrorMessage ||
                    "We couldn't read the question text from this paper. Try uploading a clearer PDF or remove password protection."}
                </p>
              </div>

              <p className="text-[#526078] text-sm">
                No questions were created.
              </p>
            </div>

            <div className="bg-[#FDFCFA] border-t border-[#E2E0D9] flex pt-4 pr-6 pb-4 pl-6 justify-end gap-3">
              <button
                type="button"
                onClick={clearExtractionFailedQB}
                className="font-medium rounded-lg bg-white text-[#19243B] text-sm border border-[#E2E0D9] pt-2.5 pr-4 pb-2.5 pl-4 hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetId = extractionFailedQB.id;
                  clearExtractionFailedQB();
                  if (targetId) {
                    await extractQuestions(targetId);
                  }
                }}
                className="font-medium rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm pt-2.5 pr-4 pb-2.5 pl-4 shadow-sm transition-all cursor-pointer"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
          <div className="relative w-[760px] max-w-full rounded-2xl border border-[#E2E0D9] bg-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] my-auto text-[#19243B] overflow-hidden max-h-[92vh] flex flex-col">
            
            <div className="border-b border-[#E2E0D9] flex py-6 px-8 justify-between items-center shrink-0">
              <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
                Upload past papers
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                aria-label="Close"
                className="rounded-lg text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B] p-2 transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex-1 flex flex-col min-h-0">
              <div className="p-8 flex flex-col gap-6 overflow-y-auto flex-1">
                
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-[#19243B]">
                    Collection name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operating Systems — Previous Papers"
                    className="rounded-lg bg-white text-sm border border-[#E2E0D9] outline-none px-3 h-11 text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-medium text-sm text-[#19243B]">
                    Subject *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Operating Systems"
                      list="screen19-subject-suggestions"
                      className="w-full rounded-lg bg-white text-sm border border-[#E2E0D9] outline-none px-3 h-11 text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] transition-colors"
                    />
                    <datalist id="screen19-subject-suggestions">
                      {allSubjectOptions.map((sub) => (
                        <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-[#19243B]">
                      Linked study materials
                    </span>
                    <span className="text-xs text-[#526078]">
                      {selectedResourceIds.length} selected for AI grounding
                    </span>
                  </div>

                  {resources.length === 0 ? (
                    <p className="text-xs text-[#526078] bg-[#F8F7F4] p-3 rounded-lg border border-[#E2E0D9]">
                      No study materials available yet. You can still upload exam papers directly.
                    </p>
                  ) : (
                    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 max-h-48 overflow-y-auto p-0.5">
                      {resources.map((r) => {
                        const isSelected = selectedResourceIds.includes(r.id);
                        return (
                          <label
                            key={r.id}
                            className={`rounded-lg text-sm border flex py-3 px-4 items-center gap-3 cursor-pointer select-none transition-all ${
                              isSelected
                                ? 'bg-[#0057FF]/10 text-[#0057FF] font-medium border-[#0057FF]/30'
                                : 'text-[#19243B] border-[#E2E0D9] hover:bg-[#F8F7F4]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleResourceId(r.id)}
                              className="accent-[#0057FF] size-4 rounded cursor-pointer shrink-0"
                            />
                            <span className="truncate">{r.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />

                <div className="flex flex-col gap-2">
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-xl border-2 border-dashed flex p-6 flex-col justify-center items-center gap-3 min-h-36 cursor-pointer transition-colors ${
                      isDragging
                        ? 'bg-[#EAF0FF] border-[#0057FF]'
                        : 'bg-[#F8F7F4]/60 border-[#C6CAD3] hover:bg-[#F0F4FF]'
                    }`}
                  >
                    <Upload className="text-[#0057FF] size-7" />
                    <p className="font-medium text-sm text-[#19243B]">
                      Drop your PDF papers here
                    </p>
                    <p className="text-[#526078] text-xs">
                      Supporting 1–10 PDFs
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="font-medium shadow-xs rounded-lg bg-white text-sm border border-[#E2E0D9] py-2 px-4 hover:bg-[#F1F0EC] transition-colors cursor-pointer text-[#19243B]"
                    >
                      Choose files
                    </button>
                  </div>
                  <p className="text-[#687184] text-xs">Up to 10 PDFs</p>
                </div>

                {files.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {files.map((fileItem, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-[#E2E0D9] bg-white flex py-3 px-4 justify-between items-center shadow-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="rounded-lg bg-[#0057FF]/10 text-[#0057FF] flex justify-center items-center size-9 shrink-0">
                            <FileText className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-[#19243B] truncate">
                              {fileItem.name}
                            </p>
                            <p className="text-[#526078] text-xs mt-0.5">
                              {(fileItem.size / (1024 * 1024)).toFixed(1)} MB · PDF ·{' '}
                              <span className="text-emerald-600 font-semibold">Valid</span>
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label="Remove file"
                          className="rounded-md text-[#526078] hover:text-[#B42318] hover:bg-[#FFF0EE] p-2 transition-colors cursor-pointer shrink-0"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-[#E2E0D9] flex py-5 px-8 justify-end items-center gap-3 shrink-0 bg-[#FDFCFA]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="font-medium rounded-lg bg-white text-sm border border-[#E2E0D9] py-2.5 px-4 text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingQuestionBank || files.length === 0}
                  className="font-medium rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm py-2.5 px-5 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isUploadingQuestionBank && <Loader2 className="size-4 animate-spin" />}
                  <span>{isUploadingQuestionBank ? 'Uploading papers...' : 'Upload papers'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBankManager;
