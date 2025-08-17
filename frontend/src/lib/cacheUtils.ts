/**
 * Utility functions for managing various caches in the application
 * Training progression cache uses SHA-256 hashing for reliable cache keys
 */

const TRAINING_PROGRESSION_CACHE_KEY = 'training_progression_cache';

/**
 * Clear all application caches
 * Useful for development or when user data becomes inconsistent
 */
export function clearAllCaches(): void {
  try {
    // Clear training progression cache
    localStorage.removeItem(TRAINING_PROGRESSION_CACHE_KEY);
    
    // Clear onboarding form data
    localStorage.removeItem('onboarding_form_data');
    
    console.log('All caches cleared successfully');
  } catch (error) {
    console.warn('Failed to clear some caches:', error);
  }
}

/**
 * Get cache information for debugging
 */
export function getCacheInfo(): Record<string, any> {
  const cacheInfo: Record<string, any> = {};
  
  try {
    // Training progression cache info
    const trainingCache = localStorage.getItem(TRAINING_PROGRESSION_CACHE_KEY);
    if (trainingCache) {
      const parsed = JSON.parse(trainingCache);
      cacheInfo.trainingProgression = {
        entries: Object.keys(parsed).length,
        size: new Blob([trainingCache]).size + ' bytes',
      };
    } else {
      cacheInfo.trainingProgression = { entries: 0, size: '0 bytes' };
    }
    
    // Onboarding form cache info
    const formCache = localStorage.getItem('onboarding_form_data');
    if (formCache) {
      cacheInfo.onboardingForm = {
        size: new Blob([formCache]).size + ' bytes',
        hasData: true,
      };
    } else {
      cacheInfo.onboardingForm = { size: '0 bytes', hasData: false };
    }
    
    return cacheInfo;
  } catch (error) {
    console.warn('Failed to get cache info:', error);
    return { error: 'Failed to retrieve cache information' };
  }
}

/**
 * Export cache functions to window object for development debugging
 * Only available in development mode
 */
if (import.meta.env.DEV) {
  (window as any).clearAllCaches = clearAllCaches;
  (window as any).getCacheInfo = getCacheInfo;
  console.log('Cache utilities available: clearAllCaches(), getCacheInfo()');
}
