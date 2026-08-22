import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Upload,
  Plus,
  Layers,
  Database,
  ExternalLink,
  Trash2,
  Share2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';

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
    clearFeedback,
  } = useQuestionBankStore();

  const { user, isAuthenticated, openAuthModal } = useAuthStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
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
              <BookOpen className="h-4 w-4" />
              Study Materials & Knowledge Base
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Study Resources & Vector Store
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Upload course notes & textbooks. Index them into Qdrant to power syllabus-grounded RAG answers.
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
              <span>Upload PDF Resource</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, or chapter..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {subjects.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Resources Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-slate-400">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-indigo-500 mb-2" />
              <p className="text-xs">Loading study materials...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((res) => {
                const isIndexing = isIndexingResource[res.id];
                return (
                  <div
                    key={res.id}
                    className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 border border-indigo-500/20">
                          {res.subject}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {res.visibility === 'community' ? (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                              Community
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                              Private
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="mt-3 text-lg font-bold text-white tracking-tight line-clamp-1">
                        {res.name}
                      </h3>

                      {res.chapters && (
                        <p className="mt-1 text-xs text-indigo-300 font-medium">
                          Chapters: {res.chapters}
                        </p>
                      )}

                      {res.description && (
                        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {res.description}
                        </p>
                      )}

                      {/* Status pill */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500">Status:</span>
                        {res.status === 'indexed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <Database className="h-3 w-3" />
                            Qdrant Vector Indexed
                          </span>
                        ) : res.status === 'indexing' || isIndexing ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300 animate-pulse border border-indigo-500/20">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Vectorizing Chunks...
                          </span>
                        ) : res.status === 'indexing_failed' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/20">
                            <AlertCircle className="h-3 w-3" />
                            Indexing Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                            Uploaded (Unindexed)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                      {res.status === 'indexed' ? (
                        <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Ready for RAG
                        </span>
                      ) : (
                        <button
                          onClick={() => indexResource(res.id)}
                          disabled={isIndexing}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600/90 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          {isIndexing ? 'Indexing...' : 'Index with AI'}
                        </button>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleResourceShare(res.id)}
                          title={res.visibility === 'community' ? 'Make Private' : 'Share with Community'}
                          className={`rounded-lg p-1.5 transition-colors ${
                            res.visibility === 'community'
                              ? 'text-emerald-400 hover:bg-emerald-500/10'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <a
                          href={res.cloudinary_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Open Original PDF"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        <button
                          onClick={() => {
                            if (window.confirm(`Delete resource "${res.name}"?`)) {
                              deleteResource(res.id);
                            }
                          }}
                          title="Delete"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
              <FileText className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-300">No Study Resources Found</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Upload your textbooks, lecture notes, or syllabus PDFs to create searchable vector knowledge.
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Upload First Resource
              </button>
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white tracking-tight">Upload Study Resource</h3>
              <p className="mt-1 text-xs text-slate-400">PDFs will be stored securely on Cloudinary and prepared for Qdrant indexing.</p>

              <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Operating Systems Modern Concepts"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Operating Systems"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Chapters / Modules</label>
                    <input
                      type="text"
                      value={chapters}
                      onChange={(e) => setChapters(e.target.value)}
                      placeholder="e.g. Ch 1-4, Memory Mgmt"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of this document..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="private">Private (Only visible to you)</option>
                    <option value="community">Community (Share with all students)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">PDF File *</label>
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
                    disabled={isUploadingResource}
                    className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isUploadingResource ? 'Uploading to Cloudinary...' : 'Upload & Save'}
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
