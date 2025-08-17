import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Connect Your Data
        </h2>
        <p className="text-gray-600">
          Sync your devices and apps for better training insights
        </p>
      </div>

      {/* Placeholder content for device/app connections */}
      <div className="space-y-4">
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600 mb-4">
            Device and app integration coming soon...
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Strava integration</p>
            <p>• Garmin Connect</p>
            <p>• Apple Health / Google Fit</p>
            <p>• Training Peaks</p>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex space-x-4 pt-4">
        <Button 
          variant="outline" 
          onClick={() => stepper.prev()}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleFinish}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
};
