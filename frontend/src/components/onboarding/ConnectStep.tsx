import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOnboardingForm } from "./OnboardingFormProvider";

interface ConnectStepProps {
  stepper: any; // Type will be inferred from parent component
}

export const ConnectStep = ({ stepper }: ConnectStepProps) => {
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

  const handleStravaConnect = () => {
    // Placeholder - will implement OAuth flow later
    console.log('Strava connect clicked');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect Your Data
        </h2>
        <p className="text-gray-600">
          Sync with Strava for automatic activity tracking and better insights
        </p>
      </div>

      {/* Main Strava Connection Card */}
      <Card className="p-8 border border-gray-200 rounded-xl bg-orange-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect with Strava</h3>
            <p className="text-gray-600 mb-4">
              Unlock the full power of adaptive training with automatic activity tracking
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-full text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Trusted by 127,000+ runners
          </div>
        </div>
      </Card>

      {/* Benefits List */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Automatic Activity Sync</h4>
            <p className="text-sm text-gray-600">Your runs upload instantly to TenFlow</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Rich Performance Data</h4>
            <p className="text-sm text-gray-600">Heart rate, pace, elevation, and more</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Smart Plan Adjustments</h4>
            <p className="text-sm text-gray-600">AI adapts your training based on actual performance</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">No Manual Entry</h4>
            <p className="text-sm text-gray-600">Save time with seamless data flow</p>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="p-6 border border-gray-200 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4 text-center">Why Runners Love This Connection</h4>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
            <div className="text-sm text-gray-600">Better consistency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">73%</div>
            <div className="text-sm text-gray-600">Improved performance</div>
          </div>
        </div>
      </Card>

      {/* Connect Button */}
      <div className="space-y-4">
        <Button 
          onClick={handleStravaConnect}
          className="w-full py-4 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Connect Strava Account
        </Button>

        <div className="text-center space-y-3">
          <Button 
            variant="ghost"
            onClick={handleFinish}
            className="text-gray-600 hover:text-gray-800"
          >
            Continue Without Strava
          </Button>
          <p className="text-sm text-gray-500">
            You can connect Strava anytime from your settings
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="pt-4 border-t border-gray-200">
        <Button 
          variant="ghost"
          onClick={() => stepper.goTo('fitness')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
      </div>
    </div>
  );
};
