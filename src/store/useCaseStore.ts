import { create } from 'zustand';
import type { Case } from '../types';

interface CaseState {
  cases: Case[];
  isLoading: boolean;
  error: string | null;
  submitCase: (caseData: Partial<Case>) => Promise<void>;
  submitQuote: (caseId: string, quote: number) => Promise<void>;
  acceptQuote: (caseId: string) => Promise<void>;
  rejectQuote: (caseId: string) => Promise<void>;
}

// Mock data for demonstration
const mockCases: Case[] = [
  {
    id: '1',
    clientId: '1',
    caseType: 'IMMIGRATION',
    details: {
      entryDate: '2023-01-01',
      alienNumber: 'A123456789',
      hasCourtDate: 'No',
      language: 'Spanish'
    },
    documents: ['passport.pdf', 'visa.pdf'],
    budget: 5000,
    status: 'PENDING',
    createdAt: new Date('2024-03-01')
  },
  {
    id: '2',
    clientId: '1',
    caseType: 'PERSONAL_INJURY',
    details: {
      accidentDate: '2024-02-15',
      injuryType: 'Auto Accident',
      medicalTreatment: 'Yes'
    },
    documents: ['medical_report.pdf', 'police_report.pdf'],
    budget: 10000,
    status: 'QUOTED',
    createdAt: new Date('2024-02-15')
  }
];

export const useCaseStore = create<CaseState>((set) => ({
  cases: mockCases,
  isLoading: false,
  error: null,
  submitCase: async (caseData) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCase: Case = {
        id: String(Date.now()),
        clientId: '1',
        status: 'PENDING',
        createdAt: new Date(),
        ...caseData
      } as Case;
      
      set(state => ({
        cases: [...state.cases, newCase],
        isLoading: false
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to submit case', isLoading: false });
    }
  },
  submitQuote: async (caseId, quote) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        cases: state.cases.map(c =>
          c.id === caseId ? { ...c, status: 'QUOTED' as const } : c
        ),
        isLoading: false
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to submit quote', isLoading: false });
    }
  },
  acceptQuote: async (caseId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        cases: state.cases.map(c =>
          c.id === caseId ? { ...c, status: 'ACCEPTED' as const } : c
        ),
        isLoading: false
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to accept quote', isLoading: false });
    }
  },
  rejectQuote: async (caseId) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        cases: state.cases.map(c =>
          c.id === caseId ? { ...c, status: 'REJECTED' as const } : c
        ),
        isLoading: false
      }));
    } catch (error) {
      console.log(error)
      set({ error: 'Failed to reject quote', isLoading: false });
    }
  }
}));