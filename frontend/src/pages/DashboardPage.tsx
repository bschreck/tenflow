import { ArrowRight, Star, Users, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-2xl bg-black/5 dark:bg-black/30">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative px-6 sm:px-10 py-16 sm:py-20 lg:py-24 text-white">
          {/* Glass stats bar */}
          <div className="mx-auto max-w-3xl">
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
          <div className="mx-auto max-w-3xl text-center">
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

            <div className="mt-10">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-white text-slate-900 hover:bg-white/90"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="mt-10 text-sm opacity-80">
              Join thousands of trail runners achieving their goals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
