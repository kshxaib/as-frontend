import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const AddQuestionModal = ({ isOpen, onClose, questionBankId }) => {
  const { addQuestion } = useQuestionBankStore();
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(5);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    addQuestion(questionBankId, {
      question_text: questionText.trim(),
      marks: Number(marks),
    });

    setQuestionText('');
    setMarks(5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[var(--overlay)] p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[20px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] text-[var(--primary)]">
              <PlusCircle className="h-4 w-4 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
              Add Question
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-[8px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="h-4 w-4 stroke-[1.5]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Question Text *
            </label>
            <textarea
              required
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Explain ACID properties with a banking transaction example..."
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Points / Marks *
            </label>
            <div className="flex items-center gap-2">
              {[2, 5, 10].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setMarks(preset)}
                  className={`flex-1 rounded-[6px] py-1.5 font-mono text-xs font-medium transition-all ${
                    marks === preset
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                      : 'border border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {preset} Marks
                </button>
              ))}
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] py-1.5 px-2 text-center font-mono text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                  placeholder="Custom"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-[8px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
