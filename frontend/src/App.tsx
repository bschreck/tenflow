import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import OnboardingPage from "@/pages/OnboardingPage";
import RaceCalendarPage from "@/pages/RaceCalendarPage";
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

        <Route
          element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* New fitness app routes - no auth required for demo */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/race-calendar" element={<RaceCalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
