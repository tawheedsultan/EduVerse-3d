
interface PolarizerProps {
  currentStep: number;
  type: 'polarizer' | 'analyzer';
  rotation?: number;
}

const Polarizer = ({ currentStep, type, rotation = 0 }: PolarizerProps) => {
  const isActive = type === 'polarizer' ? currentStep >= 1 : currentStep >= 4;
  
  return (
    <div className="flex flex-col items-center space-y-2 z-10">
      <div className={`w-10 h-16 bg-gray-700 rounded transition-all duration-500 ${
        isActive ? 'opacity-100 shadow-md' : 'opacity-50'
      }`}
      style={{ 
        transform: `rotate(${rotation * 0.3}deg)` 
      }}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-1 h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
      <span className="text-sm text-gray-600 font-medium">
        {type === 'polarizer' ? 'Polarizer' : 'Analyzer'}
      </span>
      <span className="text-xs text-gray-500">
        {type === 'polarizer' ? 'Creates plane' : 'Measures angle'}
      </span>
    </div>
  );
};

export default Polarizer;
