import { create } from 'zustand';
import api, { getErrorMessage } from '../api/client';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('academicstack_token') || null,
  isAuthenticated: !!localStorage.getItem('academicstack_token'),
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  authModalMode: 'login', 

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
  setAuthModalMode: (mode) => set({ authModalMode: mode, error: null }),

  initAuth: async () => {
    const token = localStorage.getItem('academicstack_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch {
      console.warn('Auth token invalid or expired, clearing session.');
      localStorage.removeItem('academicstack_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (username, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { username, password, name });
      const { access_token, user } = res.data;
      localStorage.setItem('academicstack_token', access_token);
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Registration failed. Please try again.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { username, password });
      const { access_token, user } = res.data;
      localStorage.setItem('academicstack_token', access_token);
      set({
        token: access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Invalid username or password.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('academicstack_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
    });
  },

  updateOpenAIKey: async (openaiKey) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile/openai-key', { openai_api_key: openaiKey });
      set({ user: res.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to update OpenAI key.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  deleteOpenAIKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.delete('/auth/profile/openai-key');
      set({ user: res.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to remove OpenAI key.');
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  clearError: () => set({ error: null }),
}));