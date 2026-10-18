import React from 'react';
import { LoaderCircle } from 'lucide-react';

const AiProgressModalContent = ({
  type = 'generation',
  itemName,
  subtitle,
}) => {
  const getActionText = () => {
    if (type === 'extraction') return 'Extracting questions...';
    if (type === 'indexing') return 'Indexing study material...';
    return 'Generating answers...';
  };

  const name = itemName || subtitle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#19243B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2E0D9] p-6 sm:p-7 text-center shadow-xl flex flex-col items-center">
        <LoaderCircle className="animate-spin text-[#0057FF] size-8 mb-4" />

        {name && (
          <div className="font-semibold rounded-lg bg-[#F8F7F4] text-xs text-[#19243B] border border-[#E2E0D9] py-1 px-3 mb-2.5 max-w-full truncate shadow-2xs">
            {name}
          </div>
        )}

        <p className="font-semibold text-sm sm:text-base text-[#19243B]">
          {getActionText()}
        </p>

        <p className="text-xs text-[#687184] mt-1.5">
          Please wait, this may take a moment.
        </p>
      </div>
    </div>
  );
};

export const AiProgressModal = (props) => {
  if (!props.isOpen) return null;
  return <AiProgressModalContent {...props} />;
};

export default AiProgressModal;
