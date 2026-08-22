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
  closeKeyModal: () => set({ isKeyModalOpen: false }),

  // Resources State
  resources: [],
  isUploadingResource: false,
  isIndexingResource: {},

  // Question Banks State
  questionBanks: [],
  currentQuestionBank: null,
  questions: [],
  isUploadingQuestionBank: false,
  isExtracting: false,

  // Answer Sets State
  currentAnswerSet: null,
  answerSetsList: [],
  isGeneratingAnswers: false,
  isRetryingAnswer: {},

  // Community Hub State
  communityResources: [],
  communityAnswerSets: [],
  isLoadingCommunity: false,

  // General Status
  isLoading: false,
  error: null,
  successMessage: null,

  // Clear feedback messages
  clearFeedback: () => set({ error: null, successMessage: null }),

  // ----------------------------------------------------
  // Resources Operations (Phase 2 & 3)
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
        error: err.response?.data?.detail || 'Failed to fetch study resources',
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
    const user = useAuthStore.getState().user;
    if (!user?.has_openai_key) {
      get().triggerKeyModal('Resource Vector Indexing (Qdrant & Embeddings)');
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
      const msg = err.response?.data?.detail || 'Indexing failed. Verify your OpenAI API key.';
      if (msg.toLowerCase().includes('openai api key') || err.response?.status === 400) {
        get().triggerKeyModal('Resource Vector Indexing');
      }
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
  // Question Bank Operations (Phase 4 & 5)
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
        error: err.response?.data?.detail || 'Failed to fetch question banks',
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
        isUploadingQuestionBank: false,
        currentQuestionBank: res.data,
        successMessage: `Question Bank "${res.data.name}" created!`,
      }));
      await get().selectQuestionBank(res.data.id);
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
    const user = useAuthStore.getState().user;
    if (!user?.has_openai_key) {
      get().triggerKeyModal('AI Question Bank Extraction (LLM)');
      return;
    }

    set({ isExtracting: true, error: null, successMessage: null });
    try {
      const res = await api.post(`/question-banks/${id}/extract`);
      await get().selectQuestionBank(id);
      set({
        isExtracting: false,
        successMessage: `Successfully extracted ${res.data.questions_extracted || 0} questions!`,
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Extraction failed. Make sure OpenAI API key is valid.';
      if (msg.toLowerCase().includes('openai api key') || err.response?.status === 400) {
        get().triggerKeyModal('AI Question Bank Extraction');
      }
      set({
        error: msg,
        isExtracting: false,
      });
    }
  },

  addQuestion: async (questionBankId, questionData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post(`/question-banks/${questionBankId}/questions`, questionData);
      set((state) => ({
        questions: [...state.questions, res.data],
        isLoading: false,
        successMessage: 'Question added successfully!',
      }));
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to add question',
        isLoading: false,
      });
    }
  },

  updateQuestion: async (questionId, updateData) => {
    try {
      const res = await api.put(`/questions/${questionId}`, updateData);
      set((state) => ({
        questions: state.questions.map((q) => (q.id === questionId ? res.data : q)),
        successMessage: 'Question updated!',
      }));
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to update question',
      });
    }
  },

  deleteQuestion: async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      set((state) => ({
        questions: state.questions.filter((q) => q.id !== questionId),
        successMessage: 'Question removed!',
      }));
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to delete question',
      });
    }
  },

  // ----------------------------------------------------
  // Answer Generation & Solutions (Phase 6, 7, 8)
  // ----------------------------------------------------
  generateAnswers: async (questionBankId) => {
    const user = useAuthStore.getState().user;
    if (!user?.has_openai_key) {
      get().triggerKeyModal('RAG Answer Generation & AI Review');
      return;
    }

    set({ isGeneratingAnswers: true, error: null, successMessage: null });
    try {
      const res = await api.post('/answer-sets/generate', {
        question_bank_id: questionBankId,
        user_id: user?.id,
      });
      set({
        currentAnswerSet: res.data,
        isGeneratingAnswers: false,
        activeTab: 'solutions',
        successMessage: `Successfully generated ${res.data.completed_questions} answers with Phase 7 AI Review & citations!`,
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Answer generation failed. Verify Qdrant indexing & OpenAI key.';
      if (msg.toLowerCase().includes('openai api key') || err.response?.status === 400) {
        get().triggerKeyModal('RAG Answer Generation');
      }
      set({
        error: msg,
        isGeneratingAnswers: false,
      });
    }
  },

  retryAnswer: async (answerId) => {
    const user = useAuthStore.getState().user;
    if (!user?.has_openai_key) {
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
        const updatedAnswers = state.currentAnswerSet.answers.map((a) =>
          a.id === answerId ? res.data : a
        );
        return {
          currentAnswerSet: {
            ...state.currentAnswerSet,
            answers: updatedAnswers,
          },
          isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
          successMessage: 'Answer regenerated with AI Reviewer!',
        };
      });
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to retry answer';
      if (msg.toLowerCase().includes('openai api key') || err.response?.status === 400) {
        get().triggerKeyModal('Answer Regeneration');
      }
      set((state) => ({
        isRetryingAnswer: { ...state.isRetryingAnswer, [answerId]: false },
        error: msg,
      }));
    }
  },

  downloadSolvedPdf: (answerSetId) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    window.open(`${baseUrl}/answer-sets/${answerSetId}/pdf`, '_blank');
  },

  // ----------------------------------------------------
  // Community Hub Operations (Phase 10 & 11)
  // ----------------------------------------------------
  fetchCommunityData: async () => {
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
      const res = await api.post(`/community/resources/${resourceId}/share`);
      set((state) => ({
        resources: state.resources.map((r) =>
          r.id === resourceId ? { ...r, visibility: res.data.visibility } : r
        ),
        successMessage: `Resource visibility changed to ${res.data.visibility}`,
      }));
      get().fetchCommunityData();
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to toggle resource sharing.' });
    }
  },

  toggleAnswerSetShare: async (answerSetId) => {
    try {
      const res = await api.post(`/community/answer-sets/${answerSetId}/share`);
      set((state) => {
        const updatedCurrent = state.currentAnswerSet?.id === answerSetId
          ? { ...state.currentAnswerSet, visibility: res.data.visibility }
          : state.currentAnswerSet;
        return {
          currentAnswerSet: updatedCurrent,
          successMessage: `Answer set visibility changed to ${res.data.visibility}`,
        };
      });
      get().fetchCommunityData();
    } catch (err) {
      set({ error: err.response?.data?.detail || 'Failed to toggle answer set sharing.' });
    }
  },
}));
