
interface PolarizerProps {
  currentStep: number;
  type: 'polarizer' | 'analyzer';
  rotation?: number;
}

const Polarizer = ({ currentStep, type, rotation = 0 }: PolarizerProps) => {
  const isActive = type === 'polarizer' ? currentStep >= 1 : currentStep >= 4;
  
  return (
    <div className="flex flex-col items-center space-y-2 z-10">
      <div className={`relative w-12 h-20 transition-all duration-500`}>
        
        {/* Polarizer frame */}
        <div className={`w-full h-full bg-gray-800 rounded-lg border-2 ${
          isActive ? 'border-blue-400 shadow-lg shadow-blue-300/50' : 'border-gray-600'
        }`}
        style={{ 
          transform: `rotate(${rotation * 0.3}deg)` 
        }}>
          
          {/* Polarizer grid pattern */}
          <div className="absolute inset-2 overflow-hidden rounded">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-full h-px ${
                  isActive ? 'bg-blue-300' : 'bg-gray-400'
                } transition-colors duration-500`}
                style={{
                  top: `${i * 12.5}%`,
                  opacity: 0.7
                }}
              />
            ))}
          </div>
          
          {/* Center optical axis */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-14 ${
            isActive ? 'bg-blue-200' : 'bg-gray-300'
          } rounded transition-colors duration-500`} />
          
          {/* Active indicator */}
          {isActive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
          )}
        </div>
        
        {/* Rotation angle indicator */}
        {type === 'analyzer' && rotation !== 0 && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 bg-white px-1 rounded">
            {rotation.toFixed(1)}°
          </div>
        )}
      </div>
      
      <div className="text-center">
        <span className="text-sm text-gray-600 font-medium">
          {type === 'polarizer' ? 'Polarizer' : 'Movable Analyzer'}
        </span>
        <span className="text-xs text-gray-500 block">
          {type === 'polarizer' ? 'Creates polarized light' : 'Detects rotation angle'}
        </span>
      </div>
    </div>
  );
};

export default Polarizer;
