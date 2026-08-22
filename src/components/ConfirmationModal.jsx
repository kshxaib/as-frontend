import React from 'react';
import {
  AlertTriangle,
  Sparkles,
  Trash2,
  LogOut,
  RefreshCw,
  HelpCircle,
  X,
  Loader2,
} from 'lucide-react';

export const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary', // 'primary' | 'danger' | 'warning' | 'emerald'
  iconType = 'alert', // 'alert' | 'trash' | 'sparkles' | 'logout' | 'refresh'
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (iconType) {
      case 'trash':
        return <Trash2 className="h-6 w-6 text-rose-400" />;
      case 'sparkles':
        return <Sparkles className="h-6 w-6 text-indigo-400" />;
      case 'logout':
        return <LogOut className="h-6 w-6 text-amber-400" />;
      case 'refresh':
        return <RefreshCw className="h-6 w-6 text-cyan-400" />;
      case 'alert':
      default:
        return <AlertTriangle className="h-6 w-6 text-amber-400" />;
    }
  };

  const getIconBg = () => {
    switch (iconType) {
      case 'trash':
        return 'bg-rose-500/10 border-rose-500/20';
      case 'sparkles':
        return 'bg-indigo-500/10 border-indigo-500/20';
      case 'logout':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'refresh':
        return 'bg-cyan-500/10 border-cyan-500/20';
      default:
        return 'bg-amber-500/10 border-amber-500/20';
    }
  };

  const getConfirmButtonClasses = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-500/25';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/25';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-4 pt-20 sm:pt-28 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-2xl shadow-black/60">
        
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${getIconBg()} shrink-0`}>
            {renderIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {title}
            </h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all disabled:opacity-50 ${getConfirmButtonClasses()}`}
          >
            {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isLoading ? 'Processing...' : confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
