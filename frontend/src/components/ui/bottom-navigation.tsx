interface BottomNavigationProps {
  currentStep?: number;
  totalSteps?: number;
  completedSteps?: number;
  showProgress?: boolean;
  customContent?: React.ReactNode;
}

export const BottomNavigation = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  completedSteps = 1,
  showProgress = true,
  customContent 
}: BottomNavigationProps) => {
  if (customContent) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          {customContent}
        </div>
      </div>
    );
  }

  if (!showProgress) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index < completedSteps ? 'bg-gray-600' : 'bg-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">
            {completedSteps} of {totalSteps} completed
          </span>
        </div>
      </div>
    </div>
  );
};
