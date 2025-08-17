import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { defineStepper } from "@/components/stepper";
import { 
  GoalStep, 
  FitnessStep, 
  ConnectStep 
} from "@/components/onboarding";

const { Stepper, useStepper, steps, utils } = defineStepper(
  {
    id: "goal",
    title: "What's your goal",
    description: "Choose what you're training for",
  },
  {
    id: "fitness", 
    title: "Tell us your fitness",
    description: "Help us personalize your plan",
  },
  {
    id: "connect",
    title: "Connect your data", 
    description: "Sync devices and apps",
  },
);



function OnboardingPageContent() {
  const stepper = useStepper();
  const location = useLocation();
  const navigate = useNavigate();
  const processedStateRef = React.useRef<string | null>(null);
  
  // Check if we need to navigate to a specific step (e.g., when returning from training plan summary)
  React.useEffect(() => {
    const targetStep = location.state?.step;
    const locationKey = location.key || 'default';
    
    // Only process if we haven't processed this specific location state before
    if (targetStep && targetStep !== stepper.current.id && processedStateRef.current !== locationKey) {
      stepper.goTo(targetStep);
      processedStateRef.current = locationKey;
      
      // Clear the location state by replacing the current history entry
      setTimeout(() => {
        navigate('/onboarding', { replace: true });
      }, 100);
    }
  }, [location.state, location.key, stepper, navigate]);

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <nav aria-label="Onboarding Steps" className="group my-4 px-4">
        {/* Desktop: Full stepper */}
        <ol
          className="hidden sm:flex items-center justify-center gap-3 md:gap-4 lg:gap-6"
          aria-orientation="horizontal"
        >
          {stepper.all.map((step, index, array) => (
            <React.Fragment key={step.id}>
              <li className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? 'default' : 'secondary'}
                  aria-current={
                    stepper.current.id === step.id ? 'step' : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full shrink-0"
                  onClick={() => stepper.goTo(step.id)}
                >
                  {index + 1}
                </Button>
                <span className="text-xs text-gray-600 font-medium whitespace-nowrap">{step.title}</span>
              </li>
              {index < array.length - 1 && (
                <Separator
                  className={`w-4 h-[1px] ${
                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </ol>

        {/* Mobile: Current step with navigation */}
        <div className="flex sm:hidden items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const prevStep = utils.getPrev(stepper.current.id);
              if (prevStep) stepper.goTo(prevStep.id);
            }}
            disabled={currentIndex === 0}
            className="flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="default"
                className="flex size-10 items-center justify-center rounded-full"
              >
                {currentIndex + 1}
              </Button>
            </div>
            <span className="text-xs text-gray-600 font-medium text-center">{stepper.current.title}</span>
            <span className="text-xs text-gray-400">Step {currentIndex + 1} of {steps.length}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const nextStep = utils.getNext(stepper.current.id);
              if (nextStep) stepper.goTo(nextStep.id);
            }}
            disabled={currentIndex === steps.length - 1}
            className="flex items-center gap-1"
          >
            Next
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {stepper.switch({
            goal: () => <GoalStep stepper={stepper} />,
            fitness: () => <FitnessStep stepper={stepper} />,
            connect: () => <ConnectStep stepper={stepper} />,
          })}
        </div>
      </div>

      <BottomNavigation 
        currentStep={currentIndex + 1}
        totalSteps={steps.length}
        completedSteps={currentIndex + 1}
        showProgress={true}
      />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Stepper.Provider>
      <OnboardingPageContent />
    </Stepper.Provider>
  );
}