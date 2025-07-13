
interface LightBeamProps {
  lightBeamProgress: number;
  isPolarized: boolean;
}

const LightBeam = ({ lightBeamProgress, isPolarized }: LightBeamProps) => {
  const beamWidth = `${lightBeamProgress}%`;
  
  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-6 transition-all duration-1000"
         style={{ width: beamWidth }}>
      
      {/* Unpolarized light beam */}
      {!isPolarized && lightBeamProgress > 0 && (
        <div className="relative h-full">
          {/* Main yellow beam */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 transform -translate-y-1/2" />
          
          {/* Oscillating waves representing unpolarized light */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-yellow-200 animate-pulse"
                style={{
                  top: `${10 + i * 10}%`,
                  transform: `rotate(${(i * 22.5) - 90}deg)`,
                  transformOrigin: 'left center',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          
          {/* Light ray indicators */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            {[...Array(Math.floor(lightBeamProgress / 10))].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-pulse"
                style={{
                  left: `${i * 12}%`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Polarized light beam */}
      {isPolarized && (
        <div className="relative h-full">
          {/* Main blue polarized beam */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-300 transform -translate-y-1/2" />
          
          {/* Single plane wave for polarized light */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-blue-200 transform -translate-y-1/2 animate-pulse" />
          
          {/* Polarized light indicators */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            {[...Array(Math.floor(lightBeamProgress / 8))].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"
                style={{
                  left: `${i * 10}%`,
                  animationDelay: `${i * 0.15}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LightBeam;
