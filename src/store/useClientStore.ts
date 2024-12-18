import { create } from 'zustand';
import { Client, Lawyer, OfficeLocation, Availability } from '../types';
import { sendClientNotification } from '../services/notifications';
import { persist } from 'zustand/middleware';
import { doc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';
import { db } from "@/firebase/config";

interface ClientStore {
  client: Client | null;
  nearbyLawyers: Lawyer[];
  matches: { [key: string]: Lawyer };
  isLoading: boolean;
  error: string | null;
  matchWithLawyer: (lawyerId: string) => Promise<void>;
  removeMatch: (lawyerId: string) => void;
  updateField: <T extends keyof Client>(field: T, value: Client[T]) => Promise<void>;
  updateFirestoreField: (field: keyof Client, value: any, userId: string) => Promise<void>;
  fetchNearbyLawyers: () => Promise<void>;  // New method to fetch nearby lawyers
}

export const useClientStore = create<ClientStore>()(
  persist((set, get) => ({
    client: null,
    nearbyLawyers: [],
    matches: {},
    isLoading: false,
    error: null,

    // New method to fetch lawyers
    fetchNearbyLawyers: async () => {
      set({ isLoading: true });
      try {
        const q = query(collection(db, "users"), where("isAttorney", "==", true));
        const querySnapshot = await getDocs(q);
        const lawyers: Lawyer[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const officeLocations: OfficeLocation[] = data.officeLocations || [];
          const availability: Availability[] = data.availability || [];

          lawyers.push({
            id: doc.id,
            email: data.email,
            fullName: data.fullName,
            barNumber: data.barNumber,
            address: data.address,
            phoneNumber: data.phoneNumber,
            languages: data.languages || [],
            startingPrice: data.startingPrice || 0,
            additionalServices: data.additionalServices || [],
            officeLocations,
            availability,
            profileImage: data.profileImage || '',
          });
        });
        // console.log(lawyers)

        set({ nearbyLawyers: lawyers });
      } catch (error) {
        console.error("Error fetching nearby lawyers:", error);
        set({ error: 'Failed to fetch nearby lawyers' });
      } finally {
        set({ isLoading: false });
      }
    },

    updateField: async (field, value) => {
      set({ isLoading: true });
      try {
        // console.log("first");
        set((state) => {
          const updatedClient = { ...state.client, [field]: value };
          // console.log('Updated client:', updatedClient);
          return {
            client: updatedClient,
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

    matchWithLawyer: async (lawyerId) => {
      const lawyer = get().nearbyLawyers.find((l) => l.id === lawyerId);
      if (!lawyer || !get().client) return;

      set({ isLoading: true });
      try {
        console.log(lawyer)
        // await sendClientNotification(get().client!, lawyer);
        set((state) => ({
          matches: { ...state.matches, [lawyerId]: lawyer }
        }));
      } catch (error) {
        console.log(error);
        set({ error: 'Failed to match with lawyer' });
      } finally {
        set({ isLoading: false });
      }
    },

    removeMatch: (lawyerId) => {
      set((state) => {
        const { [lawyerId]: removed, ...remainingMatches } = state.matches;
        return { matches: remainingMatches };
      });
    },

    updateFirestoreField: async (field, value, userId) => {
      set({ isLoading: true });
      try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { [field]: value }, { merge: true });
      } catch (error) {
        console.error(`Failed to update Firestore field "${field}":`, error);
        set({ error: `Failed to update ${field}` });
      } finally {
        set({ isLoading: false });
      }
    },
  }),
  {
    name: "client-store",
    partialize: (state) => ({
      client: state.client,
      nearbyLawyers: state.nearbyLawyers,
      matches: state.matches
    }),
  }
));
