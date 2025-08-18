import { createContext, useContext } from "react";
import { OnboardingFormContextType } from "@/types";
import { usePersistedOnboardingForm } from "@/hooks/usePersistedOnboardingForm";
import { useTrainingProgressionCache } from "@/hooks/useTrainingProgressionCache";

const OnboardingFormContext = createContext<OnboardingFormContextType | null>(null);

export const useOnboardingForm = () => {
  const context = useContext(OnboardingFormContext);
  if (!context) {
    throw new Error('useOnboardingForm must be used within OnboardingFormProvider');
  }
  return context;
};

interface OnboardingFormProviderProps {
  children: React.ReactNode;
}

export const OnboardingFormProvider = ({ children }: OnboardingFormProviderProps) => {
  const { formData, updateFormData, clearFormData } = usePersistedOnboardingForm();
  const { clearCache } = useTrainingProgressionCache();

  const submitForm = async () => {
    try {
      console.log('Submitting onboarding form:', formData);
      
      // For now, just clear the form data
      // The actual training plan creation happens in TrainingPlanSummary
      // when the user clicks "Start Training" after authentication
      clearFormData();
      clearCache();
      
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    }
  };

  const contextValue: OnboardingFormContextType = {
    formData,
    updateFormData,
    submitForm,
  };

  return (
    <OnboardingFormContext.Provider value={contextValue}>
      {children}
    </OnboardingFormContext.Provider>
  );
};
