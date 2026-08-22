import React, { useState } from 'react';
import { X, PlusCircle, HelpCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 backdrop-blur-sm p-4 pt-16 sm:pt-24 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-7 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add Manual Question</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Question Text *
            </label>
            <textarea
              required
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g., Explain ACID properties with real-world banking example..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Marks *
            </label>
            <div className="flex items-center gap-3">
              {[2, 5, 10].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setMarks(preset)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${marks === preset
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                >
                  {preset} Marks
                </button>
              ))}
              <div className="relative w-28">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-center text-xs font-semibold text-white focus:border-indigo-500 focus:outline-none"
                  placeholder="Custom"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
