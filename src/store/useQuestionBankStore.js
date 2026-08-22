import { create } from 'zustand';
import api from '../api/client';
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
  clearFeedback: () => set({ error: null, successMessage: null }),

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
      const msg = err.response?.data?.detail || 'Failed to upload study resource';
      set({ error: msg, isUploadingResource: false });
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
      const msg = err.response?.data?.detail || 'Indexing failed. Check your Gemini API key in Profile.';
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, status: 'indexing_failed' } : r
        ),
        isIndexingResource: { ...state.isIndexingResource, [resourceId]: false },
        error: msg,
      }));
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
      set({ error: err.response?.data?.detail || 'Failed to delete resource.' });
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
        error: err.response?.data?.detail || 'Failed to load question banks',
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
      const msg = err.response?.data?.detail || 'Failed to upload question bank';
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
        error: err.response?.data?.detail || 'Failed to load question bank details',
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
      const msg = err.response?.data?.detail || 'Extraction failed. Check your OpenRouter/Groq/Gemini keys in Profile.';
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
      set({ error: err.response?.data?.detail || 'Failed to update question' });
    }
  },

  addQuestion: async (questionBankId, payload) => {
    try {
      const res = await api.post(`/question-banks/${questionBankId}/questions`, payload);
      set((state) => ({
        questions: [...state.questions, res.data],
        successMessage: 'Question added successfully!',
      }));
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to add question' });
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
      set({ error: err.response?.data?.detail || 'Failed to delete question' });
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
      const msg = err.response?.data?.detail || 'Answer generation failed. Check your Groq/Gemini/OpenRouter keys in Profile.';
      set({
        error: msg,
        isGeneratingAnswers: false,
      });
    }
  },

  retryAnswer: async (answerId) => {
    if (!get().hasAllRequiredKeys()) {
      get().triggerKeyModal('Answer Regeneration');
      return;
    }

    set((state) => ({
      isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: true },
      error: null,
    }));

    try {
      const res = await api.post(`/answers/${answerId}/retry`);
      set((state) => {
        if (!state.currentAnswerSet) return state;
        const updatedAnswers = (state.currentAnswerSet.answers || []).map((ans) =>
          ans.id === answerId ? res.data : ans
        );
        return {
          currentAnswerSet: {
            ...state.currentAnswerSet,
            answers: updatedAnswers,
          },
          isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
          successMessage: `Answer for Question ${res.data.question_number} regenerated successfully!`,
        };
      });
    } catch (err) {
      set((state) => ({
        isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
        error: err.response?.data?.detail || 'Failed to retry answer',
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
      set({ error: err.response?.data?.detail || 'Failed to download solved PDF.' });
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
      set({ error: err.response?.data?.detail || 'Failed to download study resource.' });
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
      set({ error: err.response?.data?.detail || 'Failed to download question bank paper.' });
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
        error: err.response?.data?.detail || 'Failed to load community hub data',
        isLoadingCommunity: false,
      });
    }
  },

  toggleResourceShare: async (resourceId) => {
    try {
      const res = await api.post(`/resources/${resourceId}/share`);
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, visibility: res.data.visibility } : r
        ),
        successMessage: `Resource visibility set to ${res.data.visibility}.`,
      }));
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to toggle resource sharing.' });
    }
  },

  toggleAnswerSetShare: async (answerSetId) => {
    try {
      const res = await api.post(`/answer-sets/${answerSetId}/share`);
      set((state) => ({
        currentAnswerSet: state.currentAnswerSet?.id === answerSetId
          ? { ...state.currentAnswerSet, visibility: res.data.visibility }
          : state.currentAnswerSet,
        successMessage: `Answer set visibility set to ${res.data.visibility}.`,
      }));
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to toggle answer set sharing.' });
    }
  },
}));