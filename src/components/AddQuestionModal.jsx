import React, { useState } from 'react';
import { X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[var(--overlay)] p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-[16px] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 sm:p-7 shadow-[var(--shadow-lg)] my-auto">

        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-[6px] p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Header (No icon) */}
        <div className="pb-4 border-b border-[var(--border-subtle)] pr-6">
          <h3 className="font-display text-lg font-normal text-[var(--text-primary)] tracking-tight">
            Add Examination Question
          </h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">
            Specify the question text and allotted marks for the solution synthesis pipeline.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
              Question Statement *
            </label>
            <textarea
              required
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Explain the ACID properties of transactions with a concrete banking transfer example..."
              className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none leading-relaxed transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                Allotted Marks *
              </label>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">
                Current: <strong className="text-[var(--primary)]">{marks} Marks</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[2, 5, 10, 15].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setMarks(preset)}
                  className={`flex-1 rounded-[6px] py-2 font-mono text-xs font-medium transition-all ${
                    marks === preset
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                      : 'border border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {preset}M
                </button>
              ))}
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] py-2 px-2 text-center font-mono text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                  placeholder="Custom"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-all shadow-sm"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
