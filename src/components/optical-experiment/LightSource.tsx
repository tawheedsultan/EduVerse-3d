
import { Lightbulb } from 'lucide-react';

interface LightSourceProps {
  isActive: boolean;
  currentStep: number;
}

const LightSource = ({ isActive, currentStep }: LightSourceProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 z-10">
      <div className={`w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center transition-all duration-1000 ${
        currentStep >= 0 && isActive ? 'animate-pulse shadow-lg shadow-yellow-300' : ''
      }`}>
        <Lightbulb className="w-8 h-8 text-yellow-800" />
      </div>
      <span className="text-sm text-gray-600 font-medium">Light Source</span>
      <span className="text-xs text-gray-500">Unpolarized</span>
    </div>
  );
};

export default LightSource;
