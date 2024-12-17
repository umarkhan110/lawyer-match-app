import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Client, Lawyer } from '@/types';
import { db } from "@/firebase/config";
import { doc, getDoc } from 'firebase/firestore';
import { setCookie } from 'cookies-next';
import { useClientStore } from './useClientStore';
import { useLawyerStore } from './useLawyerStore';
interface AuthState {
  user: Partial<Lawyer> | Partial<Client> | null;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  login: (res: any, isAttorney: boolean) => Promise<void>;
  signup: (userData: Partial<Lawyer> | Partial<Client> & { password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isSubscribed: false,
      role: null,
      isLoading: false,
      error: null,
      login: async (res: any, isAttorney: boolean) => {
        set({ isLoading: true, error: null });
        try {

          const role = isAttorney ? "lawyer" : "client"
          const userDocRef = doc(db, "users", res.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (isAttorney) {
            if (userDoc.exists()) {
              const user: Partial<Lawyer> = {
                id: res.user.uid,
                email: res.user.email,
                fullName: res.user.displayName,
                officeLocations: userDoc.data().officeLocations,
                startingPrice: userDoc.data().startingPrice,
                languages: userDoc.data().languages
                // preferredLanguage: 'en',
              };
              const updateLawyerStore = useLawyerStore.getState();
              updateLawyerStore.updateField('email', user.email || '');
              updateLawyerStore.updateField('fullName', user.fullName || '');
              updateLawyerStore.updateField('officeLocations', user.officeLocations || []);
              updateLawyerStore.updateField('startingPrice', user.startingPrice || 0);
              updateLawyerStore.updateField('languages', user.languages || []);
              if (userDoc.data().subscriptionStatus === "active") {
                set({ user, isAuthenticated: true, isLoading: false, isSubscribed: true });
                setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role, isSubscribed: true }));
              } else {
                set({ user, isAuthenticated: true, isLoading: false });
                setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role }));
              }
            }
          } else {
            if (userDoc.exists()) {
              const user: Partial<Client> = {
                id: res.user.uid,
                email: res.user.email,
                budget: userDoc.data().budget,
                downPayment: userDoc.data().downPayment,
                location: {
                  latitude: userDoc.data().latitude,
                  longitude: userDoc.data().longitude
                }
              };
              const updateClientStore = useClientStore.getState();
              updateClientStore.updateLocation(userDoc.data().latitude, userDoc.data().longitude);
              updateClientStore.updateBudget(user.budget || 0);
              updateClientStore.updateDownPayment(user.downPayment || 0);
              set({ user, isAuthenticated: true, isLoading: false });
              setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role }));
            }
          }
        } catch (error) {
          console.log(error)
          set({ error: 'Invalid credentials', isLoading: false });
        }
      },
      signup: async (userData) => {
        console.log(userData)
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          // const user: User = {
          //   id: '1',
          //   email: userData.email!,
          //   fullName: userData.fullName!,
          //   preferredLanguage: userData.preferredLanguage || 'en',
          //   role: userData.role || 'client'
          // };
          // set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.log(error)
          set({ error: 'Registration failed', isLoading: false });
        }
      },
      logout: () => set({ user: null, isAuthenticated: false, error: null })
    }),
    {
      name: "auth-storage",
      partialize: (state) =>
      ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isSubscribed: state.isSubscribed,
        role: state.role
      }),
    }
  )
);
