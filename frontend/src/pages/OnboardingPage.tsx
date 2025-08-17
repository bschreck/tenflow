import {
  ArrowLeft,
  Users,
  Calendar,
  Target,
  Check,
} from "lucide-react";
import { useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { defineStepper } from "@/components/stepper";

// Form data interface
interface OnboardingFormData {
  selectedGoal?: {
    id: string;
    name: string;
    distance: string;
    type: 'goal' | 'race';
  };
  fitnessLevel?: string;
  experience?: string;
  // Add more fields as needed for future steps
}

// Form context
interface OnboardingFormContextType {
  formData: OnboardingFormData;
  updateFormData: (data: Partial<OnboardingFormData>) => void;
  submitForm: () => Promise<void>;
}

const OnboardingFormContext = createContext<OnboardingFormContextType | null>(null);

const useOnboardingForm = () => {
  const context = useContext(OnboardingFormContext);
  if (!context) {
    throw new Error('useOnboardingForm must be used within OnboardingFormProvider');
  }
  return context;
};

interface RaceOption {
  id: string;
  name: string;
  distance: string;
  description: string;
  participantCount: number;
  duration: string;
  badge?: string;
  category: 'goal' | 'race';
}

// Goal-focused training options (all distance-based goals)
const goalOptions: RaceOption[] = [
  {
    id: "5k",
    name: "5K Trail Race",
    distance: "5K",
    description: "Perfect for beginners or speed work",
    participantCount: 12500,
    duration: "8-12 weeks",
    category: 'goal',
  },
  {
    id: "10k",
    name: "10K Trail Race",
    distance: "10K",
    description: "Great introduction to trail racing",
    participantCount: 28000,
    duration: "12-16 weeks",
    badge: "Popular",
    category: 'goal',
  },
  {
    id: "21k",
    name: "Half Marathon",
    distance: "21K",
    description: "Classic distance for most runners",
    participantCount: 18500,
    duration: "16-20 weeks",
    badge: "Popular",
    category: 'goal',
  },
  {
    id: "marathon",
    name: "Marathon",
    distance: "42K",
    description: "The ultimate endurance challenge",
    participantCount: 18000,
    duration: "20-24 weeks",
    category: 'goal',
  },
  {
    id: "50k",
    name: "50K Ultra",
    distance: "50K",
    description: "Entry into ultra-distance running",
    participantCount: 8500,
    duration: "24-28 weeks",
    category: 'goal',
  },
  {
    id: "100k",
    name: "100K Ultra",
    distance: "100K",
    description: "Serious ultra-distance commitment",
    participantCount: 3200,
    duration: "32-36 weeks",
    category: 'goal',
  },
  {
    id: "100m",
    name: "100 Mile Ultra",
    distance: "100M",
    description: "The holy grail of trail running",
    participantCount: 2100,
    duration: "36-40 weeks",
    badge: "Popular",
    category: 'goal',
  },
  {
    id: "200m",
    name: "200+ Mile Ultra",
    distance: "200M+",
    description: "Elite ultra-endurance events",
    participantCount: 450,
    duration: "40+ weeks",
    category: 'goal',
  },
];

// Specific races on calendar (actual events with dates/locations)
const calendarRaces: RaceOption[] = [
  {
    id: "utmb",
    name: "Ultra-Trail du Mont-Blanc",
    distance: "171K",
    description: "Chamonix, France • August 2024 • +10,040m",
    participantCount: 2300,
    duration: "Elite",
    badge: "Elite",
    category: 'race',
  },
  {
    id: "western-states",
    name: "Western States 100",
    distance: "100M",
    description: "California, USA • June 2024 • +5,677m",
    participantCount: 400,
    duration: "Elite",
    badge: "Elite",
    category: 'race',
  },
  {
    id: "hardrock",
    name: "Hardrock 100",
    distance: "100M",
    description: "Colorado, USA • July 2024 • +10,180m",
    participantCount: 140,
    duration: "Elite",
    badge: "Elite",
    category: 'race',
  },
  {
    id: "badwater",
    name: "Badwater 135",
    distance: "135M",
    description: "Death Valley, USA • July 2024 • +4,023m",
    participantCount: 100,
    duration: "Elite",
    badge: "Elite",
    category: 'race',
  },
  {
    id: "tor-des-geants",
    name: "Tor des Géants",
    distance: "330K",
    description: "Valle d'Aosta, Italy • September 2024 • +24,000m",
    participantCount: 800,
    duration: "Elite",
    badge: "Elite",
    category: 'race',
  },
];

const { useStepper, utils, steps } = defineStepper(
  { id: "goal", title: "What's Your Goal" },
  { id: "fitness", title: "Tell us your fitness/experience" },
  { id: "connect", title: "Connect your data" }
);

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Home</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Today</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <Calendar className="w-6 h-6 mb-1 text-gray-600" />
          <span className="text-xs text-gray-600">Plan</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Progress</span>
        </div>
        <div className="flex flex-col items-center py-2">
          <div className="w-6 h-6 mb-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <span className="text-xs text-gray-600">Profile</span>
        </div>
      </div>
    </div>
  );
};

