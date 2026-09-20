import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePracticeStore = create(
  persist(
    (set) => ({
      
      isTestMode: false,
      toggleTestMode: () => set((state) => ({ isTestMode: !state.isTestMode })),
      setTestMode: (val) => set({ isTestMode: val }),

      practiceFilter: 'ALL',
      setPracticeFilter: (filter) => set({ practiceFilter: filter }),

      masteryMap: {},

      setMastery: (answerId, status) =>
        set((state) => ({
          masteryMap: {
            ...state.masteryMap,
            [answerId]: status,
          },
        })),

      resetBankMastery: (answerIds = []) =>
        set((state) => {
          const nextMap = { ...state.masteryMap };
          answerIds.forEach((id) => delete nextMap[id]);
          return { masteryMap: nextMap };
        }),

      revealedMap: {},
      revealAnswer: (answerId) =>
        set((state) => ({
          revealedMap: { ...state.revealedMap, [answerId]: true },
        })),
      hideAnswer: (answerId) =>
        set((state) => ({
          revealedMap: { ...state.revealedMap, [answerId]: false },
        })),
      revealAll: (answerIds = []) =>
        set((state) => {
          const newRevealed = { ...state.revealedMap };
          answerIds.forEach((id) => {
            newRevealed[id] = true;
          });
          return { revealedMap: newRevealed };
        }),
      hideAll: (answerIds = []) =>
        set((state) => {
          const newRevealed = { ...state.revealedMap };
          answerIds.forEach((id) => {
            newRevealed[id] = false;
          });
          return { revealedMap: newRevealed };
        }),
    }),
    {
      name: 'academicstack_practice_store',
      partialize: (state) => ({
        isTestMode: state.isTestMode,
        masteryMap: state.masteryMap,
      }),
    }
  )
);
