import { create } from 'zustand';
import api from '../api/client';

export const useQuestionBankStore = create((set, get) => ({
  questionBanks: [],
  currentQuestionBank: null,
  questions: [],
  currentAnswerSet: null,
  answerSetsList: [],
  activeTab: 'review', // 'review' | 'solutions'
  isLoading: false,
  isExtracting: false,
  isGeneratingAnswers: false,
  error: null,
  successMessage: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  // Fetch all question banks
  fetchQuestionBanks: async (userId = null) => {
    set({ isLoading: true, error: null });
    try {
      const params = userId ? { user_id: userId } : {};
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

  // Select a question bank and load its questions and existing answer sets
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

  // Trigger AI extraction for current question bank
  extractQuestions: async (id) => {
    set({ isExtracting: true, error: null, successMessage: null });
    try {
      const res = await api.post(`/question-banks/${id}/extract`);
      await get().selectQuestionBank(id);
      set({
        isExtracting: false,
        successMessage: `Successfully extracted ${res.data.questions_extracted || 0} questions!`,
      });
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Extraction failed. Make sure OpenAI API key is valid.',
        isExtracting: false,
      });
    }
  },

  // Add a manual question
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

  // Update a question (text and/or marks)
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

  // Delete a single question
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

  // Phase 6: Generate Full Answer Set using RAG
  generateAnswers: async (questionBankId) => {
    set({ isGeneratingAnswers: true, error: null, successMessage: null });
    try {
      const res = await api.post('/answer-sets/generate', {
        question_bank_id: questionBankId,
      });
      set({
        currentAnswerSet: res.data,
        isGeneratingAnswers: false,
        activeTab: 'solutions',
        successMessage: `Successfully generated ${res.data.completed_questions} answers with citations!`,
      });
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Answer generation failed. Verify Qdrant indexing & OpenAI API key.',
        isGeneratingAnswers: false,
      });
    }
  },

  // Phase 6: Retry a single answer
  retryAnswer: async (answerId) => {
    try {
      const res = await api.put ? api.post(`/answers/${answerId}/retry`) : api.post(`/answers/${answerId}/retry`);
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
          successMessage: 'Answer regenerated successfully!',
        };
      });
    } catch (err) {
      set({
        error: err.response?.data?.detail || 'Failed to retry answer',
      });
    }
  },

  // Clear messages
  clearFeedback: () => set({ error: null, successMessage: null }),
}));
