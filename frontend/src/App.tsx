import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router";

import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import TrainingPlanSummary from "@/pages/TrainingPlanSummary";
import DailyReadinessCheck from "@/pages/DailyReadinessCheck";
import { OnboardingFormProvider } from "@/components/onboarding/OnboardingFormProvider";
import { useAuthStore } from "@/stores/auth";



function App() {
  const { isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

    return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />}
        />

        {/* Dashboard route - accessible to everyone */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Authenticated routes */}
        <Route
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Onboarding flow routes with shared form context */}
        <Route 
          path="/onboarding" 
          element={
            <OnboardingFormProvider>
              <OnboardingPage />
            </OnboardingFormProvider>
          } 
        />
        <Route 
          path="/training-plan-summary" 
          element={
            <OnboardingFormProvider>
              <TrainingPlanSummary />
            </OnboardingFormProvider>
          } 
        />
        
        {/* Standalone routes */}
        <Route path="/daily-readiness-check" element={<DailyReadinessCheck />} />
      </Routes>
    </Router>
  );
}

export default App;
