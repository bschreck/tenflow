import { describe, it, expect } from 'vitest';
import CryptoJS from 'crypto-js';
import type { OnboardingFormData } from '@/types';

// Extract the hash function for testing (we'd normally import this, but it's internal)
function generateFormDataHash(formData: OnboardingFormData): string {
  const relevantData = {
    selectedGoal: formData.selectedGoal,
    fitnessData: formData.fitnessData,
  };
  
  // Create a stable string representation by sorting keys recursively
  const dataString = JSON.stringify(relevantData, (_key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Sort object keys for consistent ordering
      const sortedObj: any = {};
      Object.keys(value).sort().forEach(k => {
        sortedObj[k] = value[k];
      });
      return sortedObj;
    }
    return value;
  });
  
  // Generate SHA-256 hash
  const hash = CryptoJS.SHA256(dataString).toString(CryptoJS.enc.Hex);
  
  // Return first 16 characters for shorter keys (still very collision-resistant)
  return hash.substring(0, 16);
}

describe('useTrainingProgressionCache hashing', () => {
  const mockFormData1: OnboardingFormData = {
    selectedGoal: {
      id: 'goal-1',
      name: 'Marathon',
      distance: '26.2 miles',
      type: 'goal'
    },
    fitnessData: {
      trailExperience: 'beginner',
      injuryHistory: 'none',
      fitnessLevel: 'recreational',
      weeklyHours: 5,
      trainingDays: 4
    }
  };

  const mockFormData2: OnboardingFormData = {
    selectedGoal: {
      id: 'goal-2',
      name: 'Ultra Marathon',
      distance: '50 miles',
      type: 'goal'
    },
    fitnessData: {
      trailExperience: 'intermediate',
      injuryHistory: 'minor',
      fitnessLevel: 'competitive',
      weeklyHours: 10,
      trainingDays: 6
    }
  };

  it('should generate consistent hashes for the same form data', () => {
    const hash1 = generateFormDataHash(mockFormData1);
    const hash2 = generateFormDataHash(mockFormData1);
    
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(16);
    expect(typeof hash1).toBe('string');
  });

  it('should generate different hashes for different form data', () => {
    const hash1 = generateFormDataHash(mockFormData1);
    const hash2 = generateFormDataHash(mockFormData2);
    
    expect(hash1).not.toBe(hash2);
    expect(hash1).toHaveLength(16);
    expect(hash2).toHaveLength(16);
  });

  it('should generate the same hash regardless of property order', () => {
    // Create the same data but with properties in different order
    const reorderedFormData: OnboardingFormData = {
      fitnessData: mockFormData1.fitnessData,
      selectedGoal: mockFormData1.selectedGoal,
    };
    
    const hash1 = generateFormDataHash(mockFormData1);
    const hash2 = generateFormDataHash(reorderedFormData);
    
    expect(hash1).toBe(hash2);
  });

  it('should generate different hashes when only one field changes', () => {
    const modifiedFormData: OnboardingFormData = {
      ...mockFormData1,
      fitnessData: {
        ...mockFormData1.fitnessData!,
        weeklyHours: 6 // Changed from 5 to 6
      }
    };
    
    const hash1 = generateFormDataHash(mockFormData1);
    const hash2 = generateFormDataHash(modifiedFormData);
    
    expect(hash1).not.toBe(hash2);
  });

  it('should handle partial form data gracefully', () => {
    const partialFormData1: OnboardingFormData = {
      selectedGoal: mockFormData1.selectedGoal
      // fitnessData is undefined
    };
    
    const partialFormData2: OnboardingFormData = {
      fitnessData: mockFormData1.fitnessData
      // selectedGoal is undefined
    };
    
    const hash1 = generateFormDataHash(partialFormData1);
    const hash2 = generateFormDataHash(partialFormData2);
    
    expect(hash1).toHaveLength(16);
    expect(hash2).toHaveLength(16);
    expect(hash1).not.toBe(hash2);
  });
});
