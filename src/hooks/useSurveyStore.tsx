import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  locationType: string;
}

export interface SurveyData extends UserProfile {
  shoppingFrequency?: string;
  shoppingLocation?: string;
  priorities?: string[];
  hasUsedLocker?: boolean;
  interestedInApp?: string;
  motivation?: string[];
  concerns?: string[];
  usageFrequency?: string;
  desiredProducts?: string[];
  orderPreference?: string;
  willingToPayExtra?: string;
  paymentPreference?: string;
  essentialFeature?: string;
  launchMotivation?: string;
}

interface SurveyStore {
  surveyData: SurveyData;
  currentStep: number;
  progress: number;
  isCompleted: boolean;
  updateSurveyData: (data: Partial<SurveyData>) => void;
  setCurrentStep: (step: number) => void;
  setProgress: (progress: number) => void;
  resetSurvey: () => void;
  markAsCompleted: () => void;
}

const initialSurveyData: SurveyData = {
  firstName: '',
  lastName: '',
  email: '',
  location: '',
  locationType: ''
};

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set) => ({
      surveyData: initialSurveyData,
      currentStep: 0,
      progress: 0,
      isCompleted: false,
      updateSurveyData: (data) =>
        set((state) => ({
          surveyData: { ...state.surveyData, ...data }
        })),
      setCurrentStep: (step) => set({ currentStep: step }),
      setProgress: (progress) => set({ progress }),
      resetSurvey: () =>
        set({
          surveyData: initialSurveyData,
          currentStep: 0,
          progress: 0,
          isCompleted: false
        }),
      markAsCompleted: () => set({ isCompleted: true })
    }),
    {
      name: 'whatsclose-survey-storage'
    }
  )
);