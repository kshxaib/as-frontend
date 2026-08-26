import { create } from 'zustand';
import api, { getErrorMessage } from '../api/client';
import { useAuthStore } from './useAuthStore';


export const useQuestionBankStore = create((set, get) => ({
  activeTab: 'resources', // 'resources' | 'question_banks' | 'review' | 'solutions' | 'community' | 'profile'
  setActiveTab: (tab) => set({ activeTab: tab, error: null, successMessage: null }),

  // Key Required Modal State
  isKeyModalOpen: false,
  keyModalFeature: '',
  triggerKeyModal: (featureName) => set({ isKeyModalOpen: true, keyModalFeature: featureName }),
  closeKeyModal: () => set({ isKeyModalOpen: false, keyModalFeature: '' }),

  // Global Feedback
  error: null,
  successMessage: null,
  isErrorModalOpen: false,
  // Functions for modal handling
  showErrorModal: (msg) => set({ error: msg, isErrorModalOpen: true, isUploadingResource: false }),
  closeErrorModal: () => set({ isErrorModalOpen: false, error: null }),
  clearFeedback: () => set({ error: null, successMessage: null, isErrorModalOpen: false }),

  // Resources State (Phase 2 & 3)
  resources: [],
  isLoading: false,
  isUploadingResource: false,
  isIndexingResource: {}, // map of resourceId -> boolean

  // Question Banks State (Phase 4 & 5)
  questionBanks: [],
  currentQuestionBank: null,
  questions: [],
  isUploadingQuestionBank: false,
  extractingQBs: {}, // map of questionBankId -> boolean for per-QB extraction state
  isSavingQuestions: false,


  // Answers State (Phase 6, 7, 8)
  currentAnswerSet: null,
  answerSetsList: [],
  isGeneratingAnswers: false,
  isRetryingAnswer: {}, // map of answerId -> boolean

  // Community State (Phase 10 & 11)
  communityResources: [],
  communityAnswerSets: [],
  isLoadingCommunity: false,

  // Community Answer Viewer State
  communityViewerOpen: false,
  communityViewerMeta: null,   // { answer_set_id, question_bank_name, subject, author_name, total_questions, created_at }
  communityViewerAnswers: [],
  isLoadingCommunityViewer: false,

  // Helper: check if user has configured ALL 4 required free AI keys (Gemini, Groq, Cerebras, NVIDIA)
  hasAllRequiredKeys: () => {
    const user = useAuthStore.getState().user;
    return !!(
      user?.has_gemini_key &&
      user?.has_groq_key &&
      user?.has_openrouter_key &&
      user?.has_nvidia_key
    );
  },


  // Helper: check if user has embedding key (Gemini or OpenAI)
  hasEmbeddingKey: () => {
    const user = useAuthStore.getState().user;
    return !!(user?.has_gemini_key || user?.has_openai_key);
  },

  // ----------------------------------------------------
  // Resources Operations
  // ----------------------------------------------------
  fetchResources: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const params = user ? { user_id: user.id } : {};
      const res = await api.get('/resources', { params });
      set({ resources: res.data.resources || [], isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to load study resources',
        isLoading: false,
      });
    }
  },

  uploadResource: async (formData) => {
    set({ isUploadingResource: true, error: null, successMessage: null });
    try {
      const res = await api.post('/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({
        resources: [res.data, ...state.resources],
        isUploadingResource: false,
        successMessage: `Resource "${res.data.name}" uploaded successfully!`,
      }));
      return { success: true, resource: res.data };
    } catch (err) {
      // Determine user-friendly error message
      let msg = err.response?.data?.detail || 'Failed to upload study resource';
      // If the backend indicates a size limit issue, show a custom message
      if (msg && msg.toLowerCase().includes('file size exceeds')) {
        msg = 'PDF size is larger than 10 MB. Please compress it before uploading.';
      }
      // Use custom modal for error display (call via get() since this is inside the store)
      get().showErrorModal(msg);
      return { success: false, error: msg };
    }
  },

  indexResource: async (resourceId) => {
    // Check if user has configured all 4 required AI keys
    if (!get().hasAllRequiredKeys()) {
      get().triggerKeyModal('PDF Vector Indexing (Gemini Embeddings)');
      return;
    }

    set((state) => ({
      isIndexingResource: { ...state.isIndexingResource, [resourceId]: true },
      error: null,
      successMessage: null,
    }));

    try {
      const res = await api.post(`/resources/${resourceId}/index`);
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, status: 'indexed' } : r
        ),
        isIndexingResource: { ...state.isIndexingResource, [resourceId]: false },
        successMessage: `Resource indexed! ${res.data.chunks_indexed || 0} searchable vectors embedded into Qdrant.`,
      }));
    } catch (err) {
      const msg = getErrorMessage(err, 'Indexing failed. Check your Gemini API key in Profile.');
      // Provider quota / rate-limit failures -> dedicated modal, not a raw banner
      const isQuotaError =
        err?.response?.status === 429 ||
        /resource_exhausted|exceeded your current quota|rate limit/i.test(msg);
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, status: 'indexing_failed' } : r
        ),
        isIndexingResource: { ...state.isIndexingResource, [resourceId]: false },
      }));
      if (isQuotaError) {
        get().showErrorModal(msg);
      } else {
        set({ error: msg });
      }
    }
  },

  deleteResource: async (resourceId) => {
    try {
      await api.delete(`/resources/${resourceId}`);
      set((state) => ({
        resources: state.resources.filter((r) => r.id !== resourceId),
        successMessage: 'Resource deleted successfully.',
      }));
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to delete resource.') });
    }
  },

  // ----------------------------------------------------
  // Question Bank Operations
  // ----------------------------------------------------
  fetchQuestionBanks: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = useAuthStore.getState().user;
      const params = user ? { user_id: user.id } : {};
      const res = await api.get('/question-banks', { params });
      const banks = res.data.question_banks || [];
      set({ questionBanks: banks, isLoading: false });
      if (banks.length > 0 && !get().currentQuestionBank) {
        get().selectQuestionBank(banks[0].id);
      }
    } catch (err) {
      set({
        error: getErrorMessage(err, 'Failed to load question banks'),
        isLoading: false,
      });
    }
  },

  uploadQuestionBank: async (formData) => {
    set({ isUploadingQuestionBank: true, error: null, successMessage: null });
    try {
      const res = await api.post('/question-banks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set((state) => ({
        questionBanks: [res.data, ...state.questionBanks],
        currentQuestionBank: res.data,
        isUploadingQuestionBank: false,
        successMessage: `Question Bank "${res.data.name}" uploaded successfully!`,
      }));
      return { success: true, questionBank: res.data };
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to upload question bank');
      set({ error: msg, isUploadingQuestionBank: false });
      return { success: false, error: msg };
    }
  },

  selectQuestionBank: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const [bankRes, questionsRes, answerSetsRes] = await Promise.all([
        api.get(`/question-banks/${id}`),
        api.get(`/question-banks/${id}/questions`),
        api.get(`/question-banks/${id}/answer-sets`),
      ]);

      const answerSets = answerSetsRes.data.answer_sets || [];
      let latestAnswerSet = null;

      if (answerSets.length > 0) {
        const fullSetRes = await api.get(`/answer-sets/${answerSets[0].id}`);
        latestAnswerSet = fullSetRes.data;
      }

      set({
        currentQuestionBank: bankRes.data,
        questions: questionsRes.data.questions || [],
        answerSetsList: answerSets,
        currentAnswerSet: latestAnswerSet,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err, 'Failed to load question bank details'),
        isLoading: false,
      });
    }
  },

  extractQuestions: async (id) => {
    // Check if user has configured all 4 required AI keys
    if (!get().hasAllRequiredKeys()) {
      get().triggerKeyModal('AI Question Bank Extraction');
      return;
    }

    set((state) => ({ extractingQBs: { ...state.extractingQBs, [id]: true }, error: null, successMessage: null }));
    try {
      const res = await api.post(`/question-banks/${id}/extract`);
      await get().selectQuestionBank(id);
      set((state) => ({
        extractingQBs: { ...state.extractingQBs, [id]: false },
        successMessage: `Successfully extracted ${res.data.questions_extracted || 0} questions!`,
      }));
    } catch (err) {
      const msg = getErrorMessage(err, 'Extraction failed. Check your OpenRouter/Groq/Gemini keys in Profile.');
      set((state) => ({
        error: msg,
        extractingQBs: { ...state.extractingQBs, [id]: false },
      }));
    }
  },

  updateQuestion: async (questionId, payload) => {
    try {
      const res = await api.put(`/questions/${questionId}`, payload);
      set((state) => ({
        questions: state.questions.map((q) =>
          q.id === questionId ? res.data : q
        ),
      }));
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to update question') });
    }
  },

  addQuestion: async (questionBankId, payload) => {
    try {
      const res = await api.post(`/question-banks/${questionBankId}/questions`, payload);
      const qNum = res.data.question_number;
      const formattedQNum = qNum ? `Q${String(qNum).padStart(2, '0')}` : 'Question';
      set((state) => ({
        questions: [...state.questions, res.data],
        successMessage: `Question ${formattedQNum} added successfully to the examination paper!`,
      }));
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to add question') });
    }
  },


  deleteQuestion: async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      set((state) => ({
        questions: state.questions.filter((q) => q.id !== questionId),
        successMessage: 'Question removed from question bank.',
      }));
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to delete question') });
    }
  },

  // ----------------------------------------------------
  // Answer Generation & Solutions
  // ----------------------------------------------------
  generateAnswers: async (questionBankId) => {
    // Check if user has configured all 4 required AI keys
    if (!get().hasAllRequiredKeys()) {
      get().triggerKeyModal('RAG Answer Generation & AI Review');
      return;
    }

    set({ isGeneratingAnswers: true, error: null, successMessage: null });
    try {
      const res = await api.post('/answer-sets/generate', {
        question_bank_id: questionBankId,
      });
      set({
        currentAnswerSet: res.data,
        isGeneratingAnswers: false,
        activeTab: 'solutions',
        successMessage: `Successfully generated ${res.data.completed_questions} answers with AI Review & citations!`,
      });
    } catch (err) {
      const msg = getErrorMessage(err, 'Answer generation failed. Check your Groq/Gemini/OpenRouter keys in Profile.');
      set({
        error: msg,
        isGeneratingAnswers: false,
      });
    }
  },

  retryAnswer: async (answerId, userInstruction = '') => {
    if (!get().hasAllRequiredKeys()) {
      get().triggerKeyModal('Answer Regeneration');
      return;
    }

    set((state) => ({
      isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: true },
      error: null,
    }));

    try {
      const res = await api.post(`/answers/${answerId}/retry`, {
        user_instruction: userInstruction?.trim() || null,
      });

      const returned = res.data;
      const { currentAnswerSet, currentQuestionBank } = get();

      // A changed answer_set_id means the set was shared to The Commons and the
      // backend regenerated into a NEW private working copy (fresh answer ids).
      // Fetch ONLY that one set — no global isLoading, no bank refetch — and swap
      // it in surgically, so the current tab, scroll position and expand/collapse
      // state are all preserved. The frozen community sibling stays in
      // answerSetsList, so "Share Updated Answer Set" still appears.
      const forked =
        currentAnswerSet && returned.answer_set_id !== currentAnswerSet.id;

      if (forked) {
        try {
          const setRes = await api.get(`/answer-sets/${returned.answer_set_id}`);
          const workingSet = { ...setRes.data, visibility: 'private' };
          set((state) => {
            // Keep answerSetsList rows lean (no embedded answers), matching the
            // shape the list endpoint returns.
            const workingRow = { ...workingSet };
            delete workingRow.answers;
            const others = (state.answerSetsList || []).filter(
              (a) => a.id !== workingSet.id
            );
            return {
              currentAnswerSet: workingSet,
              answerSetsList: [workingRow, ...others],
              isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
              successMessage:
                'Answer regenerated in your private copy — the shared version is unchanged. Click "Share Updated Answer Set" to publish it.',
            };
          });
        } catch {
          // Rare network fallback only: a full reload keeps state correct even if
          // the lightweight swap fails.
          set((state) => ({
            isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
          }));
          const bankId =
            currentQuestionBank?.id ?? currentAnswerSet?.question_bank_id;
          if (bankId) await get().selectQuestionBank(bankId);
        }
        return;
      }

      set((state) => {
        if (!state.currentAnswerSet) return state;
        const updatedAnswers = (state.currentAnswerSet.answers || []).map((ans) =>
          ans.id === answerId ? returned : ans
        );
        return {
          currentAnswerSet: {
            ...state.currentAnswerSet,
            answers: updatedAnswers,
          },
          isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
          successMessage: `Answer for Question ${returned.question_number} regenerated successfully!`,
        };
      });
    } catch (err) {
      set((state) => ({
        isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
        error: getErrorMessage(err, 'Failed to retry answer'),
      }));
    }
  },

  downloadSolvedPdf: async (answerSetId, customFilename) => {
    try {
      const res = await api.get(`/answer-sets/${answerSetId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const filename = customFilename || `AcademicStack_Solved_QB_${answerSetId}.pdf`;
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to download solved PDF.') });
    }
  },

  downloadResourceFile: async (resourceId, filename = 'Resource.pdf') => {
    try {
      const res = await api.get(`/resources/${resourceId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to download study resource.') });
    }
  },

  downloadQuestionBankFile: async (qbId, filename = 'QuestionBank.pdf') => {
    try {
      const res = await api.get(`/question-banks/${qbId}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to download question bank paper.') });
    }
  },

  downloadSolvedPdf: async (answerSetId, filename = 'Solved_Question_Bank.pdf') => {
    try {
      const res = await api.get(`/answer-sets/${answerSetId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to download solved PDF.' });
    }
  },

  downloadDirectPdf: async (url, filename = 'document.pdf') => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 2000);
    } catch (err) {
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  },

  // ----------------------------------------------------
  // Community Hub Operations
  // ----------------------------------------------------
  fetchCommunityFeed: async () => {
    set({ isLoadingCommunity: true, error: null });
    try {
      const [resResources, resAnswerSets] = await Promise.all([
        api.get('/community/resources'),
        api.get('/community/answer-sets'),
      ]);
      set({
        communityResources: resResources.data.resources || [],
        communityAnswerSets: resAnswerSets.data.answer_sets || [],
        isLoadingCommunity: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err, 'Failed to load community hub data'),
        isLoadingCommunity: false,
      });
    }
  },

  fetchCommunityData: async () => {
    return get().fetchCommunityFeed();
  },

  toggleResourceShare: async (resourceId) => {
    try {
      const res = await api.post(`/community/resources/${resourceId}/share`);
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, visibility: res.data.visibility } : r
        ),
        successMessage: `Resource visibility set to ${res.data.visibility}.`,
      }));
      get().fetchCommunityFeed();
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to toggle resource sharing.') });
    }
  },

  toggleAnswerSetShare: async (answerSetId) => {
    try {
      const res = await api.post(`/community/answer-sets/${answerSetId}/share`);
      set((state) => ({
        answerSetsList: state.answerSetsList.map((a) =>
          a.id === answerSetId ? { ...a, visibility: res.data.visibility } : a
        ),
        currentAnswerSet: state.currentAnswerSet?.id === answerSetId
          ? { ...state.currentAnswerSet, visibility: res.data.visibility }
          : state.currentAnswerSet,
        successMessage: `Answer set visibility set to ${res.data.visibility}.`,
      }));
      get().fetchCommunityFeed();
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to toggle answer set sharing.') });
    }
  },

  // Push an updated/regenerated answer set to The Commons as the single copy for
  // its question bank; the backend retires any previously-shared version so no
  // duplicate appears in the Hub.
  shareUpdatedAnswerSet: async (answerSetId) => {
    try {
      const res = await api.post(`/community/answer-sets/${answerSetId}/share-update`);
      const retiredIds = res.data.retired_ids || [];
      set((state) => ({
        answerSetsList: state.answerSetsList.map((a) => {
          if (a.id === answerSetId) return { ...a, visibility: 'community' };
          if (retiredIds.includes(a.id)) return { ...a, visibility: 'private' };
          return a;
        }),
        currentAnswerSet: state.currentAnswerSet?.id === answerSetId
          ? { ...state.currentAnswerSet, visibility: 'community' }
          : state.currentAnswerSet,
        successMessage: 'Shared answer set updated in The Commons.',
      }));
      get().fetchCommunityFeed();
    } catch (err) {
      set({ error: getErrorMessage(err, 'Failed to update shared answer set.') });
    }
  },

  // ----------------------------------------------------
  // Community Answer Viewer Actions
  // ----------------------------------------------------
  openCommunityViewer: async (answerSetId) => {
    set({ communityViewerOpen: true, isLoadingCommunityViewer: true, communityViewerAnswers: [], communityViewerMeta: null });
    try {
      const res = await api.get(`/community/answer-sets/${answerSetId}/answers`);
      const data = res.data;
      set({
        communityViewerMeta: {
          answer_set_id: data.answer_set_id,
          question_bank_name: data.question_bank_name,
          subject: data.subject,
          author_name: data.author_name,
          total_questions: data.total_questions,
          completed_questions: data.completed_questions,
          created_at: data.created_at,
        },
        communityViewerAnswers: data.answers || [],
        isLoadingCommunityViewer: false,
      });
    } catch (err) {
      set({
        error: getErrorMessage(err, 'Failed to load solved answers.'),
        isLoadingCommunityViewer: false,
        communityViewerOpen: false,
      });
    }
  },

  closeCommunityViewer: () => {
    set({
      communityViewerOpen: false,
      communityViewerMeta: null,
      communityViewerAnswers: [],
    });
  },
}));