const GoalStep = ({ stepper }: { stepper: ReturnType<typeof useStepper> }) => {
  const { formData, updateFormData } = useOnboardingForm();
  
  // Get selected race ID from form data
  const selectedRaceId = formData.selectedGoal?.id || null;
  
  // Determine which view to show based on current selection type
  // If user has a 'race' type selected, show race calendar
  // Otherwise, show distance goals (default)
  const [showRaceCalendar, setShowRaceCalendar] = useState(
    formData.selectedGoal?.type === 'race'
  );

  const handleRaceSelection = (race: RaceOption, type: 'goal' | 'race') => {
    updateFormData({
      selectedGoal: {
        id: race.id,
        name: race.name,
        distance: race.distance,
        type: type,
      }
    });
    // Automatically advance to next step
    stepper.next();
  };

  const handleBrowseRaceCalendar = () => {
    setShowRaceCalendar(true);
  };

  const handleBackToGoals = () => {
    setShowRaceCalendar(false);
  };

  if (showRaceCalendar) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Race Calendar</h2>
          <p className="text-sm text-gray-600">
            Elite races with specific dates and locations
          </p>
        </div>

        {/* Race calendar options */}
        <div className="space-y-4">
          {calendarRaces.map((race) => (
            <Card 
              key={race.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedRaceId === race.id 
                  ? 'ring-2 ring-gray-900 bg-gray-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleRaceSelection(race, 'race')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {selectedRaceId === race.id ? (
                        <Check className="w-6 h-6 text-gray-600" />
                      ) : (
                        <Target className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{race.name}</h3>
                        {race.badge && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {race.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{race.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{race.participantCount.toLocaleString()} entrants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>+{Math.floor(Math.random() * 5000 + 1000)}m gain</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {race.distance}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to distance goals button */}
        <div className="text-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleBackToGoals}
            className="text-gray-600 hover:text-gray-800"
          >
            Choose a distance goal instead
          </Button>
        </div>


      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Target icon and heading */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What's Your Goal?
        </h1>
        <p className="text-gray-600">
          Choose what you're training for to get a<br/>
          personalized plan
        </p>
      </div>

      {/* Distance goal options (always shown) */}
      <div className="space-y-4">
        {goalOptions.map((race) => (
          <Card 
            key={race.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRaceId === race.id 
                ? 'ring-2 ring-gray-900 bg-gray-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleRaceSelection(race, 'goal')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    {selectedRaceId === race.id ? (
                      <Check className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Target className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{race.name}</h3>
                      {race.badge && (
                        <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">
                          {race.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{race.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{race.participantCount.toLocaleString()} runners</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{race.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {race.distance}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Train for specific race section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Train for a Specific Race
          </h3>
          <p className="text-sm text-gray-600">
            UTMB, Western States, Hardrock<br/>
            Elite races with specific dates
          </p>
        </div>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            className="text-gray-600"
            onClick={handleBrowseRaceCalendar}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Browse Race Calendar
          </Button>
        </div>
      </div>


    </div>
  );
};

const FitnessStep = ({ stepper }: { stepper: ReturnType<typeof useStepper> }) => {

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us your fitness/experience
        </h2>
        <p className="text-gray-600">
          This step will be implemented next
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={stepper.prev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={stepper.next}>
          Continue
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
};

const ConnectStep = ({ stepper }: { stepper: ReturnType<typeof useStepper> }) => {
  const navigate = useNavigate();
  const { submitForm } = useOnboardingForm();

  const handleFinish = async () => {
    try {
      await submitForm();
      navigate("/");
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect your data
        </h2>
        <p className="text-gray-600">
          This step will be implemented next
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={stepper.prev}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleFinish}>
          Finish Setup
        </Button>
      </div>
    </div>
  );
};

// Form Provider Component
const OnboardingFormProvider = ({ children }: { children: React.ReactNode }) => {
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

function OnboardingPageContent() {
  const navigate = useNavigate();
  const stepper = useStepper();

  const handleBack = () => {
    navigate(-1);
  };

  const currentIndex = utils.getIndex(stepper.current.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <div className="text-sm text-gray-500">
              Step {currentIndex + 1} of {steps.length}
            </div>
            <div className="text-sm font-medium">
              {Math.round(((currentIndex + 1) / steps.length) * 100)}% Complete
            </div>
          </div>
          <div className="w-10"></div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${((currentIndex + 1) / steps.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {stepper.all.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <Button
                type="button"
                variant={index <= currentIndex ? 'default' : 'secondary'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium p-0"
                onClick={() => stepper.goTo(step.id)}
              >
                {index + 1}
              </Button>
              <span className={`ml-2 text-sm ${
                index === currentIndex ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content using stepper.switch */}
      <div className="px-4 py-8 max-w-md mx-auto">
        {stepper.switch({
          goal: () => <GoalStep stepper={stepper} />,
          fitness: () => <FitnessStep stepper={stepper} />,
          connect: () => <ConnectStep stepper={stepper} />,
        })}
      </div>

      <BottomNavigation />
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingFormProvider>
      <OnboardingPageContent />
    </OnboardingFormProvider>
  );
}
