
interface SampleTubeProps {
  currentStep: number;
  compound: string;
  rotation: number;
}

const SampleTube = ({ currentStep, compound, rotation }: SampleTubeProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 mx-8 z-10">
      <div className={`relative w-32 h-16 bg-blue-200/80 rounded-lg border-2 border-blue-400 transition-all duration-1000 ${
        currentStep >= 2 ? 'bg-blue-300/90 shadow-lg' : ''
      }`}
      style={{ 
        transform: `rotate(${rotation * 0.1}deg)` 
      }}>
        {/* Sample tube body */}
        <div className="w-full h-full flex items-center justify-center text-sm text-blue-800 font-semibold relative">
          {/* Glass tube effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/30 to-transparent" />
          
          {/* Sample liquid */}
          <div className={`absolute inset-2 rounded bg-blue-400/60 transition-all duration-1000 ${
            currentStep >= 3 ? 'animate-pulse' : ''
          }`} />
          
          {/* Compound label */}
          <span className="relative z-10">
            {compound.split(' ')[0]}
          </span>
        </div>
        
        {/* Tube caps */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-12 bg-gray-600 rounded-l-full" />
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-12 bg-gray-600 rounded-r-full" />
        
        {/* Rotation indicator */}
        {rotation !== 0 && (
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-spin">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600 font-medium">Sample Tube</span>
      <span className="text-xs text-gray-500">Contains {compound}</span>
    </div>
  );
};

export default SampleTube;
