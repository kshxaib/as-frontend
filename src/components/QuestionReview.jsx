import React, { useEffect, useState } from 'react';
import {
  Search,
  Download,
  Plus,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Info,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  CircleAlert,
  LoaderCircle,
} from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { useAuthStore } from '../store/useAuthStore';
import { QuestionCard } from './QuestionCard';
import { AddQuestionModal } from './AddQuestionModal';
import { AiProgressModal } from './AiProgressModal';
import { ApiKeyBanner } from './ui/ApiKeyBanner';

export const QuestionReview = () => {
  const {
    questionBanks,
    currentQuestionBank,
    questions,
    isLoading,
    extractingQBs,
    extractionFailedQB,
    extractionErrorMessage,
    clearExtractionFailedQB,
    isGeneratingAnswers,
    error,
    successMessage,
    fetchQuestionBanks,
    selectQuestionBank,
    extractQuestions,
    deleteQuestion,
    generateAnswers,
    clearFeedback,
    downloadQuestionsPdf,
    triggerKeyModal,
  } = useQuestionBankStore();

  const { user } = useAuthStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    fetchQuestionBanks();
  }, [fetchQuestionBanks]);

  const handleDownloadPdf = async () => {
    if (!currentQuestionBank || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadQuestionsPdf(
        currentQuestionBank.id,
        `Questions_${(currentQuestionBank.name || 'QB').replace(/\s+/g, '_')}.pdf`
      );
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const totalQuestions = (questions || []).length;
  const totalMarks = (questions || []).reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

  const filteredQuestions = (questions || []).filter((q) =>
    (q.question_text || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartGeneration = async () => {
    if (!user?.has_openai_key) {
      setIsGenerateModalOpen(false);
      triggerKeyModal('AI Answer Generation');
      return;
    }
    setIsGenerateModalOpen(false);
    if (currentQuestionBank) {
      await generateAnswers(currentQuestionBank.id);
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
          <button onClick={clearFeedback} className="text-xs font-semibold hover:underline cursor-pointer">
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
          <button onClick={clearFeedback} className="text-xs font-semibold hover:underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <ApiKeyBanner feature="AI Answer Generation" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-1">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight text-[#19243B]">
            Check your questions
          </h1>
          <p className="text-[#526078] text-sm sm:text-base mt-0.5">
            Review the wording and marks before creating your answers.
          </p>
        </div>

        {questionBanks && questionBanks.length > 0 && (
          <div className="w-full sm:w-80">
            <select
              value={currentQuestionBank?.id || ''}
              onChange={(e) => selectQuestionBank(Number(e.target.value))}
              className="w-full rounded-xl bg-white border border-[#E2E0D9] px-4 h-11 text-sm font-medium text-[#19243B] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs cursor-pointer"
            >
              {questionBanks.map((qb) => (
                <option key={qb.id} value={qb.id}>
                  {qb.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        <span className="font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E2E0D9] text-[#19243B] shadow-2xs">
          Questions: <strong className="text-[#0057FF]">{totalQuestions}</strong>
        </span>
        <span className="font-medium px-3 py-1.5 rounded-lg bg-white border border-[#E2E0D9] text-[#19243B] shadow-2xs">
          Total Marks: <strong className="text-[#0057FF]">{totalMarks}</strong>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row mt-6 items-stretch sm:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="text-[#687184] absolute top-3.5 left-3.5 size-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions"
            className="w-full rounded-xl bg-white border border-[#E2E0D9] pl-10 pr-4 h-11 text-sm text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          {currentQuestionBank && questions.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="font-medium rounded-xl bg-white text-[#19243B] text-sm border border-[#E2E0D9] flex h-11 px-4 items-center justify-center gap-2 hover:bg-[#F1F0EC] transition-colors cursor-pointer shadow-2xs flex-1 sm:flex-initial disabled:opacity-60"
            >
              {isDownloadingPdf ? (
                <LoaderCircle className="size-4 animate-spin text-[#0057FF]" />
              ) : (
                <Download className="size-4 text-[#0057FF]" />
              )}
              <span className="hidden sm:inline">
                {isDownloadingPdf ? 'Generating PDF...' : 'Download PDF'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="font-medium rounded-xl bg-white hover:bg-[#F8F7F4] text-[#19243B] border border-[#D5D8DF] hover:border-[#19243B] text-sm flex h-11 px-4 items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer flex-1 sm:flex-initial"
          >
            <Plus className="size-4" />
            <span>Add question</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!user?.has_openai_key) {
                triggerKeyModal('AI Answer Generation');
                return;
              }
              setIsGenerateModalOpen(true);
            }}
            disabled={questions.length === 0 || isGeneratingAnswers}
            className="font-semibold rounded-xl bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm flex h-11 px-5 items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex-1 sm:flex-initial"
          >
            <Sparkles className="size-4" />
            <span>{isGeneratingAnswers ? 'Generating answers...' : 'Generate answers'}</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 min-w-0 mt-5">
        <div className="flex justify-between items-center select-none pb-0.5">
          <h3 className="font-semibold text-base text-[#19243B]">Questions</h3>
          <span className="text-[#526078] text-xs font-medium">
            {filteredQuestions.length} {filteredQuestions.length === 1 ? 'question' : 'questions'}
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#526078] bg-white rounded-xl border border-[#E2E0D9]">
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-[#0057FF] mb-2.5" />
            <p className="text-xs font-medium">Loading questions archive...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filteredQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={idx}
                onDeleteRequest={(targetQuestion) => setDeleteCandidate(targetQuestion)}
              />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center rounded-2xl bg-[#F8F7F4]/60 border border-dashed border-[#C6CAD3] flex px-8 py-16 flex-col justify-center items-center">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-4 place-items-center size-14">
              <FileText className="size-7" />
            </div>
            <h3 className="font-semibold text-xl text-[#19243B]">
              No questions in this collection yet
            </h3>
            <p className="text-[#526078] text-sm mt-2 max-w-md">
              Click "Add question" to add questions manually, or re-extract from your uploaded past papers.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-5 font-medium rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm py-2.5 px-5 shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="size-4" />
              <span>Add first question</span>
            </button>
          </div>
        ) : (
          <div className="text-center rounded-2xl bg-[#F8F7F4]/60 border border-dashed border-[#C6CAD3] flex px-8 py-14 flex-col justify-center items-center">
            <div className="rounded-2xl bg-[#0057FF]/10 text-[#0057FF] grid mb-4 place-items-center size-14">
              <Search className="size-7" />
            </div>
            <h3 className="font-semibold text-lg text-[#19243B]">
              No questions match your search
            </h3>
            <p className="text-[#526078] text-sm mt-1 max-w-sm">
              Try a different keyword or clear your search to see all questions.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 rounded-lg bg-white border border-[#E2E0D9] text-[#19243B] px-4 py-2 text-xs font-semibold hover:bg-[#F1F0EC] transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        questionBankId={currentQuestionBank?.id}
        nextNumber={totalQuestions + 1}
      />

      {deleteCandidate && (
        <div className="bg-[#19243B]/40 flex fixed z-50 top-0 right-0 bottom-0 left-0 pt-8 pr-8 pb-8 pl-8 justify-center items-center backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
          <div className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl bg-white border border-[#E2E0D9] w-[480px] max-w-full overflow-hidden text-[#19243B] my-auto">
            
            <div className="border-b border-[#E2E0D9] flex pt-6 pr-6 pb-6 pl-6 items-start gap-4">
              <div className="rounded-xl bg-[#FFF0EE] text-[#B42318] flex justify-center items-center shrink-0 size-10">
                <AlertTriangle className="size-5" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
                  Delete this question?
                </h2>
              </div>
            </div>

            <div className="flex pt-6 pr-6 pb-6 pl-6 flex-col gap-4">
              <div className="rounded-xl bg-[#F8F7F4] text-[#526078] text-sm border border-[#E2E0D9] pt-4 pr-4 pb-4 pl-4 leading-relaxed">
                {deleteCandidate.question_text}
              </div>
              <p className="text-[#526078] text-sm">
                This will remove the question from this question bank.
              </p>
            </div>

            <div className="border-t border-[#E2E0D9] flex pt-6 pr-6 pb-6 pl-6 justify-end gap-2 bg-[#FDFCFA]">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="font-medium rounded-lg bg-white text-[#19243B] text-sm border border-[#E2E0D9] pt-2 pr-4 pb-2 pl-4 hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteCandidate) {
                    await deleteQuestion(deleteCandidate.id);
                    setDeleteCandidate(null);
                  }
                }}
                className="font-medium rounded-lg bg-[#B42318] hover:bg-[#91180D] text-white text-sm flex pt-2 pr-4 pb-2 pl-4 items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Trash2 className="size-4" />
                <span>Delete question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isGenerateModalOpen && (
        <div className="bg-[#19243B]/40 flex fixed z-50 top-0 right-0 bottom-0 left-0 pt-8 pr-8 pb-8 pl-8 justify-center items-center backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
          <div className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl bg-white border border-[#E2E0D9] w-[560px] max-w-full overflow-hidden text-[#19243B] my-auto">
            
            <div className="border-b border-[#E2E0D9] flex pt-6 pr-6 pb-6 pl-6 flex-col gap-2">
              <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
                Create answers for this question bank?
              </h2>
              <p className="text-[#526078] text-sm leading-6">
                AcademicStack will use your linked study materials and your OpenAI API key. OpenAI usage charges may apply.
              </p>
            </div>

            <div className="pt-6 pr-6 pb-6 pl-6">
              <div className="rounded-lg bg-[#0057FF]/10 border border-[#0057FF]/20 flex pt-4 pr-4 pb-4 pl-4 items-start gap-3">
                <Info className="text-[#0057FF] mt-0.5 shrink-0 size-4" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-[#19243B] text-sm">
                    {currentQuestionBank?.name || 'Operating Systems — Previous Papers'}
                  </p>
                  <p className="text-[#526078] text-sm">
                    {totalQuestions} reviewed questions, {totalMarks} total marks
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E2E0D9] flex pt-6 pr-6 pb-6 pl-6 justify-end items-center gap-2 bg-[#FDFCFA]">
              <button
                type="button"
                onClick={() => setIsGenerateModalOpen(false)}
                className="font-medium rounded-lg bg-white text-[#19243B] text-sm border border-[#E2E0D9] pt-2 pr-4 pb-2 pl-4 hover:bg-[#F1F0EC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartGeneration}
                className="font-medium rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm pt-2 pr-4 pb-2 pl-4 shadow-sm transition-all cursor-pointer"
              >
                Generate answers
              </button>
            </div>
          </div>
        </div>
      )}

      <AiProgressModal
        isOpen={Object.values(extractingQBs).some(Boolean)}
        type="extraction"
        title="Creating your questions"
        itemName={currentQuestionBank?.name || 'Past Exam Papers'}
        noticeText="Questions will appear here once extraction is complete."
      />

      <AiProgressModal
        isOpen={isGeneratingAnswers}
        type="generation"
        title="Generating manuscript solutions"
        itemName={currentQuestionBank?.name || 'Question Bank Solutions'}
        noticeText={`Synthesizing solutions for ${totalQuestions} questions with Qdrant vector retrieval and OpenAI RAG.`}
      />

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
    </div>
  );
};
