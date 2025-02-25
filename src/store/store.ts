// store/store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LockState = {
  lockedColors: { [index: number]: string };
  toggleLock: (index: number, color: string) => void;
  resetLocks: () => void;
};

export const useLockStore = create<LockState>()(
  persist(
    (set) => ({
      lockedColors: {},
      toggleLock: (index, color) =>
        set((state) => {
          const updatedLocks = { ...state.lockedColors };
          if (updatedLocks[index]) {
            delete updatedLocks[index];
          } else {
            updatedLocks[index] = color;
          }
          return { lockedColors: updatedLocks };
        }),
      resetLocks: () => set({ lockedColors: {} }),
    }),
    {
      name: "locked-colors-storage",
      storage: createJSONStorage(() => sessionStorage), // 💡 EASIEST way to use sessionStorage
    },
  ),
);
