
import { Eye } from 'lucide-react';

interface DetectorProps {
  currentStep: number;
  observedRotation: number;
}

const Detector = ({ currentStep, observedRotation }: DetectorProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 z-10">
      <div className={`w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-500 ${
        currentStep >= 5 ? 'bg-green-600 shadow-lg shadow-green-300' : ''
      }`}>
        <Eye className="w-8 h-8 text-white" />
        {currentStep >= 5 && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping" />
        )}
      </div>
      <span className="text-sm text-gray-600 font-medium">Detector</span>
      <span className="text-xs text-gray-500">
        {observedRotation !== 0 ? `${observedRotation.toFixed(1)}°` : 'Ready'}
      </span>
    </div>
  );
};

export default Detector;
