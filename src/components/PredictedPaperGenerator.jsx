import { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Download,
  BookmarkPlus,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';

const MAX_PAPERS = 10;

export const PredictedPaperGenerator = () => {
  const {
    questionBanks,
    fetchQuestionBanks,
    predictPaper,
    savePredictedPaperAsQb,
    downloadPredictedPaperPdf,
    predictedPaper,
    setPredictedPaper,
    isPredictingPaper,
    isSavingPredictedQb,
    setActiveTab,
    selectQuestionBank,
  } = useQuestionBankStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  // Form State
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [paperRows, setPaperRows] = useState([
    { id: 1, type: 'upload', file: null, qbId: null, qbName: '', session: '' },
    { id: 2, type: 'upload', file: null, qbId: null, qbName: '', session: '' },
  ]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [savedQbInfo, setSavedQbInfo] = useState(null);

  // Add row (up to MAX_PAPERS)
  const handleAddRow = () => {
    if (paperRows.length >= MAX_PAPERS) return;
    setPaperRows((prev) => [
      ...prev,
      { id: Date.now(), type: 'upload', file: null, qbId: null, qbName: '', session: '' },
    ]);
  };

  // Remove row
  const handleRemoveRow = (id) => {
    if (paperRows.length <= 1) return;
    setPaperRows((prev) => prev.filter((r) => r.id !== id));
  };

  // File change
  const handleFileChange = (id, file) => {
    setPaperRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, file, type: 'upload' } : r))
    );
  };

  // Session label change
  const handleSessionChange = (id, session) => {
    setPaperRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, session } : r))
    );
  };

  // Toggle existing QB: adds or removes from the main paperRows list above
  const handleToggleQb = (qb) => {
    setValidationError('');
    setPaperRows((prev) => {
      const existingIndex = prev.findIndex((r) => r.qbId === qb.id);
      if (existingIndex !== -1) {
        // Unselecting: remove this row if more than 1 row exists, else reset to blank upload
        if (prev.length <= 1) {
          return [{ id: Date.now(), type: 'upload', file: null, qbId: null, qbName: '', session: '' }];
        }
        return prev.filter((r) => r.qbId !== qb.id);
      }

      if (prev.length >= MAX_PAPERS) {
        setValidationError(`Maximum ${MAX_PAPERS} papers limit reached.`);
        return prev;
      }

      // Check if there is an empty upload row with no file and no session, and replace it
      const emptyUploadIdx = prev.findIndex((r) => r.type === 'upload' && !r.file && !r.session);
      const newRow = {
        id: Date.now(),
        type: 'existing_qb',
        file: null,
        qbId: qb.id,
        qbName: qb.name,
        session: '',
      };

      if (emptyUploadIdx !== -1) {
        const copy = [...prev];
        copy[emptyUploadIdx] = newRow;
        return copy;
      }

      return [...prev, newRow];
    });

    if (!subject.trim() && qb.subject) {
      setSubject(qb.subject);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!subject.trim()) {
      setValidationError('Please enter a subject name (e.g. DBMS, Computer Networks).');
      return;
    }

    const validUploadRows = paperRows.filter((r) => r.type === 'upload' && r.file !== null);
    const validQbRows = paperRows.filter((r) => r.type === 'existing_qb' && r.qbId !== null);

    if (validUploadRows.length === 0 && validQbRows.length === 0) {
      setValidationError('Please upload at least one question paper PDF or select an existing Question Bank.');
      return;
    }

    // Ensure dates/sessions are provided so AI understands the timeline
    const rowsWithSource = paperRows.filter(
      (r) => (r.type === 'upload' && r.file) || (r.type === 'existing_qb' && r.qbId)
    );
    const missingDateRow = rowsWithSource.find((r) => !r.session.trim());
    if (missingDateRow) {
      setValidationError('Please enter the Exam Session / Year (e.g. May 2023, Dec 2022) for all selected papers so AI knows the exam timeline.');
      return;
    }

    const formData = new FormData();
    formData.append('subject', subject.trim());
    formData.append('title', title.trim() || `Predicted ${subject.trim()} Final Exam Paper`);
    formData.append('user_id', user?.id || 1);

    // Metadata JSON for uploaded files
    const metaList = validUploadRows.map((r) => ({
      session: r.session.trim() || 'Exam Paper',
      filename: r.file.name,
    }));
    formData.append('papers_meta', JSON.stringify(metaList));

    // Append files
    validUploadRows.forEach((r) => {
      formData.append('files', r.file);
    });

    // Append existing QBs
    if (validQbRows.length > 0) {
      formData.append('existing_qb_ids', validQbRows.map((q) => q.qbId).join(','));
      const qbMetaList = validQbRows.map((q) => ({ id: q.qbId, session: q.session.trim() || q.qbName }));
      formData.append('existing_qbs_meta', JSON.stringify(qbMetaList));
    }

    const res = await predictPaper(formData);
    if (res.success) {
      setSavedQbInfo(null);
    }
  };

  // Handle Save to Question Banks
  const handleSaveAsQb = async () => {
    if (!predictedPaper) return;
    const res = await savePredictedPaperAsQb(predictedPaper);
    if (res.success) {
      setSavedQbInfo(res.data);
    }
  };

  // Handle Copy Paper Text
  const handleCopyText = () => {
    if (!predictedPaper) return;
    const meta = predictedPaper.exam_meta || {};
    let text = `${meta.paper_title || 'Predicted Examination Paper'}\n`;
    text += `Course: ${meta.subject || subject}\n`;
    text += `Time Allowed: ${meta.time_allowed || '3 Hours'} | Max Marks: ${meta.maximum_marks || 70}\n\n`;
    text += `General Instructions:\n`;
    (meta.general_instructions || []).forEach((inst, i) => {
      text += `(${i + 1}) ${inst}\n`;
    });
    text += `\n`;

    (predictedPaper.sections || []).forEach((sec) => {
      text += `\n=== ${sec.section_name} ===\n`;
      if (sec.section_instruction) text += `${sec.section_instruction}\n\n`;
      (sec.questions || []).forEach((q) => {
        if (q.is_or_choice) {
          text += `  — OR —\n`;
        } else {
          text += `${q.question_number} ${q.question_text} [${q.marks} Marks]\n`;
        }
      });
    });

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleDownloadPdf = () => {
    if (!predictedPaper) return;
    const meta = predictedPaper.exam_meta || {};
    const safeTitle = (meta.paper_title || 'Predicted_Paper').replace(/\s+/g, '_');
    downloadPredictedPaperPdf(predictedPaper, `${safeTitle}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pb-32 text-[var(--text-primary)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Editorial Masthead ── */}
        <div className="pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[var(--primary)] mb-1">
            <Sparkles className="h-3.5 w-3.5 stroke-[1.5]" />
            AI Multi-Paper Trend Analyzer & Synthesis
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--text-primary)]">
            AI Predicted Question Paper Generator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl">
            Upload up to 10 past examination papers. AcademicStack analyzes recurring university blueprints, 
            sub-question formatting, and mark weightages to synthesize an authentic, high-probability predicted 
            model paper in the exact examination format.
          </p>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mt-4 flex items-center justify-between rounded-[8px] border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-3 text-xs text-[var(--error)]">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </div>
            <button onClick={() => setValidationError('')} className="font-mono hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* ── Main Layout: Input Form vs Generated Paper ── */}
        {!predictedPaper ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">

            {/* Step 1: Subject & Target Title */}
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-[var(--primary)] flex items-center gap-2">
                <span>01</span> Target Examination Details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Academic Subject / Course <span className="text-[var(--error)]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Database Management Systems, Artificial Intelligence"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none placeholder-[var(--text-disabled)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Predicted Paper Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Predicted End-Semester Examination 2026"
                    className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3.5 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none placeholder-[var(--text-disabled)]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Dynamic Past Exam Papers Rows (Max 10) */}
            <div className="rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-[var(--primary)] flex items-center gap-2">
                    <span>02</span> Past Examination Papers & Dates
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Add up to {MAX_PAPERS} past exam papers. For each paper, enter the Exam Session / Year (e.g. May 2023, Dec 2022) so AI understands the chronological exam timeline.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-[var(--text-muted)] bg-[var(--surface-well)] px-2.5 py-1 rounded-[6px] border border-[var(--border-subtle)]">
                    {paperRows.length} / {MAX_PAPERS} Papers
                  </span>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    disabled={paperRows.length >= MAX_PAPERS}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--primary)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Another Exam Paper</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Rows */}
              <div className="mt-5 space-y-3">
                {paperRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3.5 transition-all hover:border-[var(--border)]"
                  >
                    {/* Index Tag */}
                    <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border-subtle)] shrink-0">
                      Paper #{String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Source: File Upload OR Existing QB */}
                    <div className="flex-1 w-full sm:w-auto">
                      {row.type === 'existing_qb' ? (
                        <div className="flex items-center justify-between gap-2 rounded-[6px] border border-[rgba(15,118,110,0.3)] bg-[rgba(15,118,110,0.08)] px-3 py-2 text-xs text-[var(--text-primary)]">
                          <div className="flex items-center gap-2 truncate">
                            <BookOpen className="h-4 w-4 text-[var(--primary)] shrink-0" />
                            <div className="truncate">
                              <span className="font-mono text-[10px] uppercase font-bold text-[var(--primary)] mr-1.5">[Account QB]</span>
                              <span className="font-medium">{row.qbName}</span>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-[var(--text-muted)] bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                            Selected
                          </span>
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(row.id, e.target.files?.[0] || null)}
                            className="w-full text-xs text-[var(--text-secondary)] file:mr-3 file:rounded-[6px] file:border-0 file:bg-[var(--primary)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[var(--primary-foreground)] file:cursor-pointer hover:file:opacity-90 cursor-pointer"
                          />
                          {row.file && (
                            <p className="mt-1 font-mono text-[10px] text-[var(--success)] flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {row.file.name} ({(row.file.size / 1024).toFixed(0)} KB)
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Session / Year Label Input */}
                    <div className="w-full sm:w-72 shrink-0">
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={row.session}
                          onChange={(e) => handleSessionChange(row.id, e.target.value)}
                          placeholder="Exam Date / Session (e.g. May 2023) *"
                          className={`w-full rounded-[6px] border py-1.5 pl-8 pr-2.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none ${
                            !row.session && (row.file || row.qbId)
                              ? 'border-amber-500/40 bg-[var(--surface)]'
                              : 'border-[var(--border)] bg-[var(--surface)]'
                          }`}
                        />
                      </div>
                      {!row.session && (row.file || row.qbId) && (
                        <p className="mt-1 text-[10px] text-amber-500/90 font-mono">
                          * Session date required
                        </p>
                      )}
                    </div>

                    {/* Remove Row Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      disabled={paperRows.length <= 1}
                      title="Remove this paper"
                      className="p-1.5 rounded-[6px] text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[rgba(239,68,68,0.1)] transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 stroke-[1.5]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Existing Question Banks Linker */}
              <div className="mt-8 pt-5 border-t border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-[var(--primary)] flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>Or Pick Question Banks Already in Your Account</span>
                      <span className="text-[var(--text-muted)] font-normal font-sans">(Optional)</span>
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                      Select any Question Bank below to include it in the papers list above. Specify the exam session date in the corresponding row above.
                    </p>
                  </div>


                  {paperRows.filter((r) => r.type === 'existing_qb').length > 0 && (
                    <span className="font-mono text-[11px] bg-[rgba(15,118,110,0.1)] text-[var(--primary)] px-2.5 py-1 rounded-[6px] border border-[rgba(15,118,110,0.2)] font-medium">
                      {paperRows.filter((r) => r.type === 'existing_qb').length} Question Bank(s) Added
                    </span>
                  )}
                </div>

                {questionBanks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                    {questionBanks.map((qb) => {
                      const isSelected = paperRows.some((r) => r.qbId === qb.id);
                      return (
                        <div
                          key={qb.id}
                          onClick={() => handleToggleQb(qb)}
                          className={`rounded-[8px] border p-3 text-xs cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[var(--primary)] bg-[rgba(15,118,110,0.08)] text-[var(--text-primary)] shadow-sm'
                              : 'border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-medium truncate text-xs">{qb.name}</p>
                            <p className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">{qb.subject}</p>
                          </div>
                          <div className={`h-6 px-2.5 rounded-[5px] text-[10px] font-mono font-medium flex items-center gap-1 shrink-0 ${
                            isSelected ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]'
                          }`}>
                            {isSelected ? (
                              <>
                                <Check className="h-3 w-3 stroke-[2.5]" />
                                <span>Added</span>
                              </>
                            ) : (
                              <span>+ Add</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[8px] border border-dashed border-[var(--border)] bg-[var(--surface-well)] p-4 text-center">
                    <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5">
                      <FolderOpen className="h-4 w-4 text-[var(--text-muted)]" />
                      <span>No question banks uploaded yet in your account. You can upload PDF papers directly in the boxes above!</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Synthesis Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface-well)] p-5">
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">Exam Pattern Engine: </span>
                AI will cross-correlate question cadence, mark weightages, and section layouts to synthesize the expected paper.
              </div>

              <button
                type="submit"
                disabled={isPredictingPaper}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[8px] bg-[var(--primary)] px-6 py-3 font-medium text-xs text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
              >
                {isPredictingPaper ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Papers & Predicting Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 stroke-[2]" />
                    <span>Analyze Past Papers & Synthesize Predicted Question Paper</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ── Output View: Authentic University Predicted Paper Workspace ── */
          <div className="mt-8 space-y-6">

            {/* Top Action Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[rgba(15,118,110,0.1)] text-[var(--primary)]">
                  <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Predicted Examination Paper Ready
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">
                    Synthesized from multi-year question paper blueprint
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--primary)] px-3.5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
                >
                  <Download className="h-3.5 w-3.5 stroke-[2]" />
                  <span>Download Model Paper PDF</span>
                </button>

                <button
                  onClick={handleSaveAsQb}
                  disabled={isSavingPredictedQb || !!savedQbInfo}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3.5 py-2 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--primary)] transition-all disabled:opacity-50"
                >
                  <BookmarkPlus className="h-3.5 w-3.5 stroke-[1.5]" />
                  <span>{savedQbInfo ? 'Saved to Question Banks' : isSavingPredictedQb ? 'Saving...' : 'Save as Question Bank'}</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition-all"
                  title="Copy Clean Text"
                >
                  {copySuccess ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
                  <span>{copySuccess ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setPredictedPaper(null)}
                  className="inline-flex items-center gap-1 rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>New Prediction</span>
                </button>
              </div>
            </div>

            {/* Saved Notification Banner */}
            {savedQbInfo && (
              <div className="flex items-center justify-between rounded-[8px] border border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.08)] p-3 text-xs text-[var(--success)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    Successfully saved as Question Bank <b>"{savedQbInfo.name}"</b>. You can now audit questions or generate grounded solutions.
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await selectQuestionBank(savedQbInfo.question_bank_id);
                    setActiveTab('review');
                  }}
                  className="font-mono text-xs font-semibold underline hover:opacity-80 flex items-center gap-1 shrink-0 ml-3"
                >
                  <span>Go to Question Review</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* AI Pattern Insights Card */}
            {predictedPaper.pattern_insights && (
              <div className="rounded-[10px] border border-[var(--border)] bg-[var(--surface-well)] p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--primary)] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Exam Blueprint Analysis
                </span>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  {predictedPaper.pattern_insights.analysis_summary}
                </p>

                {predictedPaper.pattern_insights.recurring_topics && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">Recurring Themes:</span>
                    {predictedPaper.pattern_insights.recurring_topics.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-secondary)]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Realistic University Examination Paper Canvas ── */}
            <div className="rounded-[12px] border border-[var(--border-strong)] bg-[var(--surface)] p-8 sm:p-12 shadow-md">
              
              {/* University Exam Masthead */}
              <div className="text-center pb-6 border-b-2 border-[var(--text-primary)]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--primary)] block mb-1">
                  {predictedPaper.exam_meta?.university_heading || 'ACADEMICSTACK PREDICTED MODEL EXAMINATION'}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  {predictedPaper.exam_meta?.paper_title || 'Predicted Examination Paper'}
                </h2>
                <p className="font-mono text-xs font-semibold text-[var(--text-secondary)] mt-1">
                  Course / Subject: <span className="text-[var(--text-primary)]">{predictedPaper.exam_meta?.subject || subject}</span>
                </p>

                {/* Disclaimer Badge */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Strictly for Preparation & Practice • Not an Official Examination Paper • Questions Not Guaranteed</span>
                </div>

                {/* Exam Meta Strip */}
                <div className="mt-4 flex items-center justify-between border-t border-b border-[var(--border)] py-2 text-xs font-mono text-[var(--text-secondary)]">
                  <span>Time Allowed: <b>{predictedPaper.exam_meta?.time_allowed || '3 Hours'}</b></span>
                  <span>Session: <b>Predicted Model {new Date().getFullYear()}</b></span>
                  <span>Maximum Marks: <b>{predictedPaper.exam_meta?.maximum_marks || 70}</b></span>
                </div>
              </div>

              {/* Instructions Box */}
              {predictedPaper.exam_meta?.general_instructions && (
                <div className="mt-4 rounded-[6px] border border-[var(--border-subtle)] bg-[var(--surface-well)] p-3 text-[11px] text-[var(--text-muted)] italic">
                  <p className="font-bold font-sans not-italic text-[var(--text-secondary)] mb-1">
                    General Instructions to Candidates:
                  </p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    {predictedPaper.exam_meta.general_instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Sections & Questions */}
              <div className="mt-8 space-y-8">
                {(predictedPaper.sections || []).map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-4">
                    
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-[var(--border-strong)] pb-1.5">
                      <h3 className="font-display text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
                        {sec.section_name}
                      </h3>
                      {sec.section_instruction && (
                        <span className="font-mono text-[11px] text-[var(--primary)] font-medium">
                          {sec.section_instruction}
                        </span>
                      )}
                    </div>

                    {/* Questions Table/List */}
                    <div className="divide-y divide-[var(--border-subtle)]">
                      {(sec.questions || []).map((q, qIdx) => {
                        if (q.is_or_choice) {
                          return (
                            <div key={qIdx} className="py-2.5 text-center font-bold font-mono text-xs text-[var(--text-muted)] tracking-wider">
                              — OR —
                            </div>
                          );
                        }

                        return (
                          <div key={qIdx} className="py-3 flex items-start justify-between gap-4 group">
                            <div className="flex items-start gap-3">
                              <span className="font-mono text-xs font-bold text-[var(--text-primary)] shrink-0 pt-0.5">
                                {q.question_number}
                              </span>
                              <div>
                                <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-line">
                                  {q.question_text}
                                </p>
                                {q.prediction_likelihood && (
                                  <div className="mt-1 flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                                    <span className="text-[var(--primary)] font-semibold">
                                      ★ {q.prediction_likelihood} Likelihood
                                    </span>
                                    {q.source_trend && <span>• {q.source_trend}</span>}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Marks Column */}
                            <span className="font-mono text-xs font-bold text-[var(--primary)] bg-[var(--surface-well)] px-2 py-0.5 rounded border border-[var(--border-subtle)] shrink-0">
                              [{q.marks} Marks]
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* End of paper marker */}
              <div className="mt-12 text-center border-t border-[var(--border)] pt-4 font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
                *** End of Examination Paper ***
              </div>
              <p className="mt-3 text-center text-[10.5px] text-[var(--text-muted)] italic max-w-2xl mx-auto leading-relaxed">
                Disclaimer: This predicted question paper is synthesized by AcademicStack AI based on past examination pattern analysis strictly for practice, mock simulation, and revision. It is not an official university paper and does not guarantee questions in the actual examination.
              </p>
            </div>

            {/* Bottom Download Bar */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setPredictedPaper(null)}
                className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ← Back to Multi-Paper Setup
              </button>

              <button
                onClick={handleDownloadPdf}
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--primary)] px-5 py-2.5 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
              >
                <Download className="h-4 w-4 stroke-[2]" />
                <span>Download Model Paper PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
