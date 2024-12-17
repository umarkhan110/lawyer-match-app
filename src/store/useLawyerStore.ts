import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Lawyer } from "../types";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

interface LawyerStore {
  lawyer: Partial<Lawyer> | null;
  isLoading: boolean;
  error: string | null;
  updateField: <T extends keyof Lawyer>(field: T, value: Lawyer[T]) => Promise<void>;
  updateFirestoreField: (field: keyof Lawyer, value: any, userId: string) => Promise<void>;
}

export const useLawyerStore = create<LawyerStore>()(
  persist(
    (set) => ({
      lawyer: null,
      isLoading: false,
      error: null,

      updateField: async (field, value) => {
        set({ isLoading: true });
        try {
          console.log("first")
          set((state) => {
            const updatedLawyer = { ...state.lawyer, [field]: value };
            console.log('Updated lawyer:', updatedLawyer);
            return {
              lawyer: updatedLawyer,
              error: null,
            };
          });
            
        } catch (error) {
          console.error(`Failed to update field "${field}":`, error);
          set({ error: `Failed to update ${field}` });
        } finally {
          set({ isLoading: false });
        }
      },

      updateFirestoreField: async (field, value, userId) => {
        set({ isLoading: true });
        try {
          const userDocRef = doc(db, "users", userId);
          await setDoc(userDocRef, { [field]: value }, { merge: true });
          set((state) => ({
            lawyer: state.lawyer ? { ...state.lawyer, [field]: value } : null,
            error: null,
          }));
        } catch (error) {
          console.error(`Failed to update Firestore field "${field}":`, error);
          set({ error: `Failed to update ${field}` });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "lawyer-store",
      partialize: (state) => ({
        lawyer: state.lawyer,
      }),
    }
  )
);
