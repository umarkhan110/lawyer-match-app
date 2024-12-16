import {create} from 'zustand';
import { Lawyer, Availability, OfficeLocation } from '../types';

interface LawverStore {
  lawyer: Lawyer | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (data: Partial<Lawyer>) => Promise<void>;
  updateAvailability: (availability: Availability[]) => Promise<void>;
  addOfficeLocation: (location: OfficeLocation) => Promise<void>;
  removeOfficeLocation: (locationId: string) => Promise<void>;
  updateStartingPrice: (price: number) => Promise<void>;
  updateAdditionalServices: (services: string[]) => Promise<void>;
}

export const useLawyerStore = create<LawverStore>((set) => ({
  lawyer: null,
  isLoading: false,
  error: null,

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer ? { ...state.lawyer, ...data } : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update profile' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAvailability: async (availability) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer ? { ...state.lawyer, availability } : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update availability' });
    } finally {
      set({ isLoading: false });
    }
  },

  addOfficeLocation: async (location) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer
          ? {
              ...state.lawyer,
              officeLocations: [...state.lawyer.officeLocations, location],
            }
          : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to add office location' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeOfficeLocation: async (locationId) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer
          ? {
              ...state.lawyer,
              officeLocations: state.lawyer.officeLocations.filter(
                (loc) => loc.id !== locationId
              ),
            }
          : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to remove office location' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateStartingPrice: async (price) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer ? { ...state.lawyer, startingPrice: price } : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update starting price' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateAdditionalServices: async (services) => {
    set({ isLoading: true });
    try {
      // API call would go here
      set((state) => ({
        lawyer: state.lawyer
          ? { ...state.lawyer, additionalServices: services }
          : null,
        error: null,
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to update additional services' });
    } finally {
      set({ isLoading: false });
    }
  },
}));