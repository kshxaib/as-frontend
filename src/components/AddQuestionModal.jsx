import React, { useState } from 'react';
import { useQuestionBankStore } from '../store/useQuestionBankStore';

export const AddQuestionModal = ({ isOpen, onClose, questionBankId, nextNumber = 1 }) => {
  const { addQuestion } = useQuestionBankStore();
  const [questionText, setQuestionText] = useState('');
  const [qNumber, setQNumber] = useState(`Q${String(nextNumber).padStart(2, '0')}`);
  const [marks, setMarks] = useState(5);
  const [touched, setTouched] = useState(false);

  if (!isOpen) return null;

  const marksNum = Number(marks);
  const isMarksInvalid = marks === '' || isNaN(marksNum) || marksNum < 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!questionText.trim() || isMarksInvalid) return;

    const parsedNum = parseInt(qNumber.replace(/\D/g, ''), 10) || nextNumber;

    addQuestion(questionBankId, {
      question_text: questionText.trim(),
      question_number: parsedNum,
      marks: marksNum,
      marks_source: 'user_modified',
    });

    setQuestionText('');
    setMarks(5);
    setTouched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
      <div className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl bg-white border border-[#E2E0D9] w-[520px] max-w-full overflow-hidden text-[#19243B] my-auto">
        
        <div className="border-b border-[#E2E0D9] pt-5 pr-6 pb-5 pl-6">
          <h2 className="font-semibold text-xl tracking-tight text-[#19243B]">
            Add question
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex pt-6 pr-6 pb-6 pl-6 flex-col gap-4">
            <label className="font-medium text-sm flex flex-col gap-2 text-[#19243B]">
              <span>Question</span>
              <textarea
                required
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter the question text"
                className="font-normal resize-none rounded-[10px] bg-white text-sm border border-[#E2E0D9] outline-none pt-2.5 pr-3 pb-2.5 pl-3 min-h-28 text-[#19243B] placeholder-[#687184] focus:border-[#0057FF] transition-colors"
              />
            </label>

            <div className="grid gap-4 grid-cols-2">
              <label className="font-medium text-sm flex flex-col gap-2 text-[#19243B]">
                <span>Question number</span>
                <input
                  type="text"
                  value={qNumber}
                  onChange={(e) => setQNumber(e.target.value)}
                  placeholder="e.g. Q06"
                  className="font-normal rounded-[10px] bg-white text-sm border border-[#E2E0D9] outline-none pr-3 pl-3 h-10 text-[#19243B] focus:border-[#0057FF] transition-colors"
                />
              </label>

              <label className="font-medium text-sm flex flex-col gap-2 text-[#19243B]">
                <span>Marks</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={marks}
                  onChange={(e) => {
                    setMarks(e.target.value);
                    setTouched(true);
                  }}
                  className={`font-normal rounded-[10px] text-sm outline-none pr-3 pl-3 h-10 transition-colors ${
                    isMarksInvalid && touched
                      ? 'bg-[#FFF0EE] text-[#19243B] border border-[#B42318]'
                      : 'bg-white text-[#19243B] border border-[#E2E0D9] focus:border-[#0057FF]'
                  }`}
                />
                {isMarksInvalid && touched && (
                  <span className="font-normal text-[#B42318] text-xs">
                    Marks must be at least 1
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="border-t border-[#E2E0D9] flex pt-4 pr-6 pb-4 pl-6 justify-end items-center gap-3 bg-[#FDFCFA]">
            <button
              type="button"
              onClick={onClose}
              className="font-medium rounded-[10px] bg-white text-[#19243B] text-sm border border-[#E2E0D9] pr-4 pl-4 h-10 hover:bg-[#F1F0EC] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!questionText.trim() || isMarksInvalid}
              className="font-medium rounded-[10px] bg-[#0057FF] hover:bg-[#0047D4] text-white text-sm pr-4 pl-4 h-10 shadow-sm transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Add question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
