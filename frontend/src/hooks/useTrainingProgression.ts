import { useState, useEffect, useCallback } from 'react';
import { getTrainingProgression } from '@/lib/api';
import { useTrainingProgressionCache } from './useTrainingProgressionCache';
import type { OnboardingFormData, TrainingProgression } from '@/types';

interface UseTrainingProgressionResult {
  trainingProgression: TrainingProgression | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook that manages training progression data with caching
 * Automatically caches results based on form data and returns cached data when available
 */
export function useTrainingProgression(formData: OnboardingFormData): UseTrainingProgressionResult {
  const [trainingProgression, setTrainingProgression] = useState<TrainingProgression | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getCachedProgression, cacheProgression } = useTrainingProgressionCache();

  const fetchProgression = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First, check if we have cached data for this form configuration
      const cachedProgression = getCachedProgression(formData);
      
      if (cachedProgression) {
        setTrainingProgression(cachedProgression);
        setIsLoading(false);
        return;
      }
      
      // If no cached data, fetch from API
      console.log('No cached data found, fetching training progression from API');
      const progression = await getTrainingProgression(formData);
      
      // Cache the result for future use
      cacheProgression(formData, progression);
      setTrainingProgression(progression);
      
    } catch (err) {
      console.error('Error fetching training progression:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch training progression');
      
      // Use fallback values if API fails
      const fallbackProgression: TrainingProgression = {
        programDuration: 12,
        intensityLevel: 'Moderate',
        currentWeeklyHours: 5,
        peakWeeklyHours: 13,
        trainingDaysPerWeek: 4,
        weeklyIncrease: 1
      };
      
      setTrainingProgression(fallbackProgression);
    } finally {
      setIsLoading(false);
    }
  }, [formData, getCachedProgression, cacheProgression]);

  // Fetch progression when component mounts or form data changes
  useEffect(() => {
    // Only fetch if we have the required form data
    if (formData.selectedGoal && formData.fitnessData) {
      fetchProgression();
    } else {
      setIsLoading(false);
      setTrainingProgression(null);
    }
  }, [fetchProgression, formData.selectedGoal, formData.fitnessData]);

  const refetch = useCallback(async () => {
    await fetchProgression();
  }, [fetchProgression]);

  return {
    trainingProgression,
    isLoading,
    error,
    refetch,
  };
}
