import { useState } from "react";
import {
  Users,
  Calendar,
  Target,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
// useStepper is passed as a prop from the parent component
import { useOnboardingForm } from "./OnboardingFormProvider";
import { RaceOption } from "@/types";

// Goal options (distance-based training)
const goalOptions: RaceOption[] = [
  {
    id: "5k",
    name: "5K",
    distance: "5K",
    description: "Perfect for beginners or speed work",
    participantCount: 15000,
    badge: "Beginner",
    category: "goal"
  },
  {
    id: "10k",
    name: "10K",
    distance: "10K", 
    description: "Great stepping stone distance",
    participantCount: 12000,
    badge: "Popular",
    category: "goal"
  },
  {
    id: "half-marathon",
    name: "Half Marathon",
    distance: "21K",
    description: "Classic endurance challenge",
    participantCount: 8000,
    category: "goal"
  },
  {
    id: "marathon",
    name: "Marathon",
    distance: "42K",
    description: "The ultimate road running challenge",
    participantCount: 5000,
    category: "goal"
  },
  {
    id: "50k-ultra",
    name: "50K Ultra",
    distance: "50K",
    description: "Enter the world of ultramarathons",
    participantCount: 1200,
    badge: "Ultra",
    category: "goal",
    elevationGain: 1500
  },
  {
    id: "100k-ultra",
    name: "100K Ultra",
    distance: "100K",
    description: "Serious ultra distance",
    participantCount: 400,
    badge: "Elite",
    category: "goal",
    elevationGain: 3200
  }
];

// Calendar races (specific events)
const calendarRaces: RaceOption[] = [
  {
    id: "utmb",
    name: "Ultra-Trail du Mont-Blanc",
    distance: "171K",
    description: "The most prestigious ultra in the Alps",
    participantCount: 2300,
    badge: "Elite",
    location: "Chamonix, France",
    date: "Aug 2024",
    category: "race",
    elevationGain: 10000
  },
  {
    id: "western-states",
    name: "Western States 100",
    distance: "161K",
    description: "America's oldest 100-mile trail race",
    participantCount: 369,
    badge: "Elite",
    location: "California, USA",
    date: "Jun 2024",
    category: "race",
    elevationGain: 5500
  },
  {
    id: "hardrock",
    name: "Hardrock 100",
    distance: "161K",
    description: "High altitude suffering in Colorado",
    participantCount: 140,
    badge: "Elite",
    location: "Colorado, USA", 
    date: "Jul 2024",
    category: "race",
    elevationGain: 10200
  },
  {
    id: "tor-des-geants",
    name: "Tor des Géants",
    distance: "330K",
    description: "Non-stop around Mont Blanc",
    participantCount: 800,
    badge: "Elite",
    location: "Aosta Valley, Italy",
    date: "Sep 2024",
    category: "race",
    elevationGain: 24000
  }
];

interface GoalStepProps {
  stepper: any; // Type will be inferred from parent component
}

export const GoalStep = ({ stepper }: GoalStepProps) => {
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

  const handleContinue = () => {
    if (selectedRaceId) {
      stepper.next();
    }
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
                        {race.elevationGain && (
                          <div className="flex items-center space-x-1">
                            <Target className="w-3 h-3" />
                            <span>+{race.elevationGain.toLocaleString()}m gain</span>
                          </div>
                        )}
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

        {/* Continue and Back buttons */}
        <div className="flex flex-col space-y-3 pt-6">
          <Button 
            onClick={handleContinue}
            disabled={!selectedRaceId}
            className={`w-full text-white disabled:opacity-50 transition-all duration-200 ${
              selectedRaceId 
                ? 'bg-gray-900 hover:bg-gray-800 shadow-lg' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedRaceId ? 'Continue' : 'Select a race to continue'}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleBackToGoals}
            className="w-full text-gray-600 hover:text-gray-800"
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
                      {race.elevationGain && (
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>+{race.elevationGain.toLocaleString()}m gain</span>
                        </div>
                      )}
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

      {/* Continue button */}
      <div className="pt-6">
        <Button 
          onClick={handleContinue}
          disabled={!selectedRaceId}
          className={`w-full text-white disabled:opacity-50 transition-all duration-200 ${
            selectedRaceId 
              ? 'bg-gray-900 hover:bg-gray-800 shadow-lg' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedRaceId ? 'Continue' : 'Select a goal to continue'}
        </Button>

      </div>
    </div>
  );
};
