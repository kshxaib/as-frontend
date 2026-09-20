import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  Bookmark,
  Check,
  AlertCircle,
  CircleAlert,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  FileUp,
  Upload,
  Link,
  Share2,
  Info,
  LoaderCircle,
  MoreHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { ApiKeyBanner } from './ui/ApiKeyBanner';

const MAX_PAPERS = 10;

const formatSectionHeader = (secName, secInst, marksSummary) => {
  const rawName = (secName || '').trim();
  const rawInst = (secInst || marksSummary || '').trim();

  const match = rawName.match(/^(Q\s*\.?\s*\d+|Question\s*\d+|Section\s*[A-Z0-9]+)(?:[:\.\-—\s]+(.*))?$/i);
  let cleanedName = rawName;
  let nameExtra = '';
  if (match) {
    cleanedName = match[1].trim();
    nameExtra = (match[2] || '').trim();
  }

  let cleanedInst = rawInst.replace(/\[\d+\s*marks?\]/gi, '').trim();

  if (!cleanedInst && nameExtra) {
    cleanedInst = nameExtra.replace(/\[\d+\s*marks?\]/gi, '').trim();
  } else if (cleanedInst && nameExtra) {
    const lowerExtra = nameExtra.toLowerCase();
    const lowerInst = cleanedInst.toLowerCase();
    if (
      lowerExtra.includes(lowerInst) ||
      lowerInst.includes(lowerExtra) ||
      (lowerExtra.includes('any') && lowerInst.includes('any')) ||
      (lowerExtra.includes('answer') && lowerInst.includes('answer')) ||
      (lowerExtra.includes('solve') && lowerInst.includes('solve')) ||
      (lowerExtra.includes('short note') && lowerInst.includes('short note'))
    ) {
      cleanedInst = cleanedInst.length >= nameExtra.length ? cleanedInst : nameExtra;
    }
  }

  cleanedInst = cleanedInst.replace(/^[:\-—\s]+|[:\-—\s]+$/g, '').trim();

  return {
    sectionName: cleanedName,
    sectionInstruction: cleanedInst,
  };
};

