
interface SampleTubeProps {
  currentStep: number;
  compound: string;
  rotation: number;
}

const SampleTube = ({ currentStep, compound, rotation }: SampleTubeProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 mx-8 z-10">
      <div className={`relative w-40 h-20 transition-all duration-1000`}>
        
        {/* Glass tube container */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300 shadow-inner">
          {/* Glass reflection effect */}
          <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/40 via-transparent to-white/20" />
        </div>
        
        {/* Sample solution inside */}
        <div className={`absolute inset-3 rounded-lg transition-all duration-1000 ${
          currentStep >= 2 ? 'bg-amber-200/80 shadow-lg' : 'bg-amber-100/60'
        }`}>
          {/* Organic molecules visualization */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-amber-400 rounded-full transition-all duration-1000 ${
                  currentStep >= 3 ? 'animate-pulse' : ''
                }`}
                style={{
                  left: `${15 + (i % 4) * 20}%`,
                  top: `${20 + Math.floor(i / 4) * 25}%`,
                  transform: rotation !== 0 ? `rotate(${rotation * 2}deg)` : 'none',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          {/* Compound label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-amber-800 bg-white/70 px-2 py-1 rounded">
              {compound.split(' ')[0]}
            </span>
          </div>
        </div>
        
        {/* End caps with optical windows */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-14 bg-gray-600 rounded-l-lg">
          <div className="absolute inset-1 bg-blue-100/80 rounded-l" />
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-14 bg-gray-600 rounded-r-lg">
          <div className="absolute inset-1 bg-blue-100/80 rounded-r" />
        </div>
        
        {/* Rotation visualization */}
        {rotation !== 0 && (
          <>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-600">
              {rotation > 0 ? '↻' : '↺'} {Math.abs(rotation)}°
            </div>
            <div className="absolute inset-0 border-2 border-green-400 rounded-xl animate-pulse" />
          </>
        )}
      </div>
      
      <div className="text-center">
        <span className="text-sm text-gray-600 font-medium">Sample Tube</span>
        <div className="text-xs text-gray-500">
          <div>Organic Molecules</div>
          <div className="font-medium text-amber-700">{compound}</div>
        </div>
      </div>
    </div>
  );
};

export default SampleTube;
