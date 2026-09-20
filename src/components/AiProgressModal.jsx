import React from 'react';
import { LoaderCircle } from 'lucide-react';

const AiProgressModalContent = ({
  type = 'generation',
  title,
  subtitle,
  itemName,
  noticeText,
}) => {
  const defaultTitle =
    type === 'extraction'
      ? 'Extracting questions'
      : type === 'indexing'
      ? 'Indexing study material'
      : 'Generating answers';

  const defaultDescription =
    type === 'extraction'
      ? 'Extracting and structuring examination questions from the document.'
      : type === 'indexing'
      ? 'Processing and indexing document for solution grounding.'
      : 'Synthesizing verified answers grounded in your study materials.';

  const defaultNotice =
    type === 'extraction'
      ? 'Questions will appear here once extraction is complete.'
      : type === 'indexing'
      ? 'This material will be ready for grounding once indexing is complete.'
      : 'Your answers are being generated. This may take a moment.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#19243B]/40 p-4 sm:p-8 backdrop-blur-xs animate-in fade-in duration-150 selection:bg-[#0057FF] selection:text-white">
      <section className="shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] rounded-2xl bg-white border border-[#E2E0D9] w-[480px] max-w-full overflow-hidden text-[#19243B] my-auto">
        <div className="border-b border-[#E2E0D9] pt-6 px-6 sm:px-8 pb-5">
          <h2 className="font-semibold text-lg sm:text-xl tracking-tight text-[#19243B]">
            {title || defaultTitle}
          </h2>
        </div>

        <div className="py-8 px-6 sm:px-8 flex flex-col items-center text-center space-y-4">
          {(itemName || subtitle) && (
            <div className="font-semibold rounded-xl bg-[#F8F7F4] text-xs sm:text-sm text-[#19243B] border border-[#E2E0D9] py-2.5 px-4 max-w-full truncate shadow-2xs">
              {itemName || subtitle}
            </div>
          )}

          <div className="flex flex-col items-center justify-center py-2 space-y-3">
            <div className="size-12 rounded-2xl bg-[#EAF0FF] flex items-center justify-center border border-[#C8D8FF]">
              <LoaderCircle className="animate-spin text-[#0057FF] size-6" />
            </div>
            <p className="font-semibold text-sm sm:text-base text-[#19243B] max-w-sm leading-relaxed">
              {defaultDescription}
            </p>
          </div>

          <p className="text-[#687184] text-xs sm:text-sm leading-relaxed max-w-sm pt-3 border-t border-[#E2E0D9] w-full">
            {noticeText || defaultNotice}
          </p>
        </div>

        <div className="border-t border-[#E2E0D9] flex pt-4 px-6 sm:px-8 pb-4 justify-end bg-[#FCFBF9]">
          <span className="text-xs text-[#687184] font-medium self-center mr-auto">
            Please wait...
          </span>
          <button
            disabled={true}
            className="font-medium opacity-60 rounded-lg bg-[#F1F0EC] text-[#526078] text-xs sm:text-sm border border-[#E2E0D9] px-4 py-1.5 cursor-not-allowed"
          >
            In Progress
          </button>
        </div>
      </section>
    </div>
  );
};

export const AiProgressModal = (props) => {
  if (!props.isOpen) return null;
  return <AiProgressModalContent {...props} />;
};

export default AiProgressModal;
