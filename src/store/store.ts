// store/store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define shape of the store
type LockState = {
  lockedColors: { [index: number]: string }; // Object with index (color position) as key and color code as value
  toggleLock: (index: number, color: string) => void; // Function to toggle lock state
  resetLocks: () => void; // Function to reset all locks
};

// Create store
export const useLockStore = create<LockState>()(
  persist(
    // Persist middleware to store state changes in sessionStorage
    (set) => ({
      // set function to update state
      lockedColors: {}, // Initialize lockedColors as empty object
      toggleLock: (
        index,
        color, // Function to toggle lock state
      ) =>
        set((state) => {
          const updatedLocks = { ...state.lockedColors }; // Copy current lockedColors
          if (updatedLocks[index]) {
            // Check if color is already locked
            delete updatedLocks[index]; // If locked, remove lock
          } else {
            updatedLocks[index] = color; // If not locked, add lock
          }
          return { lockedColors: updatedLocks }; // Return updated lockedColors
        }),
      resetLocks: () => set({ lockedColors: {} }), // Function to reset all locks
    }),
    {
      name: "locked-colors-storage", // Name of the storage in sessionStorage
      storage: createJSONStorage(() => sessionStorage), // sessionStorage ensures state persists only per tab session
    },
  ),
);
