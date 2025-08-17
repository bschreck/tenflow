import { useState, useEffect } from 'react';
import type { OnboardingFormData } from '@/types';

const STORAGE_KEY = 'onboarding_form_data';

export function usePersistedOnboardingForm() {
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    // Initialize from localStorage if available
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to persist onboarding form data:', error);
    }
  }, [formData]);

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const clearFormData = () => {
    setFormData({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear onboarding form data:', error);
    }
  };

  return {
    formData,
    updateFormData,
    clearFormData,
  };
}
