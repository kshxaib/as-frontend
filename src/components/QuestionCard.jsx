import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Sparkles, FileText, UserCheck } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

const MARK_PRESETS = [2, 5, 10];

export const QuestionCard = ({ question, index }) => {
  const { updateQuestion, deleteQuestion } = useQuestionBankStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question.question_text);
  const [editMarks, setEditMarks] = useState(question.marks);

  const handleSave = () => {
    if (!editText.trim()) return;
    updateQuestion(question.id, {
      question_text: editText.trim(),
      marks: Number(editMarks),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(question.question_text);
    setEditMarks(question.marks);
    setIsEditing(false);
  };

  const handleQuickMark = (marks) => {
    updateQuestion(question.id, { marks });
    setEditMarks(marks);
  };

  // Badge configuration based on marks_source
  const getSourceBadge = (source) => {
    switch (source) {
      case 'explicit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <FileText className="h-3 w-3" />
            Explicit (Paper)
          </span>
        );
      case 'ai_estimated':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
            <Sparkles className="h-3 w-3" />
            AI Estimated
          </span>
        );
      case 'user_modified':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20">
            <UserCheck className="h-3 w-3" />
            User Verified
          </span>
        );
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all duration-200 hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            Q{question.question_number || index + 1}
          </span>
          {getSourceBadge(question.marks_source)}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                title="Save Changes"
              >
                <Check className="h-3.5 w-3.5" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                title="Cancel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title="Edit Question"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => deleteQuestion(question.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                title="Delete Question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card Body - Question Text */}
      <div className="py-4">
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Enter question text..."
            />
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-slate-400">Custom Marks:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={editMarks}
                onChange={(e) => setEditMarks(e.target.value)}
                className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-slate-200 font-normal select-text">
            {question.question_text}
          </p>
        )}
      </div>

      {/* Card Footer - Quick Marks Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-400 mr-1">Quick Marks:</span>
          {MARK_PRESETS.map((preset) => {
            const isSelected = Number(question.marks) === preset;
            return (
              <button
                key={preset}
                onClick={() => handleQuickMark(preset)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 ring-1 ring-indigo-400'
                    : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {preset}M
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-slate-950/60 px-3 py-1 border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Assigned:</span>
          <span className="font-bold text-indigo-300">{question.marks} Marks</span>
        </div>
      </div>
    </div>
  );
};
