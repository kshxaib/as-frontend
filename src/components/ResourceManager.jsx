import React, { useEffect, useState, useRef } from 'react';
import {
  BookOpen,
  Upload,
  Search,
  FileText,
  Trash2,
  Share2,
  Download,
  AlertCircle,
  CircleAlert,
  CheckCircle2,
  Users,
  Lock,
  Workflow,
  RefreshCw,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  FileWarning,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { ApiKeyBanner } from './ui/ApiKeyBanner';

export const ResourceManager = () => {
  const {
    resources,
    isLoading,
    isUploadingResource,
    isIndexingResource,
    error,
    successMessage,
    fetchResources,
    uploadResource,
    indexResource,
    deleteResource,
    toggleResourceShare,
    downloadResourceFile,
    clearFeedback,
    triggerKeyModal,
  } = useQuestionBankStore();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [preparationFailedResource, setPreparationFailedResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [downloadingId, setDownloadingId] = useState(null);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResources();
  }, [fetchResources, user]);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    
    if (!name.trim()) {
      const cleanName = selectedFile.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setName(cleanName);
    }
  };

  const handleDownload = async (resourceId, filename) => {
    try {
      setDownloadingId(resourceId);
      await downloadResourceFile(resourceId, filename);
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
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handleFileChange(droppedFile);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('user_id', user?.id || 1);
    formData.append('name', name.trim() || file.name);
    formData.append('subject', subject.trim() || 'General Studies');
    if (chapters) formData.append('chapters', chapters.trim());
    if (description) formData.append('description', description.trim());
    formData.append('visibility', visibility);
    formData.append('file', file);

    const res = await uploadResource(formData);
    if (res.success) {
      setIsUploadModalOpen(false);
      setName('');
      setSubject('');
      setChapters('');
      setDescription('');
      setFile(null);
    }
  };

  const handleIndexResource = async (res) => {
    if (!user?.has_openai_key) {
      triggerKeyModal('AI Study Material Preparation');
      return;
    }
    const result = await indexResource(res.id);
    if (result && result.success === false) {
      setPreparationFailedResource(res);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)} KB`;
  };

  const existingSubjects = Array.from(
    new Set(resources.map((r) => r.subject).filter(Boolean))
  );

  const defaultSubjects = [
    'Database Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Data Structures',
  ];
  const allSubjectOptions = Array.from(
    new Set([...defaultSubjects, ...existingSubjects])
  );

  const filteredResources = resources
    .filter((r) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        r.name?.toLowerCase().includes(query) ||
        r.subject?.toLowerCase().includes(query) ||
        r.chapters?.toLowerCase().includes(query) ||
        r.description?.toLowerCase().includes(query);
      const matchesSubject =
        selectedSubject === 'all' ||
        r.subject?.toLowerCase() === selectedSubject.toLowerCase();
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-[#F7D0CA] bg-[#FFF0EE] p-4 text-xs text-[#B42318] shadow-2xs">
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
        <div className="flex items-center justify-between rounded-xl border border-[#C8D8FF] bg-[#EAF0FF] p-4 text-xs text-[#0057FF] shadow-2xs">
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

      <ApiKeyBanner feature="AI Question Extraction & Solutions" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
            Study materials
          </h1>
          <p className="text-[#526078] text-sm sm:text-base mt-1">
            Keep your notes, textbooks, and syllabus organized in one place.
          </p>
        </div>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              openAuthModal('login');
            } else {
              setIsUploadModalOpen(true);
            }
          }}
          className="w-full sm:w-auto rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-11 text-sm font-semibold flex items-center justify-center gap-2 shrink-0 shadow-xs transition-all cursor-pointer"
        >
          <Upload className="size-4" />
          <span>Upload material</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="text-[#687184] absolute top-3.5 left-3.5 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject, or chapter..."
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
                <option value="all">All Subjects ({resources.length})</option>
                {existingSubjects.map((sub) => {
                  const count = resources.filter((r) => r.subject?.toLowerCase() === sub.toLowerCase()).length;
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
            <p className="text-sm font-semibold text-[#19243B]">Loading study materials...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
              <div className="col-span-5">Document & Subject</div>
              <div className="col-span-2">Chapters</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Added</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="divide-y divide-[#EAE8E1]">
              {filteredResources.map((res) => {
                const isIndexing = isIndexingResource[res.id];
                const isIndexed = res.status === 'indexed';
                const isFailed = res.status === 'indexing_failed' || res.status === 'failed';

                return (
                  <div
                    key={res.id}
                    className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                  >
                    <div className="md:col-span-5 min-w-0">
                      <h2 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                        {res.name}
                      </h2>
                      <p className="font-medium text-xs text-[#526078] truncate mt-0.5">
                        {res.subject || 'General'}
                      </p>
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      {res.chapters ? (
                        <span className="inline-block bg-[#F1F0EC] text-[#19243B] text-xs font-medium px-2 py-0.5 rounded-md truncate max-w-[160px]">
                          {res.chapters}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9AA2B1]">—</span>
                      )}
                    </div>

                    <div className="md:col-span-2 flex items-center">
                      {isIndexed ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#187347]">
                          <Check className="size-3.5 stroke-[2.5]" />
                          <span>Ready</span>
                        </span>
                      ) : isIndexing ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF4FF] text-[#0057FF] text-xs font-medium">
                          <Loader2 className="size-3 animate-spin text-[#0057FF]" />
                          <span>Preparing...</span>
                        </span>
                      ) : isFailed ? (
                        <button
                          type="button"
                          onClick={() => setPreparationFailedResource(res)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FFF0EE] text-[#B42318] border border-[#FEDCD7] text-xs font-medium hover:bg-[#FFE5E2] transition-colors cursor-pointer"
                        >
                          <CircleAlert className="size-3 text-[#B42318]" />
                          <span>Failed · Retry</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleIndexResource(res)}
                          disabled={
                            isIndexing ||
                            Object.values(isIndexingResource).some(Boolean) ||
                            isUploadingResource
                          }
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#D5D8DF] bg-white hover:bg-[#F8F7F4] hover:border-[#19243B] text-[#19243B] text-xs font-medium transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="size-3 text-[#0057FF]" />
                          <span>Prepare</span>
                        </button>
                      )}
                    </div>

                    <div className="md:col-span-1 text-xs text-[#526078] flex items-center">
                      {formatDate(res.created_at)}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-t-0 border-[#EAE8E1]">
                      <button
                        type="button"
                        onClick={() =>
                          handleDownload(
                            res.id,
                            `${(res.name || 'study_material').replace(/\s+/g, '_')}.pdf`
                          )
                        }
                        disabled={downloadingId === res.id}
                        className="p-2 rounded-lg text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer disabled:opacity-80 disabled:cursor-wait"
                        title={downloadingId === res.id ? "Downloading PDF..." : "Download PDF"}
                      >
                        {downloadingId === res.id ? (
                          <Loader2 className="size-4 animate-spin text-[#0057FF]" />
                        ) : (
                          <Download className="size-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleResourceShare(res.id)}
                        disabled={isIndexing || isUploadingResource}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          res.visibility === 'community'
                            ? 'text-[#0057FF] bg-[#0057FF]/10 hover:bg-[#0057FF]/20'
                            : 'text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC]'
                        }`}
                        title={
                          res.visibility === 'community'
                            ? 'Shared with community (Click to make private)'
                            : 'Share to Community'
                        }
                      >
                        <Share2 className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(res)}
                        className="p-2 rounded-lg text-[#526078] hover:text-[#B42318] hover:bg-[#FFF0EE] transition-colors cursor-pointer"
                        title="Delete material"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center rounded-2xl bg-white border border-[#E2E0D9] p-12 sm:p-16 flex flex-col justify-center items-center shadow-xs">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-5 place-items-center size-16 shadow-xs">
              <BookOpen className="size-8" />
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
              Your Study Library is Empty
            </h2>
            <p className="text-[#526078] text-sm sm:text-base mt-2.5 max-w-md leading-relaxed">
              Upload lecture notes, chapter PDFs, or reference textbooks to get started.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm font-semibold px-6 h-11 mt-6 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-md"
            >
              <Upload className="size-4" />
              <span>Upload Your First Material</span>
            </button>
          </div>
        ) : (
          <div className="text-center rounded-2xl bg-white border border-dashed border-[#C6CAD3] p-12 sm:p-16 flex flex-col justify-center items-center">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-4 place-items-center size-14">
              <Search className="size-7" />
            </div>
            <h2 className="font-bold text-xl sm:text-2xl tracking-tight text-[#19243B]">
              No materials match your search
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

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[520px] rounded-2xl border border-[#E2E0D9] bg-white text-[#19243B] shadow-[0px_16px_45px_rgba(25,36,59,0.12)] my-auto overflow-hidden">
            <div className="border-b border-[#E2E0D9] p-6">
              <h3 className="font-bold text-xl tracking-tight text-[#19243B]">
                Delete Study Material?
              </h3>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="rounded-xl bg-[#F8F7F4] border border-[#E2E0D9] flex p-3.5 items-center gap-3">
                <span className="rounded-lg bg-[#EAF0FF] text-[#0057FF] border border-[#C8D8FF] flex justify-center items-center shrink-0 size-10 shadow-xs">
                  <FileText className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-[#19243B] truncate">
                    {deleteCandidate.name || 'Study Material'}
                  </p>
                  <p className="text-xs text-[#526078]">
                    {deleteCandidate.subject || 'General'}
                  </p>
                </div>
              </div>
              <p className="text-[#526078] text-sm leading-relaxed">
                This will permanently delete this document from your study library.
              </p>
            </div>

            <div className="bg-[#FAF9F5] border-t border-[#E2E0D9] p-4 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-xl border border-[#E2E0D9] bg-white px-4 h-10 text-sm font-semibold text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteCandidate) {
                    await deleteResource(deleteCandidate.id);
                    setDeleteCandidate(null);
                  }
                }}
                className="rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white px-5 h-10 text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Delete Material
              </button>
            </div>
          </div>
        </div>
      )}

      {(() => {
        const activeIndexingResource = (resources || []).find((r) => isIndexingResource[r.id]);
        return (
          <AiProgressModal
            isOpen={Object.values(isIndexingResource).some(Boolean)}
            type="indexing"
            title="Preparing study material"
            itemName={activeIndexingResource?.name || 'Study Material Document'}
            noticeText="Please wait while your document is being processed."
          />
        );
      })()}

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center overflow-y-auto overflow-x-hidden bg-[#19243B]/40 p-0 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-t-2xl sm:rounded-2xl border border-[#E2E0D9] bg-white shadow-[0px_16px_45px_rgba(25,36,59,0.12)] my-0 sm:my-auto text-[#19243B] overflow-hidden max-h-[96vh] sm:max-h-[90vh] flex flex-col">
            <div className="border-b border-[#E2E0D9] p-4 sm:p-5 flex items-start justify-between shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#19243B]">
                  Upload Study Material
                </h3>
                <p className="text-[#526078] text-xs mt-0.5">
                  Upload textbook chapters, syllabi, or lecture notes in PDF format.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg p-1.5 text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B] transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex flex-col flex-1 min-h-0 overflow-x-hidden">
              <div className="p-4 sm:p-5 flex flex-col gap-3 overflow-y-auto overflow-x-hidden flex-1 scrollbar-none [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />

                {!file ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`text-center rounded-xl border-2 border-dashed p-4 sm:p-5 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                      isDragging
                        ? 'bg-[#EAF0FF] border-[#0057FF]'
                        : 'bg-[#FAF9F5] border-[#D0CECB] hover:bg-[#F0F4FF] hover:border-[#0057FF]'
                    }`}
                  >
                    <div className="rounded-lg bg-[#0057FF]/10 text-[#0057FF] grid place-items-center size-10 shadow-xs">
                      <FileText className="size-5" />
                    </div>
                    <div>
                      <p className="text-[#19243B] text-xs sm:text-sm font-semibold">
                        Drag and drop your PDF here, or <span className="text-[#0057FF] underline">browse</span>
                      </p>
                      <p className="text-[#687184] text-[11px] mt-0.5">
                        PDF format • Maximum 10MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl bg-[#EAF0FF] border border-[#C8D8FF] flex p-3 items-center gap-2.5">
                      <div className="rounded-lg bg-white text-[#0057FF] border border-[#C8D8FF] grid place-items-center size-9 shrink-0 shadow-xs">
                        <FileText className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs sm:text-sm truncate text-[#19243B]">
                          {file.name}
                        </p>
                        <p className="text-[#526078] text-[11px]">
                          {formatFileSize(file.size)} · PDF
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg text-xs px-2.5 h-7 bg-white border border-[#E2E0D9] text-[#19243B] font-semibold hover:bg-[#F1F0EC] transition-colors shadow-2xs shrink-0 cursor-pointer"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="p-1 text-[#526078] hover:bg-white/80 rounded-md transition-colors cursor-pointer"
                        aria-label="Remove file"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {file.size > 10 * 1024 * 1024 && (
                      <div className="rounded-xl bg-[#FFF0EE] text-[#B42318] text-xs border border-[#F2C7C2] p-2.5 flex items-start gap-2">
                        <FileWarning className="size-4 shrink-0 mt-0.5 text-[#B42318]" />
                        <div>
                          <p className="font-semibold">File too large</p>
                          <p className="text-[11px] text-[#526078] mt-0.5">
                            PDF files must be 10 MB or smaller.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex flex-col gap-1">
                  <label htmlFor="doc-title" className="font-semibold text-xs text-[#19243B]">
                    Document Title *
                  </label>
                  <input
                    id="doc-title"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Database Management Systems Notes"
                    className="w-full rounded-xl border border-[#E2E0D9] bg-white px-3.5 h-10 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
                  />
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="doc-subject" className="font-semibold text-xs text-[#19243B]">
                      Subject *
                    </label>
                    <div className="relative">
                      <input
                        id="doc-subject"
                        type="text"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Database Systems"
                        list="subject-suggestions"
                        className="w-full rounded-xl border border-[#E2E0D9] bg-white px-3.5 h-10 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
                      />
                      <datalist id="subject-suggestions">
                        {allSubjectOptions.map((sub) => (
                          <option key={sub} value={sub} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="doc-chapters" className="font-semibold text-xs text-[#19243B]">
                      Covered Chapters
                    </label>
                    <input
                      id="doc-chapters"
                      type="text"
                      value={chapters}
                      onChange={(e) => setChapters(e.target.value)}
                      placeholder="e.g. Chapters 1–3"
                      className="w-full rounded-xl border border-[#E2E0D9] bg-white px-3.5 h-10 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="doc-desc" className="font-semibold text-xs text-[#19243B]">
                    Description
                  </label>
                  <textarea
                    id="doc-desc"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description or syllabus outline..."
                    className="w-full rounded-xl border border-[#E2E0D9] bg-white p-2.5 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors resize-none min-h-[60px] shadow-2xs"
                  />
                </div>

                <fieldset className="flex flex-col gap-1.5">
                  <legend className="font-semibold text-xs text-[#19243B]">
                    Visibility & Sharing
                  </legend>
                  <div className="grid gap-2.5 grid-cols-2">
                    <label
                      onClick={() => setVisibility('private')}
                      className={`rounded-xl text-sm flex p-2.5 items-center gap-2 cursor-pointer transition-colors border select-none ${
                        visibility === 'private'
                          ? 'bg-[#EAF0FF] text-[#0057FF] font-semibold border-[#0057FF]'
                          : 'text-[#526078] bg-white border-[#E2E0D9] hover:bg-[#F8F7F4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={visibility === 'private'}
                        onChange={() => setVisibility('private')}
                        className="sr-only"
                      />
                      <Lock className="size-4 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Private</p>
                        <p className="text-[10px] text-[#526078]">Only you</p>
                      </div>
                    </label>

                    <label
                      onClick={() => setVisibility('community')}
                      className={`rounded-xl text-sm flex p-2.5 items-center gap-2 cursor-pointer transition-colors border select-none ${
                        visibility === 'community'
                          ? 'bg-[#EAF0FF] text-[#0057FF] font-semibold border-[#0057FF]'
                          : 'text-[#526078] bg-white border-[#E2E0D9] hover:bg-[#F8F7F4]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="community"
                        checked={visibility === 'community'}
                        onChange={() => setVisibility('community')}
                        className="sr-only"
                      />
                      <Users className="size-4 shrink-0" />
                      <div>
                        <p className="font-semibold text-xs">Community</p>
                        <p className="text-[10px] text-[#526078]">Public Commons</p>
                      </div>
                    </label>
                  </div>
                </fieldset>
              </div>

              <div className="bg-[#FAF9F5] border-t border-[#E2E0D9] p-3.5 sm:p-4 flex justify-end items-center gap-2 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 sm:flex-initial rounded-xl border border-[#E2E0D9] bg-white px-4 h-10 text-sm font-semibold text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingResource || !file || file.size > 10 * 1024 * 1024}
                  className="flex-1 sm:flex-initial rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-10 text-sm font-semibold shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isUploadingResource && <Loader2 className="size-4 animate-spin" />}
                  <span>{isUploadingResource ? 'Uploading...' : 'Upload & Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preparationFailedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-[520px] rounded-2xl border border-[#E2E0D9] bg-white shadow-xl my-auto text-[#19243B] overflow-hidden">
            <div className="border-b border-[#E2E0D9] p-6">
              <h3 className="text-xl font-bold tracking-tight text-[#19243B]">
                Couldn't Process Material
              </h3>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <div className="rounded-xl bg-[#F8F7F4] border border-[#E2E0D9] flex p-3.5 items-center gap-3">
                <div className="rounded-lg bg-[#0057FF]/10 text-[#0057FF] grid place-items-center shrink-0 size-10">
                  <FileText className="size-5" />
                </div>
                <span className="font-semibold text-sm text-[#19243B] truncate">
                  {preparationFailedResource.name || 'Study Material'}
                </span>
              </div>

              <div
                className="rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex p-3 items-start gap-2.5"
                role="alert"
              >
                <CircleAlert className="mt-0.5 shrink-0 size-4 text-red-600" />
                <span>Processing did not complete. Please try again.</span>
              </div>
            </div>

            <div className="bg-[#FAF9F5] border-t border-[#E2E0D9] p-4 flex justify-end items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreparationFailedResource(null)}
                className="rounded-xl border border-[#E2E0D9] bg-white px-4 h-10 text-sm font-semibold text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  const target = preparationFailedResource;
                  setPreparationFailedResource(null);
                  await handleIndexResource(target);
                }}
                className="rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white px-5 h-10 text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;
