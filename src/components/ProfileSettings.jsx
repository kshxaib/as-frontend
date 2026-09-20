import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Key,
  LoaderCircle,
  User,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const ProfileSettings = () => {
  const {
    user,
    isAuthenticated,
    error,
    openAuthModal,
    clearError,
    updateOpenAIKey,
    deleteOpenAIKey,
  } = useAuthStore();

  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF0FF] text-[#0057FF]">
          <User className="h-6 w-6" />
        </div>
        <h2 className="font-semibold text-xl text-[#19243B]">Sign in required</h2>
        <p className="mt-1 text-sm text-[#526078]">
          Please sign in to configure your OpenAI API key.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('login')}
          className="mt-5 inline-flex items-center rounded-xl bg-[#0057FF] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#0047D6] transition-all cursor-pointer shadow-xs"
        >
          Sign in
        </button>
      </div>
    );
  }

  const hasKey = !!user.has_openai_key;

  const handleSaveKey = async (e) => {
    e?.preventDefault();
    const cleanKey = apiKeyInput.trim();
    if (!cleanKey) return;

    clearError();
    setSuccessMessage(null);
    setIsSubmitting(true);

    const res = await updateOpenAIKey(cleanKey);
    setIsSubmitting(false);

    if (res.success) {
      setApiKeyInput('');
      setSuccessMessage('OpenAI API key saved successfully.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const handleDeleteKey = async () => {
    clearError();
    setSuccessMessage(null);
    setIsDeleting(true);

    const res = await deleteOpenAIKey();
    setIsDeleting(false);
    setShowDeleteModal(false);

    if (res.success) {
      setApiKeyInput('');
      setSuccessMessage('OpenAI API key removed.');
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#19243B] pb-24 animate-in fade-in duration-150 font-sans">
      <div className="mx-auto max-w-2xl space-y-6 pt-4">

        <div className="space-y-1">
          <h1 className="font-bold text-2xl tracking-tight text-[#19243B]">
            OpenAI API Key
          </h1>
          <p className="text-[#526078] text-sm leading-relaxed">
            Add your OpenAI API key to enable AI question extraction, answer generation, and exam paper prediction.
          </p>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="font-semibold underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="font-semibold underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-[#E2E0D9] bg-white p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <label htmlFor="openai-api-key-input" className="font-semibold text-sm text-[#19243B]">
              API Key
            </label>
            {hasKey ? (
              <span className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#187347] bg-[#EAF5EF] px-2.5 py-0.5 rounded-full border border-[#A6F4C5]">
                <CheckCircle2 className="size-3" />
                <span>Configured</span>
              </span>
            ) : (
              <span className="text-xs font-medium text-[#687184] bg-[#F1F0EC] px-2.5 py-0.5 rounded-full">
                Not set
              </span>
            )}
          </div>

          <form onSubmit={handleSaveKey} className="space-y-4">
            <div className="rounded-xl border border-[#C6CAD3] bg-white flex px-3.5 items-center h-11 focus-within:border-[#0057FF] transition-all">
              <Key className="size-4 text-[#8A97AA] mr-2.5 shrink-0" />
              <input
                id="openai-api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={hasKey ? '••••••••••••••••••••••••••••••••' : 'sk-proj-••••••••••••••••••••••••'}
                autoComplete="off"
                className="bg-transparent text-sm text-[#19243B] outline-none flex-1 font-mono placeholder-[#8A97AA]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-[#687184] hover:text-[#19243B] p-1.5 transition-colors cursor-pointer"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !apiKeyInput.trim()}
                className="font-semibold rounded-xl bg-[#0057FF] text-white hover:bg-[#0047D6] text-xs sm:text-sm px-5 h-10 transition-colors cursor-pointer shadow-xs disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  <span>Save Key</span>
                )}
              </button>

              {hasKey && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="font-semibold rounded-xl text-[#B42318] hover:bg-red-50 text-xs sm:text-sm border border-red-200 px-4 h-10 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </form>
        </div>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#19243B]/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl border border-[#E2E0D9] bg-white p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="font-bold text-lg text-[#19243B]">
                Remove API key?
              </h3>
              <p className="text-[#526078] text-xs sm:text-sm mt-1.5 leading-relaxed">
                AI generation features will be paused until a new key is added.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E0D9]">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="font-semibold rounded-xl text-xs sm:text-sm border border-[#C6CAD3] bg-white text-[#19243B] hover:bg-[#F8F7F4] px-4 h-9 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteKey}
                disabled={isDeleting}
                className="font-semibold rounded-xl bg-[#B42318] text-white hover:bg-[#91180D] text-xs sm:text-sm px-4 h-9 transition-colors cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle className="size-3.5 animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <span>Remove</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileSettings;