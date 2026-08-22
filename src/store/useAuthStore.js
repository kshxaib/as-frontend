import { create } from 'zustand';
import api from '../api/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('academicstack_token') || null,
  isAuthenticated: !!localStorage.getItem('academicstack_token'),
  isLoading: false,
  error: null,
  isAuthModalOpen: false,
  authModalMode: 'login', // 'login' | 'register'

  openAuthModal: (mode = 'login') => set({ isAuthModalOpen: true, authModalMode: mode, error: null }),
  closeAuthModal: () => set({ isAuthModalOpen: false, error: null }),
  setAuthModalMode: (mode) => set({ authModalMode: mode, error: null }),

  // Initialize and load current user from token
  initAuth: async () => {
    const token = localStorage.getItem('academicstack_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.warn('Auth token invalid or expired, clearing session.');
      localStorage.removeItem('academicstack_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Register
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
      const msg = err.response?.data?.detail || 'Registration failed. Please try again.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Login
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
      const msg = err.response?.data?.detail || 'Invalid username or password.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('academicstack_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
    });
  },

  // Update OpenAI Key
  updateOpenAIKey: async (openaiKey) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile/openai-key', { openai_api_key: openaiKey });
      set({ user: res.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to update OpenAI key.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  // Delete OpenAI Key
  deleteOpenAIKey: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.delete('/auth/profile/openai-key');
      set({ user: res.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to remove OpenAI key.';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  clearError: () => set({ error: null }),
}));
