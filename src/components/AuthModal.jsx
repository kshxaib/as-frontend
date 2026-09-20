import React, { useState, useEffect } from 'react';
import { CircleAlert, LoaderCircle, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AcademicLogo } from './ui/AcademicLogo';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    isLoading,
    error,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
    clearError,
  } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setUsername('');
    setPassword('');
    setName('');
    setFieldErrors({});
    clearError();
  }, [isAuthModalOpen, authModalMode, clearError]);

  if (!isAuthModalOpen) return null;

  const validate = () => {
    const errors = {};
    if (authModalMode === 'register' && !name.trim()) {
      errors.name = 'Enter your full name.';
    }
    if (!username.trim()) {
      errors.username = authModalMode === 'register' ? 'Choose a username.' : 'Enter your username.';
    }
    if (!password.trim()) {
      errors.password = authModalMode === 'register' ? 'Enter a password.' : 'Enter your password.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    if (authModalMode === 'login') {
      await login(username.trim(), password);
    } else {
      await register(username.trim(), password, name.trim());
    }
  };

  const switchMode = (mode) => {
    clearError();
    setFieldErrors({});
    setAuthModalMode(mode);
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') setUsername(value);
    if (field === 'password') setPassword(value);
    if (field === 'name') setName(value);

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      clearError();
    }
  };

  const isLogin = authModalMode === 'login';
  const hasAuthError = Boolean(error);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/30 p-4 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
      <div
        className="relative z-10 w-full max-w-[440px] rounded-[18px] bg-white border border-[#E2E0D9] p-7 sm:p-8 shadow-[0px_16px_50px_rgba(25,36,59,0.12)] text-[#19243B] my-auto"
        role="dialog"
        aria-modal="true"
      >
        
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-2 text-[#526078] hover:bg-[#F1F0EC] hover:text-[#19243B] transition-colors"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        <div className="mb-5 shadow-xs inline-block">
          <AcademicLogo size={42} />
        </div>

        {isLogin ? (
          <div>
            <h2 className="font-semibold text-[#19243B] text-[27px] sm:text-[29px] leading-tight tracking-tight">
              Welcome back.
            </h2>
            <p className="text-[#526078] text-sm mt-1.5">
              Your next study session starts here.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="font-semibold text-[#19243B] text-[27px] sm:text-[29px] leading-tight tracking-tight">
              Let's get your study space ready.
            </h1>
            <p className="text-[#526078] text-sm mt-1.5">
              A fresh space for everything you are learning.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6" noValidate>
          
          {!isLogin && (
            <div className="mb-4">
              <label
                htmlFor="auth-fullname"
                className="font-semibold text-[#19243B] text-[13px] block mb-2"
              >
                Full name
              </label>
              <input
                id="auth-fullname"
                type="text"
                placeholder="e.g. Alex Lee"
                value={name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full rounded-lg text-sm border px-3 h-[46px] transition-colors focus:outline-none ${
                  fieldErrors.name
                    ? 'bg-[#FFF0EE] border-[#B42318] focus:border-[#B42318]'
                    : 'bg-white border-[#C6CAD3] focus:border-[#0057FF]'
                }`}
              />
              {fieldErrors.name && (
                <small className="text-[#B42318] text-xs block mt-1.5 font-medium">
                  {fieldErrors.name}
                </small>
              )}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="auth-username"
              className="font-semibold text-[#19243B] text-[13px] block mb-2"
            >
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full rounded-lg text-sm border px-3 h-[46px] transition-colors focus:outline-none ${
                fieldErrors.username || (isLogin && hasAuthError)
                  ? 'bg-[#FFF0EE] border-[#B42318] focus:border-[#B42318]'
                  : 'bg-white border-[#C6CAD3] focus:border-[#0057FF]'
              }`}
            />
            {fieldErrors.username && (
              <small className="text-[#B42318] text-xs block mt-1.5 font-medium">
                {fieldErrors.username}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="auth-password"
              className="font-semibold text-[#19243B] text-[13px] block mb-2"
            >
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full rounded-lg text-sm border px-3 h-[46px] transition-colors focus:outline-none ${
                fieldErrors.password || (isLogin && hasAuthError)
                  ? 'bg-[#FFF0EE] border-[#B42318] focus:border-[#B42318]'
                  : 'bg-white border-[#C6CAD3] focus:border-[#0057FF]'
              }`}
            />
            {fieldErrors.password && (
              <small className="text-[#B42318] text-xs block mt-1.5 font-medium">
                {fieldErrors.password}
              </small>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-[#FFF0EE] text-[#B42318] text-xs leading-5 border border-[#F7D0CA] flex mb-4 p-3 items-start gap-2 animate-in fade-in duration-100">
              <CircleAlert className="mt-0.5 shrink-0 size-4 text-[#B42318]" />
              <span>
                {isLogin
                  ? error.toLowerCase().includes('invalid') || error.toLowerCase().includes('password')
                    ? "That username or password isn't right. Please try again."
                    : error
                  : error}
              </span>
            </div>
          )}

          {isLogin ? (
            <button
              type="submit"
              disabled={isLoading}
              className={`font-semibold rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm mt-2 w-full h-[46px] flex items-center justify-center gap-2 shadow-sm transition-all ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin size-4" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`font-semibold rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm mt-6 w-full h-[46px] flex items-center justify-center gap-2 shadow-sm transition-all ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="animate-spin size-4" />
                  <span>Creating account…</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          )}
        </form>

        {isLogin ? (
          <p className="text-center text-[#526078] text-[13px] mt-6">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="font-semibold text-[#0057FF] hover:underline"
            >
              Create one
            </button>
          </p>
        ) : (
          <p className="text-center text-[#526078] text-[13px] mt-5">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-semibold text-[#0057FF] hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
export default AuthModal;
