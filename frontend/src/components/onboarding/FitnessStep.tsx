import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboardingForm } from "./OnboardingFormProvider";

interface FitnessStepProps {
  stepper: any; // Type will be inferred from parent component
}

export const FitnessStep = ({ stepper }: FitnessStepProps) => {
  const { formData, updateFormData } = useOnboardingForm();
  
  // Get current fitness data or use defaults
  const fitnessData = formData.fitnessData || {
    trailExperience: '',
    injuryHistory: '',
    fitnessLevel: '',
    weeklyHours: 5,
    trainingDays: 4
  };

  const updateFitnessData = (updates: Partial<typeof fitnessData>) => {
    updateFormData({
      fitnessData: { ...fitnessData, ...updates }
    });
  };

  const injuryHistoryRef = useRef<HTMLDivElement | null>(null);
  const fitnessLevelRef = useRef<HTMLDivElement | null>(null);
  const trainingVolumeRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const handleTrailExperienceChange = (value: string) => {
    updateFitnessData({ trailExperience: value });
    // Auto-scroll to next section on mobile
    setTimeout(() => scrollToSection(injuryHistoryRef), 300);
  };

  const handleInjuryHistoryChange = (value: string) => {
    updateFitnessData({ injuryHistory: value });
    // Auto-scroll to next section on mobile
    setTimeout(() => scrollToSection(fitnessLevelRef), 300);
  };

  const handleFitnessLevelChange = (value: string) => {
    updateFitnessData({ fitnessLevel: value });
    // Auto-scroll to next section on mobile
    setTimeout(() => scrollToSection(trainingVolumeRef), 300);
  };

  const isAllSectionsComplete = () => {
    return fitnessData.trailExperience && 
           fitnessData.injuryHistory && 
           fitnessData.fitnessLevel;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell Us About Your Fitness
        </h2>
        <p className="text-gray-600">
          Help us create the perfect training plan for your current level
        </p>
      </div>

      {/* Trail Running Experience */}
      <Card className="p-6 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Trail Running Experience</h3>
        </div>
        <div className="space-y-3">
          {[
            { value: 'new', label: 'New to trail running' },
            { value: 'some', label: 'Some trail experience (1-2 years)' },
            { value: 'experienced', label: 'Experienced (3+ years)' },
            { value: 'veteran', label: 'Veteran trail runner (5+ years)' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="trailExperience"
                value={option.value}
                checked={fitnessData.trailExperience === option.value}
                onChange={(e) => handleTrailExperienceChange(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Injury History */}
      <Card ref={injuryHistoryRef} className="p-6 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Injury History</h3>
        </div>
        <div className="space-y-3">
          {[
            { value: 'none', label: 'No significant injuries' },
            { value: 'minor', label: 'Minor injuries, fully recovered' },
            { value: 'recurring', label: 'Some recurring issues' },
            { value: 'current', label: 'Currently managing an injury' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="injuryHistory"
                value={option.value}
                checked={fitnessData.injuryHistory === option.value}
                onChange={(e) => handleInjuryHistoryChange(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Current Fitness Level */}
      <Card ref={fitnessLevelRef} className="p-6 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Current Fitness Level</h3>
        </div>
        <div className="space-y-4">
          {[
            { 
              value: 'beginner', 
              title: 'Beginner',
              description: 'New to running or returning after a break'
            },
            { 
              value: 'recreational', 
              title: 'Recreational',
              description: 'Run regularly, completed some races'
            },
            { 
              value: 'competitive', 
              title: 'Competitive',
              description: 'Train seriously, race regularly'
            },
            { 
              value: 'elite', 
              title: 'Elite',
              description: 'Professional or semi-professional level'
            }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="fitnessLevel"
                value={option.value}
                checked={fitnessData.fitnessLevel === option.value}
                onChange={(e) => handleFitnessLevelChange(e.target.value)}
                className="w-5 h-5 text-blue-600 mt-0.5"
              />
              <div>
                <div className="font-medium text-gray-900">{option.title}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Current Training Volume */}
      <Card ref={trainingVolumeRef} className="p-6 border border-gray-200 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Current Training Volume</h3>
        </div>
        
        <div className="space-y-6">
          {/* Weekly Hours Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Weekly Hours: {fitnessData.weeklyHours} hours
            </label>
            <div className="relative">
              <input
                type="range"
                min="2"
                max="20"
                value={fitnessData.weeklyHours}
                onChange={(e) => updateFitnessData({ weeklyHours: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 hours</span>
                <span>20+ hours</span>
              </div>
            </div>
          </div>

          {/* Training Days Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Training Days per Week: {fitnessData.trainingDays} days
            </label>
            <div className="relative">
              <input
                type="range"
                min="2"
                max="7"
                value={fitnessData.trainingDays}
                onChange={(e) => updateFitnessData({ trainingDays: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 days</span>
                <span>7 days</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex space-x-4 pt-4">
        <Button 
          variant="outline" 
          onClick={() => stepper.prev()}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={() => stepper.next()}
          disabled={!isAllSectionsComplete()}
          variant='default'
          className='flex-1'
        >
          Complete assessment
        </Button>
      </div>
    </div>
  );
};
