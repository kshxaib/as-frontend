import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePracticeStore = create(
  persist(
    (set) => ({
      // Active recall test mode
      isTestMode: false,
      toggleTestMode: () => set((state) => ({ isTestMode: !state.isTestMode })),
      setTestMode: (val) => set({ isTestMode: val }),

      // Filter for practice mode: 'ALL' | 'NEED_PRACTICE' | 'UNTESTED' | 'MASTERED'
      practiceFilter: 'ALL',
      setPracticeFilter: (filter) => set({ practiceFilter: filter }),

      // Mastery map: { [answerId]: 'mastered' | 'need_practice' }
      masteryMap: {},

      // Set status for a specific answer
      setMastery: (answerId, status) =>
        set((state) => ({
          masteryMap: {
            ...state.masteryMap,
            [answerId]: status,
          },
        })),

      // Reset mastery for a bank
      resetBankMastery: (answerIds = []) =>
        set((state) => {
          const nextMap = { ...state.masteryMap };
          answerIds.forEach((id) => delete nextMap[id]);
          return { masteryMap: nextMap };
        }),

      // Session revealed state (ephemeral session state)
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
