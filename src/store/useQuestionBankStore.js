import { create } from 'zustand';
import api from '../api/client';

export const useQuestionBankStore = create((set, get) => ({
  questionBanks: [],
  currentQuestionBank: null,
  questions: [],
  isLoading: false,
  isExtracting: false,
  error: null,
  successMessage: null,

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

  // Select a question bank and load its questions
  selectQuestionBank: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const [bankRes, questionsRes] = await Promise.all([
        api.get(`/question-banks/${id}`),
        api.get(`/question-banks/${id}/questions`),
      ]);
      set({
        currentQuestionBank: bankRes.data,
        questions: questionsRes.data.questions || [],
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
        error: err.response?.data?.detail || 'Extraction failed. Make sure Gemini API key is valid.',
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

  // Clear messages
  clearFeedback: () => set({ error: null, successMessage: null }),
}));
