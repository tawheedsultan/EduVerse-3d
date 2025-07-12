
interface LightBeamProps {
  lightBeamProgress: number;
  isPolarized: boolean;
}

const LightBeam = ({ lightBeamProgress, isPolarized }: LightBeamProps) => {
  const beamWidth = `${lightBeamProgress}%`;
  const beamStyle = isPolarized ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-yellow-300 to-red-300';
  
  return (
    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-3 transition-all duration-1000"
         style={{ width: beamWidth }}>
      <div className={`h-full ${beamStyle} relative`}>
        {/* Unpolarized light waves */}
        {!isPolarized && lightBeamProgress > 0 && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute h-px bg-white animate-pulse"
                style={{
                  top: `${20 + i * 15}%`,
                  transform: `rotate(${i * 36}deg)`,
                  transformOrigin: 'left center'
                }}
              />
            ))}
          </div>
        )}
        {/* Polarized light wave */}
        {isPolarized && (
          <div className="absolute top-1/2 left-0 w-full h-px bg-white transform -translate-y-1/2 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default LightBeam;
