import { create } from 'zustand';
import { Client, Lawyer } from '../types';
import { sendClientNotification } from '../services/notifications';
import { persist } from 'zustand/middleware';
import { doc, setDoc } from 'firebase/firestore';
import { db } from "@/firebase/config";

// Mock data for testing
const mockClient: Client = {
  id: '1',
  email: 'client@example.com',
  phoneNumber: '+1234567890',
  budget: 50000,
  downPayment: 5000,
  location: {
    latitude: 40.7128,
    longitude: -74.0060 // New York coordinates
  }
};

const mockNearbyLawyers: Lawyer[] = [
  {
    id: '1',
    email: 'lawyer1@example.com',
    fullName: 'John Smith',
    barNumber: '123456',
    address: '123 Law St, NY',
    phoneNumber: '+1234567890',
    languages: ['English', 'Spanish'],
    startingPrice: 5000,
    additionalServices: ['Document Review', 'Court Representation'],
    officeLocations: [
      {
        id: '1',
        address: '123 Law St, New York, NY',
        latitude: 40.7145,
        longitude: -74.0071
      }
    ],
    availability: [],
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100'
  },
  {
    id: '2',
    email: 'lawyer2@example.com',
    fullName: 'Jane Doe',
    barNumber: '789012',
    address: '456 Legal Ave, NY',
    phoneNumber: '+1987654321',
    languages: ['English', 'Mandarin'],
    startingPrice: 6000,
    additionalServices: ['Immigration Consultation', 'Visa Applications'],
    officeLocations: [
      {
        id: '2',
        address: '456 Legal Ave, New York, NY',
        latitude: 40.7112,
        longitude: -74.0055
      }
    ],
    availability: [],
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100'
  }
];

interface ClientStore {
  client: Client | null;
  nearbyLawyers: Lawyer[];
  matches: { [key: string]: Lawyer };
  isLoading: boolean;
  error: string | null;
  updateBudget: (budget: number) => void;
  updateDownPayment: (downPayment: number) => void;
  updateLocation: (latitude: number, longitude: number) => void;
  matchWithLawyer: (lawyerId: string) => Promise<void>;
  removeMatch: (lawyerId: string) => void;
  updateFirestoreField: (field: keyof Client, value: any, userId: string) => Promise<void>;
}

export const useClientStore = create<ClientStore>()(
  persist((set, get) => ({
    client: null,
    nearbyLawyers: [],
    matches: {},
    isLoading: false,
    error: null,

    updateBudget: (budget) => {
      set((state) => {
        console.log(budget)
        return{
        client: state.client ? { ...state.client, budget } : null
      }});
    },

    updateDownPayment: (downPayment) => {
      set((state) => {
        return{
        client: state.client ? { ...state.client, downPayment } : null
      }});
    },

    updateLocation: (latitude, longitude) => {
      set((state) => ({
        client: state.client
          ? { ...state.client, location: { latitude, longitude } }
          : null
      }));
    },

    matchWithLawyer: async (lawyerId) => {
      const lawyer = get().nearbyLawyers.find((l) => l.id === lawyerId);
      if (!lawyer || !get().client) return;

      set({ isLoading: true });
      try {
        await sendClientNotification(get().client!, lawyer);
        set((state) => ({
          matches: { ...state.matches, [lawyerId]: lawyer }
        }));
      } catch (error) {
        console.log(error)
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
        // set((state) => {
        //   return {
        //   client: { ...state.client, [field]: value },
        //   error: null,
        // }});
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
    }),
  }
  )
  );