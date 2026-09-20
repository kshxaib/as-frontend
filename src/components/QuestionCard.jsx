import React, { useState } from 'react';
import { Pencil, Trash2, ChevronUp, Sparkles } from 'lucide-react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

const MARK_PRESETS = [2, 5, 10];

export const QuestionCard = ({ question, index, onDeleteRequest }) => {
  const { updateQuestion } = useQuestionBankStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question.question_text || '');
  const [editMarks, setEditMarks] = useState(question.marks || 5);

  const formattedQNum = question.question_number
    ? `Q${String(question.question_number).padStart(2, '0')}`
    : `Q${String(index + 1).padStart(2, '0')}`;

  const getSourceLabel = (source) => {
    switch (source) {
      case 'explicit':
        return 'Printed marks';
      case 'ai_estimated':
        return 'AI estimate';
      case 'user_modified':
      default:
        return 'Edited by you';
    }
  };

  const handleStartEdit = () => {
    setEditText(question.question_text || '');
    setEditMarks(question.marks || 5);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editText.trim()) return;
    updateQuestion(question.id, {
      question_text: editText.trim(),
      marks: Number(editMarks) || 1,
      marks_source: 'user_modified',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSelectPreset = (preset) => {
    setEditMarks(preset);
  };

  return (
    <div
      className={`rounded-xl bg-white border transition-all duration-300 ease-in-out overflow-hidden ${
        isEditing
          ? 'border-[#0057FF] shadow-sm ring-1 ring-[#0057FF]/30'
          : 'border-[#E2E0D9] hover:border-[#0057FF]/40 hover:shadow-2xs'
      }`}
    >
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isEditing
            ? 'grid-rows-[0fr] opacity-0 pointer-events-none'
            : 'grid-rows-[1fr] opacity-100'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
              <span className="font-semibold text-xs text-[#0057FF] bg-[#0057FF]/10 px-2 py-1 rounded-md shrink-0 mt-0.5 select-none">
                {formattedQNum}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#19243B] leading-snug select-text">
                  {question.question_text}
                </p>
                <div className="text-[#526078] text-[11px] flex items-center gap-2 mt-1 flex-wrap">
                  <span>{getSourceLabel(question.marks_source)}</span>
                  {question.repeat_count > 1 && (
                    <>
                      <span className="text-[#E2E0D9]">•</span>
                      <span className="text-amber-700 font-medium">
                        Repeated {question.repeat_count}x
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#ECEAE4]">
              <span className="font-semibold text-xs text-[#0057FF] bg-[#EAF0FF] px-2.5 py-1 rounded-md">
                {question.marks} marks
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-[#526078] hover:text-[#19243B] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
                  title="Edit question"
                >
                  <Pencil className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onDeleteRequest) {
                      onDeleteRequest(question);
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#526078] hover:text-[#B42318] hover:bg-[#FFF0EE] transition-colors cursor-pointer"
                  title="Delete question"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isEditing
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3.5 sm:p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0057FF] text-xs bg-[#0057FF]/10 px-2 py-0.5 rounded-md select-none">
                  {formattedQNum}
                </span>
                <span className="text-xs font-semibold text-[#19243B]">Edit question</span>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[#526078] hover:text-[#19243B] p-1 cursor-pointer"
                title="Cancel"
              >
                <ChevronUp className="size-4" />
              </button>
            </div>

            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className="resize-none rounded-lg bg-white text-sm border border-[#E2E0D9] outline-none p-2.5 w-full text-[#19243B] focus:border-[#0057FF] transition-colors leading-relaxed"
              placeholder="Enter question text..."
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-[#526078]">Marks:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editMarks}
                  onChange={(e) => setEditMarks(e.target.value)}
                  className="rounded-lg bg-white text-xs font-semibold border border-[#E2E0D9] outline-none px-2.5 h-8 w-16 text-[#19243B] focus:border-[#0057FF] transition-colors"
                />
                <div className="flex items-center gap-1 ml-1">
                  {MARK_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold border transition-all cursor-pointer ${
                        Number(editMarks) === preset
                          ? 'bg-[#0057FF] text-white border-[#0057FF]'
                          : 'bg-[#F8F7F4] text-[#19243B] border-[#E2E0D9] hover:bg-[#F1F0EC]'
                      }`}
                    >
                      {preset}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs font-medium px-3 h-8 rounded-lg text-[#526078] hover:bg-[#F1F0EC] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!editText.trim()}
                  className="text-xs font-semibold px-4 h-8 rounded-lg bg-[#0057FF] hover:bg-[#0047D4] text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
