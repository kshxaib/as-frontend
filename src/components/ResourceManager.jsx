import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Plus,
  Database,
  Download,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  FileText,
  Workflow,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ConfirmationModal } from './ConfirmationModal';
import { AiProgressModal } from './AiProgressModal';
import { StatusBadge } from './ui/StatusBadge';
import { EmptyState } from './ui/EmptyState';

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
  } = useQuestionBankStore();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  // Form state
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [fetchResources, user]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('user_id', user?.id || 1);
    formData.append('name', name);
    formData.append('subject', subject);
    if (chapters) formData.append('chapters', chapters);
    if (description) formData.append('description', description);
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

  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.chapters && r.chapters.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || r.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = Array.from(new Set(resources.map((r) => r.subject).filter(Boolean)));

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
              <BookOpen className="h-3.5 w-3.5 stroke-[1.5]" />
              Digital Reading Room
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-normal text-[var(--text-primary)] tracking-tight">
              Study Resources & Vector Store
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)]">
              Course notes and textbooks indexed into Qdrant to power syllabus-grounded RAG solution sets.
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
              <span>Upload PDF Document</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by title, subject, or chapter..."
              className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-9 pr-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[var(--text-muted)] uppercase">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Documents Collection */}
        <div className="mt-6">
          {isLoading ? (
            <div className="py-24 text-center text-[var(--text-muted)]">
              <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[var(--primary)] mb-2 stroke-[1.5]" />
              <p className="font-mono text-xs">Retrieving digital catalogue...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => {
                const isIndexing = isIndexingResource[res.id];
                return (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-strong)] transition-all"
                  >
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-[11px] font-medium text-[var(--text-muted)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)] truncate">
                          {res.subject}
                        </span>
                        {res.visibility === 'community' ? (
                          <StatusBadge variant="gold">Public</StatusBadge>
                        ) : (
                          <StatusBadge variant="neutral">Private</StatusBadge>
                        )}
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

                      {/* Status indicator */}
                      <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                        {res.status === 'indexed' ? (
                          <StatusBadge variant="success" icon={Database}>Indexed</StatusBadge>
                        ) : res.status === 'indexing' || isIndexing ? (
                          <StatusBadge variant="amber" pulse icon={RefreshCw}>Vectorizing...</StatusBadge>
                        ) : res.status === 'indexing_failed' ? (
                          <StatusBadge variant="error" icon={AlertCircle}>Indexing Failed</StatusBadge>
                        ) : (
                          <StatusBadge variant="neutral">Unindexed</StatusBadge>
                        )}

                        {/* Direct Index Action for unindexed resources */}
                        {res.status !== 'indexed' && (
                          <button
                            onClick={() => indexResource(res.id)}
                            disabled={isIndexing || Object.values(isIndexingResource).some(Boolean) || isUploadingResource}
                            className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ai)] hover:bg-[rgba(245,158,11,0.15)] transition-all disabled:opacity-40"
                          >
                            <Workflow className="h-3 w-3 stroke-[1.5]" />
                            <span>{isIndexing ? 'Indexing...' : 'Index with AI'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        PDF Document
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleResourceShare(res.id)}
                          disabled={isIndexing || isUploadingResource}
                          title={res.visibility === 'community' ? 'Make Private' : 'Share with The Commons'}
                          className={`rounded-[6px] p-1.5 transition-colors disabled:opacity-40 ${
                            res.visibility === 'community'
                              ? 'text-[var(--community)] hover:bg-[rgba(200,168,32,0.1)]'
                              : 'text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <Share2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>

                        <button
                          onClick={() => downloadResourceFile(res.id, `${res.name.replace(/\s+/g, '_')}.pdf`)}
                          title="Download Original PDF"
                          className="rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>

                        <button
                          onClick={() => setDeleteCandidate(res)}
                          title="Delete"
                          className="rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="No Study Resources Found"
              description="Upload course textbooks, lecture notes, or syllabus PDFs to populate the vector library for grounded examination answers."
              actionText="Upload First Resource"
              onAction={() => setIsUploadModalOpen(true)}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={!!deleteCandidate}
          title="Delete Study Resource?"
          message={`Are you sure you want to delete "${deleteCandidate?.name}"? Its vector embeddings stored in Qdrant will also be deleted.`}
          confirmText="Yes, Delete Resource"
          cancelText="Cancel"
          confirmVariant="danger"
          iconType="trash"
          onConfirm={() => {
            if (deleteCandidate) {
              deleteResource(deleteCandidate.id);
              setDeleteCandidate(null);
            }
          }}
          onCancel={() => setDeleteCandidate(null)}
        />

        {/* Live Vector Indexing Progress Modal */}
        <AiProgressModal
          isOpen={Object.values(isIndexingResource).some(Boolean)}
          type="indexing"
          title="Vector Indexing in Progress"
          subtitle="AcademicStack is extracting text chunks and computing 3072-dim embeddings for Qdrant vector search."
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
                  Upload Study Resource
                </h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  PDF documents are securely stored and prepared for Qdrant vector indexing.
                </p>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operating Systems Modern Concepts"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Operating Systems"
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Chapters / Modules
                    </label>
                    <input
                      type="text"
                      value={chapters}
                      onChange={(e) => setChapters(e.target.value)}
                      placeholder="e.g. Ch 1-4, Memory Mgmt"
                      className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Description / Syllabus Notes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of included units..."
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-3 text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                  >
                    <option value="private">Private (Only accessible in your workspace)</option>
                    <option value="community">The Commons (Share with community)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    PDF Document File *
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
                    disabled={isUploadingResource}
                    className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isUploadingResource && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{isUploadingResource ? 'Uploading Document...' : 'Upload & Catalogue'}</span>
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
