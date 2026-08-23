import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Sparkles, FileText, UserCheck } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';
import { ConfirmationModal } from './ConfirmationModal';
import { StatusBadge } from './ui/StatusBadge';

const MARK_PRESETS = [2, 5, 10];

export const QuestionCard = ({ question, index }) => {
  const { updateQuestion, deleteQuestion } = useQuestionBankStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
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

  const getSourceBadge = (source) => {
    switch (source) {
      case 'explicit':
        return <StatusBadge variant="success" icon={FileText}>Explicit (Paper)</StatusBadge>;
      case 'ai_estimated':
        return <StatusBadge variant="amber" icon={Sparkles}>AI Estimated</StatusBadge>;
      case 'user_modified':
      default:
        return <StatusBadge variant="neutral" icon={UserCheck}>User Verified</StatusBadge>;
    }
  };

  const formattedQNum = String(question.question_number || index + 1).padStart(2, '0');

  return (
    <>
      <div className="group rounded-[12px] border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--border-strong)] transition-all">
        
        {/* Manuscript Entry Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold text-[var(--primary)] bg-[var(--surface-well)] px-2 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
              Q{formattedQNum}
            </span>
            {getSourceBadge(question.marks_source)}
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 rounded-[6px] bg-[var(--primary)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
                  title="Save Changes"
                >
                  <Check className="h-3.5 w-3.5 stroke-[2]" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2 py-1 font-mono text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  title="Cancel"
                >
                  <X className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-[var(--surface-well)] hover:text-[var(--text-primary)] transition-colors"
                  title="Edit Question"
                >
                  <Edit3 className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="rounded-[6px] p-1 text-[var(--text-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--error)] transition-colors"
                  title="Delete Question"
                >
                  <Trash2 className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Body - Question Text */}
        <div className="py-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                className="w-full rounded-[8px] border border-[var(--border)] bg-[var(--surface-well)] p-3 text-xs sm:text-sm text-[var(--text-primary)] placeholder-[var(--text-disabled)] focus:border-[var(--primary)] focus:outline-none"
                placeholder="Enter question text..."
              />
              <div className="flex items-center gap-3">
                <label className="font-mono text-xs text-[var(--text-muted)]">Custom Marks:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editMarks}
                  onChange={(e) => setEditMarks(e.target.value)}
                  className="w-20 rounded-[6px] border border-[var(--border)] bg-[var(--surface-well)] px-2.5 py-1 font-mono text-xs text-[var(--text-primary)] focus:border-[var(--primary)] focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <p className="font-display text-base text-[var(--text-primary)] font-normal leading-relaxed select-text">
              {question.question_text}
            </p>
          )}
        </div>

        {/* Footer - Quick Marks & Assigned Allocation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] text-[var(--text-muted)] mr-1">Points:</span>
            {MARK_PRESETS.map((preset) => {
              const isSelected = Number(question.marks) === preset;
              return (
                <button
                  key={preset}
                  onClick={() => handleQuickMark(preset)}
                  className={`rounded-[4px] px-2 py-0.5 font-mono text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs'
                      : 'border border-[var(--border)] bg-[var(--surface-well)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {preset}M
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--text-muted)] bg-[var(--surface-well)] px-2.5 py-0.5 rounded-[4px] border border-[var(--border-subtle)]">
            <span>Allocation:</span>
            <span className="font-semibold text-[var(--text-primary)]">{question.marks} Marks</span>
          </div>
        </div>
      </div>

      {/* Delete Question Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title={`Delete Question ${formattedQNum}?`}
        message={`Are you sure you want to delete this question (${question.marks} marks)? It will be permanently removed from this examination bank.`}
        confirmText="Yes, Delete Question"
        cancelText="Cancel"
        confirmVariant="danger"
        iconType="trash"
        onConfirm={() => {
          setIsDeleteConfirmOpen(false);
          deleteQuestion(question.id);
        }}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </>
  );
};
