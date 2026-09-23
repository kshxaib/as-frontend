import React, { useEffect, useState } from 'react';
import {
  LibraryBig,
  BookOpen,
  FileText,
  BadgeCheck,
  Sparkles,
  Download,
  Search,
  SearchX,
  RefreshCw,
  FolderPlus,
  Eye,
  CheckCircle2,
  Calendar,
  User,
  X,
  LoaderCircle,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { CommunityAnswerViewer } from './CommunityAnswerViewer';
import { CommunityPredictedPaperViewer } from './CommunityPredictedPaperViewer';
import { CommunityQuestionBankViewer } from './CommunityQuestionBankViewer';

export const CommunityHub = () => {
  const {
    communityResources,
    communityAnswerSets,
    communityPredictedPapers,
    communityQuestionBanks,
    isLoadingCommunity,
    fetchCommunityData,
    downloadSolvedPdf,
    downloadResourceFile,
    downloadPredictedPaperPdf,
    downloadQuestionBankFile,
    openCommunityViewer,
    openCommunityPredictedViewer,
    openCommunityQBViewer,
    cloneQuestionBankToWorkspace,
    cloneCommunityAnswerSetToWorkspace,
    cloneCommunityPredictedPaperToWorkspace,
    copiedQbIds,
    copiedAnswerSetIds,
    copiedPredictedPaperIds,
  } = useQuestionBankStore();

  const [activeSubTab, setActiveSubTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [downloadingResourceId, setDownloadingResourceId] = useState(null);
  const [cloningQbId, setCloningQbId] = useState(null);
  const [cloningSetId, setCloningSetId] = useState(null);
  const [cloningPaperId, setCloningPaperId] = useState(null);
  const [copyNotification, setCopyNotification] = useState('');

  useEffect(() => {
    fetchCommunityData();
  }, [fetchCommunityData]);

  const filteredResources = (communityResources || []).filter((r) => {
    const matchesSearch =
      (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.subject && r.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.uploader_name && r.uploader_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.chapters && r.chapters.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || r.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredPastPapers = (communityQuestionBanks || []).filter((qb) => {
    const matchesSearch =
      (qb.name && qb.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (qb.subject && qb.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (qb.author_name && qb.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || qb.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredSolvedPapers = (communityAnswerSets || []).filter((s) => {
    const matchesSearch =
      (s.question_bank_name && s.question_bank_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.subject && s.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.author_name && s.author_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || s.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredPracticePapers = (communityPredictedPapers || []).filter((p) => {
    const matchesSearch =
      (p.title && p.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subject && p.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.creator_name && p.creator_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'ALL' || p.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const allSubjects = Array.from(
    new Set([
      ...(communityResources || []).map((r) => r.subject),
      ...(communityAnswerSets || []).map((s) => s.subject),
      ...(communityPredictedPapers || []).map((p) => p.subject),
      ...(communityQuestionBanks || []).map((qb) => qb.subject),
    ].filter(Boolean))
  );

  const handleDownloadResource = async (resItem) => {
    try {
      setDownloadingResourceId(resItem.id);
      await downloadResourceFile(resItem.id, `${(resItem.name || 'Resource').replace(/\s+/g, '_')}.pdf`);
    } finally {
      setDownloadingResourceId(null);
    }
  };

  const handleCloneQb = async (qb) => {
    if (copiedQbIds?.has(qb.id) || cloningQbId === qb.id) return;
    try {
      setCloningQbId(qb.id);
      const res = await cloneQuestionBankToWorkspace(qb.id);
      if (res?.success) {
        setCopyNotification(`"${qb.name}" has been copied to your workspace.`);
      }
    } finally {
      setCloningQbId(null);
    }
  };

  const handleCloneSet = async (set) => {
    if (copiedAnswerSetIds?.has(set.id) || cloningSetId === set.id) return;
    try {
      setCloningSetId(set.id);
      const res = await cloneCommunityAnswerSetToWorkspace(set.id);
      if (res?.success) {
        setCopyNotification(`"${set.question_bank_name}" solved paper has been copied to your workspace.`);
      }
    } finally {
      setCloningSetId(null);
    }
  };

  const handleClonePaper = async (paper) => {
    if (copiedPredictedPaperIds?.has(paper.id) || cloningPaperId === paper.id) return;
    try {
      setCloningPaperId(paper.id);
      const res = await cloneCommunityPredictedPaperToWorkspace(paper.id);
      if (res?.success) {
        setCopyNotification(`"${paper.title || 'Practice Paper'}" has been copied to your Question Papers.`);
      }
    } finally {
      setCloningPaperId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSubject('ALL');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#19243B] pb-24 animate-in fade-in duration-150">
      <div className="shadow-[0px_1px_3px_rgba(0,0,0,0.06)] rounded-2xl bg-white border border-[#E2E0D9] p-6 sm:p-8 space-y-6">
        
        {copyNotification && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
              <span>{copyNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setCopyNotification('')}
              className="text-emerald-700 hover:text-emerald-900 font-medium text-xs cursor-pointer underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#E2E0D9]">
          <button
            type="button"
            onClick={() => setActiveSubTab('resources')}
            className={`font-semibold rounded-t-xl text-xs sm:text-sm px-4 py-3 shrink-0 whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'resources'
                ? 'border-[#0057FF] text-[#0057FF] bg-[#EAF0FF]/40'
                : 'border-transparent text-[#526078] hover:text-[#19243B] hover:bg-[#F8F7F4]'
            }`}
          >
            <FileText className="size-4" />
            <span>Study materials</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'resources' ? 'bg-[#0057FF] text-white' : 'bg-[#E2E0D9] text-[#526078]'
            }`}>
              {(communityResources || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('past_papers')}
            className={`font-semibold rounded-t-xl text-xs sm:text-sm px-4 py-3 shrink-0 whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'past_papers'
                ? 'border-[#0057FF] text-[#0057FF] bg-[#EAF0FF]/40'
                : 'border-transparent text-[#526078] hover:text-[#19243B] hover:bg-[#F8F7F4]'
            }`}
          >
            <BookOpen className="size-4" />
            <span>Past papers</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'past_papers' ? 'bg-[#0057FF] text-white' : 'bg-[#E2E0D9] text-[#526078]'
            }`}>
              {(communityQuestionBanks || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('solved_papers')}
            className={`font-semibold rounded-t-xl text-xs sm:text-sm px-4 py-3 shrink-0 whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'solved_papers'
                ? 'border-[#0057FF] text-[#0057FF] bg-[#EAF0FF]/40'
                : 'border-transparent text-[#526078] hover:text-[#19243B] hover:bg-[#F8F7F4]'
            }`}
          >
            <BadgeCheck className="size-4" />
            <span>Solved papers</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'solved_papers' ? 'bg-[#0057FF] text-white' : 'bg-[#E2E0D9] text-[#526078]'
            }`}>
              {(communityAnswerSets || []).length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('practice_papers')}
            className={`font-semibold rounded-t-xl text-xs sm:text-sm px-4 py-3 shrink-0 whitespace-nowrap transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'practice_papers'
                ? 'border-[#0057FF] text-[#0057FF] bg-[#EAF0FF]/40'
                : 'border-transparent text-[#526078] hover:text-[#19243B] hover:bg-[#F8F7F4]'
            }`}
          >
            <Sparkles className="size-4" />
            <span>Practice papers</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
              activeSubTab === 'practice_papers' ? 'bg-[#0057FF] text-white' : 'bg-[#E2E0D9] text-[#526078]'
            }`}>
              {(communityPredictedPapers || []).length}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="rounded-xl bg-[#F8F7F4] border border-[#C6CAD3] flex px-3.5 items-center flex-1 gap-3 h-11 focus-within:border-[#0057FF] focus-within:bg-white transition-all w-full">
            <Search className="text-[#687184] size-4 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, keyword, or contributor..."
              className="bg-transparent text-sm text-[#19243B] outline-none flex-1 h-full placeholder-[#8A97AA]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#687184] hover:text-[#19243B] cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl bg-[#F8F7F4] text-sm font-medium text-[#19243B] border border-[#C6CAD3] px-3.5 w-full sm:w-56 h-11 outline-none focus:border-[#0057FF] focus:bg-white transition-all cursor-pointer"
          >
            <option value="ALL">All subjects ({allSubjects.length})</option>
            {allSubjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={fetchCommunityData}
            disabled={isLoadingCommunity}
            className="inline-flex items-center justify-center gap-2 px-3.5 h-11 rounded-xl border border-[#C6CAD3] bg-white text-xs font-semibold text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
            title="Refresh library"
          >
            <RefreshCw className={`size-3.5 text-[#0057FF] ${isLoadingCommunity ? 'animate-spin' : ''}`} />
            <span>{isLoadingCommunity ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>

        {isLoadingCommunity ? (
          <div className="py-24 text-center rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs">
            <RefreshCw className="mx-auto size-7 animate-spin text-[#0057FF] mb-3" />
            <p className="text-sm font-semibold text-[#19243B]">Loading library content...</p>
          </div>
        ) : activeSubTab === 'resources' ? (
          filteredResources.length > 0 ? (
            <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
                <div className="col-span-6">Document & Subject</div>
                <div className="col-span-4">Shared by</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              <div className="divide-y divide-[#EAE8E1]">
                {filteredResources.map((res) => {
                  const isDownloading = downloadingResourceId === res.id;
                  const sharerName = res.uploader_name || 'Academic Scholar';
                  return (
                    <div
                      key={res.id}
                      className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                    >
                      <div className="md:col-span-6 min-w-0">
                        <h3 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                          {res.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block bg-[#EAF0FF] text-[#0057FF] text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[180px] border border-[#C8D8FF]">
                            {res.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-4 flex items-center gap-2.5 min-w-0">
                        <div className="size-6 rounded-full bg-[#0057FF] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                          {sharerName[0]}
                        </div>
                        <span className="text-xs font-semibold text-[#19243B] truncate">
                          {sharerName}
                        </span>
                      </div>

                      <div className="md:col-span-2 flex justify-start md:justify-end items-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadResource(res)}
                          disabled={isDownloading}
                          className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs px-3.5 h-9 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
                        >
                          {isDownloading ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : (
                            <Download className="size-3.5" />
                          )}
                          <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col justify-center items-center py-16">
              <div className="size-14 rounded-2xl bg-[#F8F7F4] border border-[#E2E0D9] flex items-center justify-center text-[#687184] mb-3">
                <SearchX className="size-7" />
              </div>
              <h3 className="font-bold text-lg text-[#19243B]">
                No study materials found
              </h3>
              <p className="text-xs text-[#687184] mt-1 max-w-sm">
                Try searching with different keywords or clear current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs mt-4 px-4 h-9 transition-colors cursor-pointer shadow-xs"
              >
                Clear filters
              </button>
            </div>
          )
        ) : activeSubTab === 'past_papers' ? (
          filteredPastPapers.length > 0 ? (
            <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
                <div className="col-span-4">Paper & Subject</div>
                <div className="col-span-3">Shared by</div>
                <div className="col-span-2">Questions & Marks</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#EAE8E1]">
                {filteredPastPapers.map((qb) => {
                  const isCloning = cloningQbId === qb.id;
                  const isAlreadyCopied = copiedQbIds.has(qb.id);
                  const sharerName = qb.author_name || 'AcademicStack';
                  return (
                    <div
                      key={qb.id}
                      className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                    >
                      <div className="md:col-span-4 min-w-0">
                        <h3 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                          {qb.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block bg-[#EAF0FF] text-[#0057FF] text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[180px] border border-[#C8D8FF]">
                            {qb.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2.5 min-w-0">
                        <div className="size-6 rounded-full bg-[#0057FF] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                          {sharerName[0]}
                        </div>
                        <span className="text-xs font-semibold text-[#19243B] truncate">
                          {sharerName}
                        </span>
                      </div>

                      <div className="md:col-span-2 flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#19243B] bg-[#F1F0EC] px-2 py-0.5 rounded">
                          {qb.total_questions || 0} Qs
                        </span>
                        <span className="text-[#687184]">•</span>
                        <span className="font-medium text-[#526078]">{qb.total_marks || 80} Marks</span>
                      </div>

                      <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openCommunityQBViewer(qb.id)}
                          className="font-semibold rounded-xl text-xs text-[#19243B] border border-[#C6CAD3] hover:bg-[#F8F7F4] px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                        >
                          <Eye className="size-3.5 text-[#687184]" />
                          <span>Preview</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCloneQb(qb)}
                          disabled={isCloning || isAlreadyCopied}
                          className={`font-semibold rounded-xl text-xs px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs ${
                            isAlreadyCopied
                              ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                              : 'bg-[#0057FF] text-white hover:bg-[#0047D6] disabled:opacity-50'
                          }`}
                          title={isAlreadyCopied ? 'Already copied to your workspace' : 'Add to workspace'}
                        >
                          {isCloning ? (
                            <LoaderCircle className="size-3.5 animate-spin" />
                          ) : isAlreadyCopied ? (
                            <CheckCircle2 className="size-3.5 text-[#187347]" />
                          ) : (
                            <FolderPlus className="size-3.5" />
                          )}
                          <span>{isCloning ? 'Adding...' : isAlreadyCopied ? 'Copied' : 'Add copy'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col justify-center items-center py-16">
              <div className="size-14 rounded-2xl bg-[#F8F7F4] border border-[#E2E0D9] flex items-center justify-center text-[#687184] mb-3">
                <SearchX className="size-7" />
              </div>
              <h3 className="font-bold text-lg text-[#19243B]">
                No past papers found
              </h3>
              <p className="text-xs text-[#687184] mt-1 max-w-sm">
                Try searching with different keywords or clear current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs mt-4 px-4 h-9 transition-colors cursor-pointer shadow-xs"
              >
                Clear filters
              </button>
            </div>
          )
        ) : activeSubTab === 'solved_papers' ? (
          filteredSolvedPapers.length > 0 ? (
            <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
                <div className="col-span-4">Manuscript & Subject</div>
                <div className="col-span-3">Solved & Shared by</div>
                <div className="col-span-2">Completion</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#EAE8E1]">
                {filteredSolvedPapers.map((set) => {
                  const isCloning = cloningSetId === set.id;
                  const isAlreadyCopied = copiedAnswerSetIds?.has(set.id);
                  const sharerName = set.author_name || 'AcademicStack Scholar';
                  return (
                    <div
                      key={set.id}
                      className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                    >
                      <div className="md:col-span-4 min-w-0">
                        <h3 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                          {set.question_bank_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block bg-[#EAF0FF] text-[#0057FF] text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[180px] border border-[#C8D8FF]">
                            {set.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2.5 min-w-0">
                        <div className="size-6 rounded-full bg-[#187347] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                          {sharerName[0]}
                        </div>
                        <span className="text-xs font-semibold text-[#19243B] truncate">
                          {sharerName}
                        </span>
                      </div>

                      <div className="md:col-span-2 flex items-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF5EF] text-[#187347] text-[11px] px-2.5 py-0.5 font-bold border border-[#A6F4C5]">
                          <CheckCircle2 className="size-3" />
                          <span>{set.completed_questions || 0}/{set.total_questions || 0} Solved</span>
                        </span>
                      </div>

                      <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openCommunityViewer(set.id)}
                          className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="size-3.5" />
                          <span>Answers</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCloneSet(set)}
                          disabled={isCloning || isAlreadyCopied}
                          className={`font-semibold rounded-xl text-xs px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                            isAlreadyCopied
                              ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                              : 'border border-[#C6CAD3] text-[#19243B] hover:bg-[#F8F7F4] disabled:opacity-50'
                          }`}
                          title={isAlreadyCopied ? 'Already copied to your workspace' : 'Add to workspace'}
                        >
                          {isCloning ? (
                            <LoaderCircle className="size-3.5 animate-spin text-[#0057FF]" />
                          ) : isAlreadyCopied ? (
                            <CheckCircle2 className="size-3.5 text-[#187347]" />
                          ) : (
                            <FolderPlus className="size-3.5 text-[#687184]" />
                          )}
                          <span>{isCloning ? 'Adding...' : isAlreadyCopied ? 'Copied' : 'Add copy'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col justify-center items-center py-16">
              <div className="size-14 rounded-2xl bg-[#F8F7F4] border border-[#E2E0D9] flex items-center justify-center text-[#687184] mb-3">
                <SearchX className="size-7" />
              </div>
              <h3 className="font-bold text-lg text-[#19243B]">
                No solved papers found
              </h3>
              <p className="text-xs text-[#687184] mt-1 max-w-sm">
                Try searching with different keywords or clear current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs mt-4 px-4 h-9 transition-colors cursor-pointer shadow-xs"
              >
                Clear filters
              </button>
            </div>
          )
        ) : activeSubTab === 'practice_papers' ? (
          filteredPracticePapers.length > 0 ? (
            <div className="rounded-2xl bg-white border border-[#E2E0D9] shadow-2xs overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#FAF9F5] border-b border-[#E2E0D9] text-[11px] font-bold text-[#526078] uppercase tracking-wider select-none">
                <div className="col-span-4">Model Paper & Subject</div>
                <div className="col-span-3">Synthesized by</div>
                <div className="col-span-2">Maximum Marks</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              <div className="divide-y divide-[#EAE8E1]">
                {filteredPracticePapers.map((paper) => {
                  const isCloning = cloningPaperId === paper.id;
                  const isAlreadyCopied = copiedPredictedPaperIds?.has(paper.id);
                  const sharerName = paper.creator_name || 'AcademicStack';
                  return (
                    <div
                      key={paper.id}
                      className="p-4 sm:px-6 sm:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 md:items-center hover:bg-[#FAF9F5]/70 transition-colors group"
                    >
                      <div className="md:col-span-4 min-w-0">
                        <h3 className="font-semibold text-sm text-[#19243B] truncate group-hover:text-[#0057FF] transition-colors">
                          {paper.title || 'Practice Examination Paper'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block bg-[#EAF0FF] text-[#0057FF] text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[180px] border border-[#C8D8FF]">
                            {paper.subject || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-3 flex items-center gap-2.5 min-w-0">
                        <div className="size-6 rounded-full bg-[#B54708] text-white flex items-center justify-center text-[10px] font-bold uppercase shrink-0">
                          {sharerName[0]}
                        </div>
                        <span className="text-xs font-semibold text-[#19243B] truncate">
                          {sharerName}
                        </span>
                      </div>

                      <div className="md:col-span-2 flex items-center text-xs font-semibold text-[#19243B]">
                        <span className="bg-[#F1F0EC] px-2 py-0.5 rounded">
                          {paper.maximum_marks ? `${paper.maximum_marks} Marks` : '80 Marks'}
                        </span>
                      </div>

                      <div className="md:col-span-3 flex justify-start md:justify-end items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openCommunityPredictedViewer(paper.id)}
                          className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="size-3.5" />
                          <span>View</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleClonePaper(paper)}
                          disabled={isCloning || isAlreadyCopied}
                          className={`font-semibold rounded-xl text-xs px-3.5 h-9 inline-flex justify-center items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                            isAlreadyCopied
                              ? 'border border-[#A6F4C5] bg-[#EAF5EF] text-[#187347] cursor-default'
                              : 'border border-[#C6CAD3] text-[#19243B] hover:bg-[#F8F7F4] disabled:opacity-50'
                          }`}
                          title={isAlreadyCopied ? 'Already copied to your workspace' : 'Add to workspace'}
                        >
                          {isCloning ? (
                            <LoaderCircle className="size-3.5 animate-spin text-[#0057FF]" />
                          ) : isAlreadyCopied ? (
                            <CheckCircle2 className="size-3.5 text-[#187347]" />
                          ) : (
                            <FolderPlus className="size-3.5 text-[#687184]" />
                          )}
                          <span>{isCloning ? 'Adding...' : isAlreadyCopied ? 'Copied' : 'Add copy'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center flex flex-col justify-center items-center py-16">
              <div className="size-14 rounded-2xl bg-[#F8F7F4] border border-[#E2E0D9] flex items-center justify-center text-[#687184] mb-3">
                <SearchX className="size-7" />
              </div>
              <h3 className="font-bold text-lg text-[#19243B]">
                No practice papers found
              </h3>
              <p className="text-xs text-[#687184] mt-1 max-w-sm">
                Try searching with different keywords or clear current filters.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs mt-4 px-4 h-9 transition-colors cursor-pointer shadow-xs"
              >
                Clear filters
              </button>
            </div>
          )
        ) : null}

      </div>

      <CommunityAnswerViewer />
      <CommunityPredictedPaperViewer />
      <CommunityQuestionBankViewer />
    </div>
  );
};

export default CommunityHub;
