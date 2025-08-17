import { createContext, useContext, useState } from "react";
import { OnboardingFormData, OnboardingFormContextType } from "@/types";

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
  const [formData, setFormData] = useState<OnboardingFormData>({});

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const submitForm = async () => {
    try {
      console.log('Submitting onboarding form:', formData);
      
      // TODO: Replace with actual API call
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await response.json();
      console.log('Form submitted successfully:', result);
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
