import { useState, useEffect, useCallback } from 'react';
import CryptoJS from 'crypto-js';
import type { OnboardingFormData, TrainingProgression } from '@/types';

const CACHE_STORAGE_KEY = 'training_progression_cache';
const CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours

interface CacheEntry {
  formDataHash: string;
  progression: TrainingProgression;
  timestamp: number;
}

interface TrainingProgressionCache {
  [hash: string]: CacheEntry;
}

/**
 * Generates a stable hash from the onboarding form data
 * Only includes fields that affect training progression calculation
 * Uses SHA-256 for reliable, consistent hashing
 */
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

/**
 * Loads the training progression cache from localStorage
 */
function loadCache(): TrainingProgressionCache {
  try {
    const cached = localStorage.getItem(CACHE_STORAGE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.warn('Failed to load training progression cache:', error);
    return {};
  }
}

/**
 * Saves the training progression cache to localStorage
 */
function saveCache(cache: TrainingProgressionCache): void {
  try {
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to save training progression cache:', error);
  }
}

/**
 * Checks if a cache entry is still valid (not expired)
 */
function isCacheEntryValid(entry: CacheEntry): boolean {
  const now = Date.now();
  const expiryTime = entry.timestamp + (CACHE_EXPIRY_HOURS * 60 * 60 * 1000);
  return now < expiryTime;
}

/**
 * Cleans up expired cache entries
 */
function cleanupExpiredEntries(cache: TrainingProgressionCache): TrainingProgressionCache {
  const cleanedCache: TrainingProgressionCache = {};
  
  Object.entries(cache).forEach(([hash, entry]) => {
    if (isCacheEntryValid(entry)) {
      cleanedCache[hash] = entry;
    }
  });
  
  return cleanedCache;
}

export function useTrainingProgressionCache() {
  const [cache, setCache] = useState<TrainingProgressionCache>(() => {
    const loadedCache = loadCache();
    return cleanupExpiredEntries(loadedCache);
  });

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    saveCache(cache);
  }, [cache]);

  /**
   * Gets cached training progression for the given form data
   */
  const getCachedProgression = useCallback((formData: OnboardingFormData): TrainingProgression | null => {
    const hash = generateFormDataHash(formData);
    const entry = cache[hash];
    
    if (entry && isCacheEntryValid(entry)) {
      console.log('Using cached training progression for form data hash:', hash);
      return entry.progression;
    }
    
    return null;
  }, [cache]);

  /**
   * Caches training progression for the given form data
   */
  const cacheProgression = useCallback((formData: OnboardingFormData, progression: TrainingProgression): void => {
    const hash = generateFormDataHash(formData);
    const entry: CacheEntry = {
      formDataHash: hash,
      progression,
      timestamp: Date.now(),
    };
    
    console.log('Caching training progression for form data hash:', hash);
    
    setCache(prevCache => ({
      ...prevCache,
      [hash]: entry,
    }));
  }, []);

  /**
   * Clears all cached training progressions
   */
  const clearCache = useCallback((): void => {
    console.log('Clearing training progression cache');
    setCache({});
    try {
      localStorage.removeItem(CACHE_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to remove training progression cache from localStorage:', error);
    }
  }, []);

  /**
   * Gets cache statistics for debugging
   */
  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache);
    const validEntries = entries.filter(isCacheEntryValid);
    
    return {
      totalEntries: entries.length,
      validEntries: validEntries.length,
      expiredEntries: entries.length - validEntries.length,
    };
  }, [cache]);

  return {
    getCachedProgression,
    cacheProgression,
    clearCache,
    getCacheStats,
  };
}
