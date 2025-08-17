import { ArrowRight, Star, Users, Target, Calendar, Clock, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const handleStartJourney = () => {
    navigate("/onboarding");
  };

  const handleViewTrainingPlan = () => {
    navigate("/daily-readiness-check");
  };

  // Mock training plan data
  const mockTrainingPlan = {
    goal: "50K Trail Run",
    programDuration: 24,
    intensityLevel: "Moderate",
    currentWeek: 3,
    weeklyHours: 8,
    nextWorkout: "Long Run - 12 miles",
    completionRate: 85
  };

  return (
    <div className="min-h-screen -mt-16">
      <div className="relative overflow-hidden bg-black/5 dark:bg-black/30 min-h-screen">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/hero-placeholder.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />

        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative px-6 sm:px-10 py-16 sm:py-20 lg:py-24 text-white min-h-screen flex flex-col justify-center">
          {/* Glass stats bar */}
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 sm:mb-12 inline-flex w-full items-center justify-center gap-6 rounded-xl bg-white/10 px-6 py-4 backdrop-blur-md ring-1 ring-white/15">
              <div className="flex items-baseline gap-3">
                <Target className="h-5 w-5 opacity-90" />
                <div className="text-3xl font-bold leading-none">94%</div>
                <div className="text-sm opacity-80">Complete their goal</div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-baseline gap-3">
                <Users className="h-5 w-5 opacity-90" />
                <div className="text-3xl font-bold leading-none">127K</div>
                <div className="text-sm opacity-80">Active runners</div>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-baseline gap-3">
                <Star className="h-5 w-5 opacity-90" />
                <div className="text-3xl font-bold leading-none">4.9</div>
                <div className="text-sm opacity-80">User rating</div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">
              TenFlow
            </h1>
            <p className="mt-4 text-2xl sm:text-3xl font-medium opacity-95">
              AI-Powered Adaptive Training for Trail & Ultra Runners
            </p>
            <p className="mt-6 text-base sm:text-lg leading-relaxed opacity-90">
              Science-based coaching that adapts to your real health in real
              time. No rigid templates, just personalized training that works.
            </p>

            {!isAuthenticated ? (
              <>
                <div className="mt-10">
                  <Button
                    size="lg"
                    onClick={handleStartJourney}
                    className="h-12 px-8 text-base bg-white text-slate-900 hover:bg-white/90"
                  >
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-10 text-sm opacity-80">
                  Join thousands of trail runners achieving their goals
                </p>
              </>
            ) : (
              <div className="mt-10">
                <Card className="mx-auto max-w-2xl bg-white/95 backdrop-blur-sm border-white/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-center text-slate-900">
                      Welcome back, {user?.full_name || user?.email?.split('@')[0]}! 👋
                    </CardTitle>
                    <p className="text-center text-slate-600 text-sm">
                      Your training plan is ready to continue
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Goal and Progress Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <Target className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                        <div className="font-semibold text-slate-900">{mockTrainingPlan.goal}</div>
                        <div className="text-sm text-slate-600">{mockTrainingPlan.intensityLevel} Intensity</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                        <div className="font-semibold text-slate-900">Week {mockTrainingPlan.currentWeek}</div>
                        <div className="text-sm text-slate-600">of {mockTrainingPlan.programDuration}</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                        <div className="font-semibold text-slate-900">{mockTrainingPlan.completionRate}%</div>
                        <div className="text-sm text-slate-600">Completion Rate</div>
                      </div>
                    </div>

                    {/* Next Workout */}
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-slate-700" />
                        <span className="font-semibold text-slate-900">Next Workout</span>
                      </div>
                      <p className="text-slate-700 mb-3">{mockTrainingPlan.nextWorkout}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          {mockTrainingPlan.weeklyHours} hours this week
                        </span>
                        <Button 
                          onClick={handleViewTrainingPlan}
                          className="bg-slate-900 hover:bg-slate-800 text-white"
                        >
                          Start Today's Training
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <p className="mt-6 text-sm opacity-80">
                  Keep up the great work! You're {mockTrainingPlan.completionRate}% on track to reach your goal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
