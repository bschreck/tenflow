
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';

export default function DailyReadinessCheck() {
  const navigate = useNavigate();

  const handleContinue = () => {
    // For now, redirect to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url(/hero-placeholder.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden
      />

      {/* Overlay Gradient */}
      <div className="fixed inset-0 z-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Daily Readiness Check
            </h1>
            <p className="text-gray-300">
              This feature is coming soon! We'll assess how you're feeling today to customize your workout.
            </p>
          </div>

          {/* Placeholder Content */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-900">What's Coming:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Daily wellness questionnaire</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Sleep and stress assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Adaptive workout recommendations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Training load adjustments</span>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <Button 
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}
