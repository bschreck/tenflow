import { components } from "./generated_types";

// Authentication types
export type LoginRequest =
  components["schemas"]["Body_login_api_v1_auth_login_post"];
export type AuthResponse = components["schemas"]["Token"];

// User types
export type User = components["schemas"]["UserRead"];
export type UserCreate = components["schemas"]["UserCreate"];
export type UserUpdate = components["schemas"]["UserUpdate"];

// Request types for forms/API calls
export type RegisterRequest = components["schemas"]["UserCreate"];

// Training Progression types
export interface TrainingProgression {
  programDuration: number; // weeks
  intensityLevel: string;
  currentWeeklyHours: number;
  peakWeeklyHours: number;
  trainingDaysPerWeek: number;
  weeklyIncrease: number; // hours
}

// Onboarding types
export interface OnboardingFormData {
  selectedGoal?: {
    id: string;
    name: string;
    distance: string;
    type: 'goal' | 'race';
  };
  fitnessData?: {
    trailExperience: string;
    injuryHistory: string;
    fitnessLevel: string;
    weeklyHours: number;
    trainingDays: number;
  };
  // Add more fields as needed for future steps
}

export interface OnboardingFormContextType {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  submitForm: () => Promise<void>;
}

export interface RaceOption {
  id: string;
  name: string;
  distance: string;
  description: string;
  participantCount: number;
  badge?: string;
  location?: string;
  date?: string;
  category: 'goal' | 'race';
  elevationGain?: number;
}
