
interface ExperimentStepProps {
  currentStep: number;
  steps: string[];
}

const ExperimentStep = ({ currentStep, steps }: ExperimentStepProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
      </div>
      <p className="text-gray-700">{steps[currentStep]}</p>
      
      {/* Progress bar */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ExperimentStep;
