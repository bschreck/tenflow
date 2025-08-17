import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FitnessDemo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Fitness App Demo
          </h1>
          <p className="text-gray-600">
            Based on the screenshots you provided, I've created a running/fitness app interface
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Unified Onboarding Flow</CardTitle>
              <CardDescription>
                Multi-step onboarding with stepper component combining goal and race selection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/onboarding")}
                className="w-full"
              >
                Start Onboarding Flow
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Features Implemented</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ Unified onboarding flow with shadcn stepper component</li>
            <li>✅ Step 1 combines goal/race selection in a single flow</li>
            <li>✅ Dynamic progress tracking (Step X of 3, % Complete)</li>
            <li>✅ Multi-category selection (Goal vs Race training)</li>
            <li>✅ Race cards with distance, description, participant count, and duration</li>
            <li>✅ Popular badges for trending races</li>
            <li>✅ Selection state management with visual feedback</li>
            <li>✅ Bottom navigation bar (Home, Today, Plan, Progress, Profile)</li>
            <li>✅ Clean, modern design matching the screenshots</li>
            <li>✅ Mobile-first responsive layout</li>
            <li>✅ Smooth navigation between screens and steps</li>
            <li>✅ Accessibility features with stepper component</li>
          </ul>
        </div>

        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
