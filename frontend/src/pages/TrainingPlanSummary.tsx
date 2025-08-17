import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useOnboardingForm } from '@/components/onboarding/OnboardingFormProvider';
import { useTrainingProgression } from '@/hooks/useTrainingProgression';
import { submitOnboardingData } from '@/lib/api';

export default function TrainingPlanSummary() {
  const navigate = useNavigate();
  const { formData } = useOnboardingForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the cached training progression hook
  const { trainingProgression, isLoading, error } = useTrainingProgression(formData);

  const handleStartTraining = async () => {
    try {
      setIsSubmitting(true);
      // Submit the onboarding data
      await submitOnboardingData(formData);
      
      // Redirect to daily readiness check
      navigate('/daily-readiness-check');
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      // For now, still redirect to the placeholder page
      navigate('/daily-readiness-check');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Go back to the last step of onboarding (connect step)
    navigate('/onboarding', { state: { step: 'connect' } });
  };

  // Get goal data or fallback
  const goalData = formData.selectedGoal;

  // Show loading state while fetching progression data
  if (isLoading || !trainingProgression) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-600">Creating your personalized training plan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there was a problem fetching data
  if (error && !trainingProgression) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Generate Plan</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your Training Plan is Ready!
          </h1>
          <p className="text-gray-600">
            Here's what we've created for you based on your goals and fitness level
          </p>
        </div>

        {/* Training Plan Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 text-center">
            Your Personalized Training Plan
          </h2>
          <p className="text-gray-600 text-center">
            Based on your assessment, we've created a custom plan to help you achieve your goals
          </p>

          {/* Goal Card */}
          <Card className="p-6 border border-gray-300 rounded-xl bg-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    Your Goal: {goalData?.name || 'Trail Running Goal'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {trainingProgression.programDuration}
                </div>
                <div className="text-sm text-gray-600">Week Program</div>
              </div>
              <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {trainingProgression.intensityLevel}
              </div>
            </div>
          </Card>

          {/* Training Progression Card */}
          <Card className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Training Progression</h3>
            </div>

            <div className="space-y-4">
              {/* Current Weekly Hours */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Current Weekly Hours</span>
                <span className="font-semibold text-gray-900">{trainingProgression.currentWeeklyHours} hours</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-900 h-2 rounded-full" 
                    style={{ width: `${(trainingProgression.currentWeeklyHours / trainingProgression.peakWeeklyHours) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Peak Weekly Hours</span>
                <span className="font-semibold text-gray-900">{trainingProgression.peakWeeklyHours} hours</span>
              </div>

              {/* Training Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-gray-700 text-sm">Training Days</div>
                  <div className="font-semibold text-gray-900">{trainingProgression.trainingDaysPerWeek} days/week</div>
                </div>
                <div>
                  <div className="text-gray-700 text-sm">Weekly Increase</div>
                  <div className="font-semibold text-gray-900">{trainingProgression.weeklyIncrease} hours</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Features Card */}
          <Card className="p-6 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Features You'll Get</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-700">AI-adapted weekly training plans</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-gray-700">Real-time readiness assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-gray-700">Terrain-specific training recommendations</span>
              </div>
            </div>
          </Card>

          {/* Next Steps Card */}
          <Card className="p-6 border border-gray-200 rounded-xl bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-2">Next: Complete Your Daily Readiness Check</h3>
            <p className="text-gray-600 text-sm">
              We'll assess how you're feeling today to customize your first workout
            </p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          <Button 
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>

          <Button 
            onClick={handleStartTraining}
            disabled={isSubmitting}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                Start Training
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