export const PredictedPaperGenerator = ({ sharedToken, onClearShared }) => {
  const {
    questionBanks,
    fetchQuestionBanks,
    predictPaper,
    savePredictedPaperAsQb,
    downloadPredictedPaperPdf,
    sharePredictedPaper,
    togglePredictedPaperShare,
    fetchSharedPredictedPaper,
    predictedPaper,
    setPredictedPaper,
    isPredictingPaper,
    isSavingPredictedQb,
    setActiveTab,
    selectQuestionBank,
    triggerKeyModal,
  } = useQuestionBankStore();

  const { user, openAuthModal } = useAuthStore();

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [paperRows, setPaperRows] = useState([
    { id: 1, type: 'upload', file: null, qbId: null, qbName: '', session: '' },
    { id: 2, type: 'upload', file: null, qbId: null, qbName: '', session: '' },
  ]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [savedQbInfo, setSavedQbInfo] = useState(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const [sharedInfo, setSharedInfo] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [communityPaperId, setCommunityPaperId] = useState(null);
  const [isCommunityShared, setIsCommunityShared] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [synthesisError, setSynthesisError] = useState('');
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const actionsMenuRef = useRef(null);

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  useEffect(() => {
    if (sharedToken) {
      fetchSharedPredictedPaper(sharedToken).then((res) => {
        if (res.success && res.data) {
          setSharedInfo(res.data);
          setPredictedPaper(res.data.paper_data);
          setCommunityPaperId(res.data.id);
          setIsCommunityShared(res.data.visibility === 'community');
          if (res.data.subject) setSubject(res.data.subject);
          if (res.data.title) setTitle(res.data.title);
        }
      });
    }
  }, [sharedToken, fetchSharedPredictedPaper, setPredictedPaper]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(e.target)) {
        setIsActionsMenuOpen(false);
      }
    };
    if (isActionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsMenuOpen]);

  const handleAddRow = () => {
    if (paperRows.length >= MAX_PAPERS) return;
    setPaperRows((prev) => [
      ...prev,
      { id: Date.now(), type: 'upload', file: null, qbId: null, qbName: '', session: '' },
    ]);
  };

  const handleRemoveRow = (id) => {
    if (paperRows.length <= 1) return;
    setPaperRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleFileChange = (id, file) => {
    setPaperRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, file, type: 'upload' } : r))
    );
  };

  const handleSessionChange = (id, session) => {
    setPaperRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, session } : r))
    );
  };

  const handleSourceTypeToggle = (id, type) => {
    setPaperRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, type, file: type === 'upload' ? r.file : null, qbId: type === 'existing_qb' ? r.qbId : null } : r))
    );
  };

  const handleSelectExistingQb = (id, qbId) => {
    const qb = questionBanks.find((q) => q.id === Number(qbId));
    setPaperRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, qbId: qb ? qb.id : null, qbName: qb ? qb.name : '', type: 'existing_qb' } : r
      )
    );
    if (qb?.subject && !subject.trim()) {
      setSubject(qb.subject);
    }
  };

  const isRowValid = (row) => {
    return (row.type === 'upload' && row.file !== null) || (row.type === 'existing_qb' && row.qbId !== null);
  };

  const validSourcesCount = paperRows.filter(isRowValid).length;
  const isFormValid = subject.trim().length > 0 && validSourcesCount >= 1;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setAttemptedSubmit(true);
    setValidationError('');

    if (!subject.trim()) {
      setValidationError('Please enter a subject name (e.g. Operating Systems, Computer Networks).');
      return;
    }

    const validUploadRows = paperRows.filter((r) => r.type === 'upload' && r.file !== null);
    const validQbRows = paperRows.filter((r) => r.type === 'existing_qb' && r.qbId !== null);

    if (validUploadRows.length === 0 && validQbRows.length === 0) {
      setValidationError('Please select or upload at least one past paper source.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('title', title.trim() || `Practice ${subject.trim()} Examination Paper`);
    formData.append('user_id', user?.id || 1);

    const metaList = validUploadRows.map((r) => ({
      session: r.session.trim() || 'Exam Paper',
      filename: r.file.name,
    }));
    formData.append('papers_meta', JSON.stringify(metaList));

    validUploadRows.forEach((r) => {
      formData.append('files', r.file);
    });

    if (validQbRows.length > 0) {
      formData.append('existing_qb_ids', validQbRows.map((q) => q.qbId).join(','));
      const qbMetaList = validQbRows.map((q) => ({ id: q.qbId, session: q.session.trim() || q.qbName }));
      formData.append('existing_qbs_meta', JSON.stringify(qbMetaList));
    }

    setSynthesisError('');

    if (!user) {
      setSynthesisError('Please log in to your account before synthesizing question papers.');
      openAuthModal?.('login');
      return;
    }

    if (!user?.has_openai_key) {
      triggerKeyModal('AI Examination Paper Prediction');
      setSynthesisError('OpenAI API Key is missing. Please add your OpenAI API key in Profile settings.');
      return;
    }

    const res = await predictPaper(formData);
    if (res.success) {
      setSavedQbInfo(null);
      setSynthesisError('');
      setCommunityPaperId(null);
      setIsCommunityShared(false);
      setShareMessage('');
    } else {
      setSynthesisError(res.error || 'Failed to synthesize predicted question paper.');
    }
  };

  const handleToggleCommunityShare = async () => {
    if (!predictedPaper) return;
    if (!user) {
      openAuthModal?.('login');
      return;
    }

    setIsSharing(true);
    setShareMessage('');

    if (!communityPaperId) {
      const creator = user.name || 'Student Scholar';
      const res = await sharePredictedPaper(predictedPaper, creator, 'community');
      setIsSharing(false);
      if (res.success && res.data) {
        setCommunityPaperId(res.data.id);
        setIsCommunityShared(true);
        setShareMessage('Practice paper published to The Commons! Peers can now view it in Community.');
        setTimeout(() => setShareMessage(''), 8000);
      }
    } else {
      const res = await togglePredictedPaperShare(communityPaperId);
      setIsSharing(false);
      if (res.success) {
        const isNowShared = res.visibility === 'community';
        setIsCommunityShared(isNowShared);
        setShareMessage(
          isNowShared
            ? 'Practice paper shared with The Commons!'
            : 'Practice paper visibility set to Private.'
        );
        setTimeout(() => setShareMessage(''), 8000);
      }
    }
  };

  const handleSaveAsQb = async () => {
    if (!predictedPaper) return;
    if (!user) {
      openAuthModal?.('login');
      return;
    }
    const res = await savePredictedPaperAsQb(predictedPaper);
    if (res.success) {
      setSavedQbInfo(res.data);
    }
  };

  const handleCopyLink = () => {
    if (!predictedPaper) return;
    const shareUrl = `${window.location.origin}/?predict=${communityPaperId || 'sample'}`;
    navigator.clipboard.writeText(shareUrl);
    setCopyLinkSuccess(true);
    setTimeout(() => setCopyLinkSuccess(false), 2500);
  };

  const handleDownloadPdf = async () => {
    if (!predictedPaper || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const meta = predictedPaper.exam_meta || {};
      const safeTitle = (meta.paper_title || 'Practice_Paper').replace(/\s+/g, '_');
      await downloadPredictedPaperPdf(predictedPaper, `${safeTitle}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#19243B] pb-24 lg:pb-8 animate-in fade-in duration-150">
      
      {sharedToken && !user && (
        <div className="mb-6 rounded-2xl bg-[#EAF0FF] border border-[#C8D8FF] p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <Link className="text-[#0057FF] mt-1 size-5 shrink-0" />
            <div>
              <h3 className="font-semibold text-[#19243B] text-base">
                Shared practice paper
              </h3>
              <p className="text-[#526078] text-sm leading-relaxed mt-1">
                Sign in to continue to this shared practice paper and access the full question breakdown, pattern insights, and PDF export.
              </p>
              <button
                type="button"
                onClick={() => openAuthModal?.('login')}
                className="font-medium rounded-[10px] bg-[#0057FF] text-white hover:bg-[#0047D6] text-sm px-5 py-2.5 inline-flex items-center gap-2 mt-4 transition-colors cursor-pointer shadow-xs"
              >
                Sign in to continue
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-6">
        <p className="font-semibold uppercase text-[#687184] text-xs tracking-[0.16em]">
          AcademicStack Paper Predictor
        </p>
        <h1 className="font-semibold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
          Build a practice paper
        </h1>
        <p className="text-[#526078] text-sm sm:text-base leading-6 max-w-2xl">
          Use past papers to explore recurring topics and create another paper to practise.
        </p>
      </div>

      {validationError && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2.5">
            <CircleAlert className="size-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
          <button onClick={() => setValidationError('')} className="font-medium hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <ApiKeyBanner feature="Examination Paper Prediction & Synthesis" />

      {!predictedPaper ? (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">

          <div className="rounded-2xl bg-white border border-[#E2E0D9] p-5 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="text-[#0057FF] size-4.5" />
              <h3 className="font-semibold text-base sm:text-lg text-[#19243B]">Course details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject-input" className="font-medium text-xs text-[#526078]">
                  Subject
                </label>
                <input
                  id="subject-input"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Operating Systems"
                  className="rounded-[10px] bg-white border border-[#C6CAD3] px-3 text-sm text-[#19243B] outline-none focus:border-[#0057FF] h-11"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="target-exam-input" className="font-medium text-xs text-[#526078]">
                  Target exam
                </label>
                <input
                  id="target-exam-input"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Semester Examination"
                  className="rounded-[10px] bg-white border border-[#C6CAD3] px-3 text-sm text-[#19243B] outline-none focus:border-[#0057FF] h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-semibold text-lg text-[#19243B]">
                  Past paper sources
                </h3>
                <p className="text-[#687184] text-xs sm:text-sm mt-1">
                  Add papers so recurring topics can be reviewed transparently.
                </p>
              </div>
              <span className="text-[#687184] text-xs font-medium">
                {paperRows.length} {paperRows.length === 1 ? 'paper' : 'papers'}
              </span>
            </div>

            <div className="space-y-3">
              {paperRows.map((row, index) => {
                const complete = isRowValid(row);
                const hasError = attemptedSubmit && !complete;
                const qNum = String(index + 1).padStart(2, '0');

                return (
                  <div
                    key={row.id}
                    className={`rounded-2xl bg-white border p-4 sm:p-5 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] space-y-3.5 transition-all ${
                      hasError ? 'border-[#B42318] bg-red-50/20' : 'border-[#E2E0D9]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold rounded-full bg-[#EAF0FF] text-[#0057FF] text-xs flex justify-center items-center size-8">
                          {qNum}
                        </span>
                        <div>
                          <p className="font-semibold text-[#19243B] text-sm">
                            {row.session || (row.file ? row.file.name : row.qbName ? row.qbName : `Paper ${qNum}`)}
                          </p>
                          <p className="text-[#687184] text-xs">
                            Source type
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasError && (
                          <AlertCircle className="text-[#B42318] size-4 shrink-0" />
                        )}
                        {paperRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            className="text-[#687184] hover:text-[#B42318] text-xs font-medium transition-colors px-2 py-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3 pt-1">
                      
                      <div className="rounded-[10px] bg-[#F1F0EC] grid grid-cols-2 p-1 h-11 items-center">
                        <button
                          type="button"
                          onClick={() => handleSourceTypeToggle(row.id, 'upload')}
                          className={`rounded-[8px] text-xs font-medium h-9 transition-all cursor-pointer ${
                            row.type === 'upload'
                              ? 'bg-white text-[#0057FF] font-semibold shadow-xs'
                              : 'text-[#526078] hover:text-[#19243B]'
                          }`}
                        >
                          Upload PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSourceTypeToggle(row.id, 'existing_qb')}
                          className={`rounded-[8px] text-xs font-medium h-9 transition-all cursor-pointer ${
                            row.type === 'existing_qb'
                              ? 'bg-white text-[#0057FF] font-semibold shadow-xs'
                              : 'text-[#526078] hover:text-[#19243B]'
                          }`}
                        >
                          Existing bank
                        </button>
                      </div>

                      {row.type === 'upload' ? (
                        <div className="relative flex items-center">
                          <label
                            className={`flex-1 rounded-[10px] text-sm flex pr-3 pl-9 items-center justify-between h-11 cursor-pointer transition-colors border ${
                              row.file
                                ? 'bg-[#F1F0EC] text-[#526078] border-[#E2E0D9]'
                                : hasError
                                ? 'bg-white text-[#687184] border-[#B42318]'
                                : 'bg-white text-[#526078] border-[#C6CAD3]'
                            }`}
                          >
                            <FileUp className="-translate-y-1/2 pointer-events-none text-[#687184] absolute top-1/2 left-3 size-4" />
                            <span className="truncate">
                              {row.file ? row.file.name : 'Select a PDF paper'}
                            </span>
                            <FileText className="size-4 text-[#526078] shrink-0" />
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileChange(row.id, e.target.files[0]);
                                }
                              }}
                            />
                          </label>
                        </div>
                      ) : (
                        <div className="relative flex items-center">
                          <select
                            value={row.qbId || ''}
                            onChange={(e) => handleSelectExistingQb(row.id, e.target.value)}
                            className={`w-full rounded-[10px] text-sm border px-3 pr-8 appearance-none outline-none h-11 font-normal cursor-pointer ${
                              row.qbId
                                ? 'bg-[#F1F0EC] text-[#19243B] border-[#E2E0D9]'
                                : hasError
                                ? 'bg-white text-[#687184] border-[#B42318]'
                                : 'bg-white text-[#526078] border-[#C6CAD3]'
                            }`}
                          >
                            <option value="">Select an existing question bank...</option>
                            {questionBanks.map((qb) => (
                              <option key={qb.id} value={qb.id}>
                                {qb.name} ({qb.subject})
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="-translate-y-1/2 pointer-events-none text-[#687184] absolute top-1/2 right-3 size-4" />
                        </div>
                      )}
                    </div>

                    {hasError && (
                      <p className="font-medium text-[#B42318] text-xs flex items-center gap-1.5 pt-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>Choose a PDF or existing question bank.</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              disabled={paperRows.length >= MAX_PAPERS}
              className="font-medium rounded-[10px] bg-white text-[#19243B] text-sm border border-[#C6CAD3] hover:bg-[#F8F7F4] w-full min-h-11 flex justify-center items-center gap-2 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Plus className="size-4" />
              <span>Add another paper</span>
            </button>
          </div>

          {synthesisError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <p className="font-semibold flex items-center gap-2">
                <AlertCircle className="size-4" />
                <span>{synthesisError}</span>
              </p>
            </div>
          )}

          <div className="hidden lg:flex border-t border-[#E2E0D9] pt-6 justify-between items-center gap-4">
            <p className="text-[#687184] text-xs leading-5 max-w-lg">
              Based on patterns in the papers you provide — not a guarantee of future exam questions.
            </p>

            <button
              type="submit"
              disabled={!isFormValid || isPredictingPaper}
              className="font-medium rounded-[10px] bg-[#0057FF] text-white hover:bg-[#0047D6] text-sm px-6 h-11 flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Sparkles className="size-4" />
              <span>{isPredictingPaper ? 'Building practice paper...' : 'Generate practice paper'}</span>
            </button>
          </div>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#F8F7F4] border-t border-[#E2E0D9] p-4 shadow-[0px_-4px_10px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-2.5 max-w-[390px] mx-auto">
              <p className="text-center text-[#687184] text-xs leading-4">
                Based on patterns in the papers you provide — not a guarantee.
              </p>
              <button
                type="submit"
                disabled={!isFormValid || isPredictingPaper}
                className="font-medium rounded-[10px] bg-[#0057FF] text-white hover:bg-[#0047D6] text-sm w-full min-h-11 flex justify-center items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <span>{isPredictingPaper ? 'Building...' : 'Generate practice paper'}</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

        </form>
      ) : (
        
        <div className="space-y-6 max-w-5xl">
          
          <div className="flex flex-wrap justify-center items-center gap-2.5">

            <div className="hidden sm:flex flex-wrap justify-center items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="font-medium rounded-[10px] border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] px-3.5 h-11 text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
                ) : (
                  <Download className="size-4 text-[#0057FF]" />
                )}
                <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAsQb}
                disabled={isSavingPredictedQb || !!savedQbInfo}
                className="font-medium rounded-[10px] border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] px-3.5 h-11 text-sm inline-flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
                title="Save this practice paper as a personal Question Bank"
              >
                <Bookmark className="size-4 text-[#187347]" />
                <span>{savedQbInfo ? 'Saved' : isSavingPredictedQb ? 'Saving...' : 'Save to past papers'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleCommunityShare}
                disabled={isSharing}
                className="font-medium rounded-[10px] border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] px-3.5 h-11 text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Share2 className="size-4 text-[#C8A820]" />
                <span>{isCommunityShared ? 'Shared' : 'Share'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="font-medium rounded-[10px] border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F1F0EC] px-3.5 h-11 text-sm inline-flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <Link className="size-4 text-[#0057FF]" />
                <span>{copyLinkSuccess ? 'Copied!' : 'Copy link'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPredictedPaper(null)}
                className="font-medium rounded-[10px] border border-[#C6CAD3] bg-white text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] px-3.5 h-11 text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Create a new prediction"
              >
                <RefreshCw className="size-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {shareMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between">
              <span>{shareMessage}</span>
              <button onClick={() => setShareMessage('')} className="underline font-medium cursor-pointer">Dismiss</button>
            </div>
          )}

          {savedQbInfo && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>Saved as Question Bank <b>"{savedQbInfo.name}"</b>.</span>
              </div>
              <button
                onClick={async () => {
                  await selectQuestionBank(savedQbInfo.question_bank_id);
                  setActiveTab('review');
                }}
                className="font-semibold underline flex items-center gap-1 cursor-pointer"
              >
                <span>Go to Question Review</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          )}

          <div className="bg-[#F1F0EC] p-3 sm:p-6 rounded-2xl">
            <article className="shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] bg-white mx-auto p-6 sm:p-10 max-w-2xl text-[#19243B] space-y-6">
              
              <div className="border-b-2 border-[#19243B] pb-6 text-center space-y-4">
                <span className="text-xs font-bold tracking-[0.22em] text-[#0057FF] uppercase block">
                  ACADEMICSTACK
                </span>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#19243B] uppercase">
                    {title || 'Practice Examination Paper'}
                  </h3>
                  <p className="text-xs font-semibold text-[#687184] mt-1">
                    Subject: <span className="text-[#19243B] font-bold">{predictedPaper.exam_meta?.subject || subject}</span>
                  </p>
                </div>

                <div className="w-full flex justify-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FEDF89] bg-[#FFFAEB] px-3 py-1 text-[11px] sm:text-xs font-medium text-[#B54708]">
                    <ShieldCheck className="size-3.5 shrink-0" />
                    <span>FOR PRACTICE ONLY • NOT AN OFFICIAL PAPER</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-b border-[#E2E0D9] py-2.5 text-xs text-[#687184] px-1 sm:px-4">
                  <span>Time Allowed: <b className="text-[#19243B]">{predictedPaper.exam_meta?.time_allowed || '03 Hours'}</b></span>
                  <span>Session: <b className="text-[#19243B]">{predictedPaper.exam_meta?.session || `Model Exam ${new Date().getFullYear()}`}</b></span>
                  <span>Maximum Marks: <b className="text-[#19243B]">{predictedPaper.exam_meta?.maximum_marks || 80}</b></span>
                </div>

                {((predictedPaper.exam_meta?.general_instructions && predictedPaper.exam_meta.general_instructions.length > 0) || true) && (
                  <div className="pt-2 text-xs text-[#526078] text-left">
                    <p className="font-bold text-[#19243B] mb-2">
                      General Instructions to Candidates:
                    </p>
                    <ol className="list-none space-y-1.5 pl-0">
                      {(predictedPaper.exam_meta?.general_instructions && predictedPaper.exam_meta.general_instructions.length > 0
                        ? predictedPaper.exam_meta.general_instructions
                        : [
                            'Question No. 1 is compulsory.',
                            'Attempt any three questions out of remaining five questions.',
                            'Assume suitable data wherever necessary.',
                          ]
                      ).map((inst, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-semibold text-[#19243B] shrink-0">({i + 1})</span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {(predictedPaper.sections || []).map((section, sIdx) => {
                  const { sectionName, sectionInstruction } = formatSectionHeader(
                    section.section_name || `Q.${sIdx + 1}`,
                    section.section_instruction,
                    section.marks_summary
                  );
                  const rawInst = (section.section_instruction || section.marks_summary || '').trim();
                  const totalMarksDisplay = section.total_marks
                    ? `[${section.total_marks} Marks]`
                    : (rawInst.match(/\[\d+\s*marks?\]/i) ? rawInst.match(/\[\d+\s*marks?\]/i)[0] : '');

                  return (
                    <div key={sIdx} className={sIdx > 0 ? 'border-t-2 border-[#19243B] pt-5 mt-5' : 'mt-5'}>
                      <div className="flex justify-between items-baseline gap-3 pb-2 border-b border-[#E2E0D9]">
                        <div className="flex items-baseline gap-2.5 flex-wrap">
                          <span className="font-bold text-[#19243B] text-base">
                            {sectionName}
                          </span>
                          {sectionInstruction && (
                            <span className="text-xs sm:text-sm font-medium text-[#526078] italic">
                              {sectionInstruction}
                            </span>
                          )}
                        </div>

                        {totalMarksDisplay && (
                          <span className="text-xs font-bold text-[#19243B] shrink-0 bg-[#F1F0EC] px-2.5 py-0.5 rounded-md">
                            {totalMarksDisplay}
                          </span>
                        )}
                      </div>

                      <div className="divide-y divide-[#E2E0D9]">
                        {(section.questions || []).map((q, qIdx) => {
                          const qLabel = q.question_number || `${String.fromCharCode(97 + qIdx)}.`;
                          return (
                            <div key={qIdx} className="py-3.5 space-y-2">
                              <div className="flex justify-between items-start gap-4">
                                <p className="font-normal text-[#19243B] text-sm flex-1 leading-relaxed">
                                  <span className="font-bold text-[#19243B] mr-2">{qLabel}</span>
                                  {q.question_text}
                                </p>
                                {q.marks && (
                                  <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                                    [{q.marks}]
                                  </span>
                                )}
                              </div>

                              {q.is_or_choice && (
                                <div className="pt-1">
                                  <div className="font-bold text-[#687184] text-xs tracking-widest flex items-center gap-3 my-2">
                                    <div className="bg-[#E2E0D9] flex-1 h-px" />
                                    OR
                                    <div className="bg-[#E2E0D9] flex-1 h-px" />
                                  </div>
                                  <div className="flex justify-between items-start gap-4">
                                    <p className="font-normal text-[#19243B] text-sm flex-1 leading-relaxed">
                                      {q.or_question_text || 'Discuss alternate system implementation details.'}
                                    </p>
                                    {q.marks && (
                                      <span className="font-semibold text-[#526078] text-xs shrink-0 bg-[#F8F7F4] border border-[#E2E0D9] px-2 py-0.5 rounded">
                                        [{q.marks}]
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#E2E0D9] pt-4 text-center">
                <p className="text-[#687184] text-xs leading-5">
                  Based on patterns in the papers provided — not a guarantee of future exam questions.
                </p>
              </div>

            </article>
          </div>

          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E2E0D9] p-2 grid grid-cols-4 gap-1 shadow-[0px_-4px_10px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-lg text-[#526078] hover:text-[#0057FF] text-[10px] font-medium flex flex-col justify-center items-center gap-1 min-h-14 transition-colors cursor-pointer"
            >
              <Download className="size-4" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAsQb}
              disabled={isSavingPredictedQb || !!savedQbInfo}
              className="rounded-lg text-[#526078] hover:text-[#187347] text-[10px] font-medium flex flex-col justify-center items-center gap-1 min-h-14 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Bookmark className="size-4" />
              <span>{savedQbInfo ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={handleToggleCommunityShare}
              className="rounded-lg text-[#526078] hover:text-[#0057FF] text-[10px] font-medium flex flex-col justify-center items-center gap-1 min-h-14 transition-colors cursor-pointer"
            >
              <Share2 className="size-4" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg text-[#526078] hover:text-[#19243B] text-[10px] font-medium flex flex-col justify-center items-center gap-1 min-h-14 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="size-4" />
              <span>More</span>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
              <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2E0D9] p-4 shadow-xl space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E0D9]">
                  <h3 className="font-semibold text-sm text-[#19243B]">Paper actions</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#687184] hover:text-[#19243B] cursor-pointer">
                    <X className="size-4" />
                  </button>
                </div>
                <div className="space-y-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleDownloadPdf();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isDownloadingPdf}
                    className="text-left rounded-lg text-[#19243B] hover:bg-[#F8F7F4] text-sm flex px-3 items-center gap-3 w-full h-11 cursor-pointer disabled:opacity-60"
                  >
                    {isDownloadingPdf ? (
                      <LoaderCircle className="text-[#0057FF] size-4 animate-spin" />
                    ) : (
                      <Download className="text-[#526078] size-4" />
                    )}
                    <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveAsQb();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left rounded-lg text-[#19243B] hover:bg-[#F8F7F4] text-sm flex px-3 items-center gap-3 w-full h-11 cursor-pointer"
                  >
                    <Bookmark className="text-[#526078] size-4" />
                    <span>Save to past papers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleCommunityShare();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left rounded-lg text-[#19243B] hover:bg-[#F8F7F4] text-sm flex px-3 items-center gap-3 w-full h-11 cursor-pointer"
                  >
                    <Share2 className="text-[#526078] size-4" />
                    <span>Share with community</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleCopyLink();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left rounded-lg text-[#19243B] hover:bg-[#F8F7F4] text-sm flex px-3 items-center gap-3 w-full h-11 cursor-pointer"
                  >
                    <Link className="text-[#526078] size-4" />
                    <span>Copy link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPredictedPaper(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left rounded-lg text-[#0057FF] hover:bg-[#EAF0FF] text-sm flex px-3 items-center gap-3 w-full h-11 cursor-pointer"
                  >
                    <RefreshCw className="size-4" />
                    <span>Create new paper</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {isPredictingPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="rounded-2xl bg-white border border-[#E2E0D9] w-full max-w-md p-6 sm:p-8 text-[#19243B] shadow-2xl space-y-5 text-center flex flex-col items-center">
            <div className="rounded-2xl bg-[#EAF0FF] flex justify-center items-center size-14 shadow-2xs">
              <LoaderCircle className="animate-spin text-[#0057FF] size-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-[#19243B] text-lg sm:text-xl">
                Generating Practice Paper
              </h3>
              <p className="text-[#526078] text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                Analyzing patterns across past papers and synthesizing questions for <span className="font-medium text-[#19243B]">{subject || 'your subject'}</span>...
              </p>
            </div>

            <p className="text-[#687184] text-xs pt-1">
              This usually takes 10–20 seconds.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default PredictedPaperGenerator;
