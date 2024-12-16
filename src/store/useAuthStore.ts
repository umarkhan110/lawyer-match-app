import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lawyer } from '@/types';
import { db } from "@/firebase/config";
import { doc, getDoc } from 'firebase/firestore';
import { setCookie } from 'cookies-next';
interface AuthState {
  user: Partial<Lawyer> | null;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  login: (res:any, isAttorney: boolean) => Promise<void>;
  signup: (userData: Partial<Lawyer> & { password: string }) => Promise<void>;
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
      login: async (res:any, isAttorney: boolean) => {
        set({ isLoading: true, error: null });
        try {
          const user: Partial<Lawyer> = {
            id: res.user.uid,
            email: res.email,
            fullName: res.displayName,
            // preferredLanguage: 'en',
          };
          const role = isAttorney ? "lawyer" : "client"
          const userDocRef = doc(db, "users", res.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (isAttorney) {
            if (userDoc.exists() && userDoc.data().subscriptionStatus === "active") {
              set({ user, isAuthenticated: true, isLoading: false, isSubscribed: true });
              setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role, isSubscribed: true }));
            } else {
              set({ user, isAuthenticated: true, isLoading: false });
              setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role }));
            }
          }
          set({ user, isAuthenticated: true, isLoading: false });
          setCookie('auth-storage', JSON.stringify({ isAuthenticated: true, role: role }));
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
