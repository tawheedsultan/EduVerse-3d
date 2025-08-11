import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, X, Maximize } from 'lucide-react';

interface RutherfordScatteringProps {
  experiment: {
    id: string;
    name: string;
    description: string;
    type: 'scattering';
    compound: string;
    theory: string;
  };
}

const RutherfordScattering = ({ experiment }: RutherfordScatteringProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [alphaParticles, setAlphaParticles] = useState<Array<{id: number, x: number, y: number, angle: number, deflected: boolean}>>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const steps = [
    "Radioactive source emits alpha particles",
    "Alpha particles pass through collimating slits",
    "Most particles pass straight through gold foil",
    "Some particles deflect at small angles",
    "Few particles deflect at large angles (unexpected!)",
    "Detector screen records particle impacts"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        
        // Add new alpha particles
        const newParticles = Array.from({ length: 3 }, (_, i) => ({
          id: Date.now() + i,
          x: 0,
          y: 120 + (Math.random() - 0.5) * 80,
          angle: 0,
          deflected: Math.random() < 0.15 // 15% chance of deflection
        }));
        
        setAlphaParticles(prev => [...prev.slice(-20), ...newParticles]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      const animationInterval = setInterval(() => {
        setAlphaParticles(prev => 
          prev.map(particle => {
            let newX = particle.x + 4;
            let newY = particle.y;
            let newAngle = particle.angle;
            
            // Deflection at gold foil position (x = 400)
            if (newX > 380 && newX < 420 && particle.deflected) {
              const deflectionAngle = (Math.random() - 0.5) * 60; // -30 to +30 degrees
              newAngle = deflectionAngle;
              newY += deflectionAngle * 0.5;
            } else if (newX > 420 && particle.deflected) {
              newY += newAngle * 0.3;
            }
            
            return {
              ...particle,
              x: newX,
              y: newY,
              angle: newAngle
            };
          }).filter(particle => particle.x < 700)
        );
      }, 50);
      
      return () => clearInterval(animationInterval);
    }
  }, [isPlaying]);

  const resetExperiment = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setAlphaParticles([]);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsPlaying(true);
    }
  };

  const experimentContent = (
    <div className="space-y-6">
      {/* Apparatus Visualization */}
      <div className={`relative bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 transition-all duration-300 ${
        isFullscreen ? 'h-96' : 'h-64'
      }`}>
        <svg className="w-full h-full" viewBox="0 0 700 240">
          {/* Radioactive Source */}
          <g transform="translate(30, 100)">
            <circle cx="0" cy="20" r="15" fill="#ff4444" stroke="#cc0000" strokeWidth="2" />
            <text x="0" y="25" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">Ra</text>
            <text x="0" y="50" textAnchor="middle" fontSize="8" fill="#cc0000">Alpha Source</text>
            {isPlaying && (
              <circle cx="0" cy="20" r="18" fill="#ff4444" opacity="0.3" className="animate-pulse" />
            )}
          </g>

          {/* Collimating Slits */}
          <g transform="translate(120, 80)">
            <rect x="0" y="0" width="8" height="80" fill="#666" />
            <rect x="0" y="20" width="8" height="10" fill="none" stroke="#333" strokeWidth="1" />
            <rect x="0" y="35" width="8" height="10" fill="none" stroke="#333" strokeWidth="1" />
            <rect x="0" y="50" width="8" height="10" fill="none" stroke="#333" strokeWidth="1" />
            <text x="4" y="95" textAnchor="middle" fontSize="8" fill="#666">Slits</text>
          </g>

          {/* Gold Foil */}
          <g transform="translate(400, 60)">
            <rect x="0" y="0" width="4" height="120" fill="#ffd700" stroke="#ffaa00" strokeWidth="1" />
            <text x="2" y="140" textAnchor="middle" fontSize="8" fill="#ffaa00">Gold Foil</text>
            <text x="2" y="150" textAnchor="middle" fontSize="6" fill="#666">(few atoms thick)</text>
          </g>

          {/* Detector Screen */}
          <g transform="translate(600, 40)">
            <path d="M 0,0 Q 20,0 40,20 Q 40,40 40,80 Q 40,120 40,140 Q 40,160 20,160 Q 0,160 0,160 Z" 
                  fill="#333" stroke="#222" strokeWidth="2" />
            <text x="20" y="180" textAnchor="middle" fontSize="8" fill="#333">ZnS Screen</text>
            <text x="20" y="190" textAnchor="middle" fontSize="6" fill="#666">Detector</text>
            
            {/* Scintillations on detector */}
            {alphaParticles.filter(p => p.x > 580).map(particle => (
              <circle 
                key={particle.id} 
                cx="5" 
                cy={particle.y - 40} 
                r="2" 
                fill="#00ff00" 
                className="animate-ping" 
              />
            ))}
          </g>

          {/* Microscope */}
          <g transform="translate(550, 200)">
            <circle cx="0" cy="0" r="8" fill="#444" />
            <rect x="-3" y="-15" width="6" height="15" fill="#666" />
            <text x="0" y="20" textAnchor="middle" fontSize="8" fill="#444">Microscope</text>
          </g>

          {/* Alpha Particles */}
          {alphaParticles.map(particle => (
            <g key={particle.id}>
              <circle 
                cx={particle.x} 
                cy={particle.y} 
                r="2" 
                fill="#ff6b6b" 
                className="animate-pulse"
              />
              {/* Particle trail */}
              <line 
                x1={particle.x - 20} 
                y1={particle.y} 
                x2={particle.x} 
                y2={particle.y} 
                stroke="#ff6b6b" 
                strokeWidth="1" 
                opacity="0.5"
              />
            </g>
          ))}

          {/* Labels */}
          <text x="350" y="30" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">
            Rutherford Scattering Apparatus
          </text>
        </svg>

        {/* Key Observations */}
        <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg border max-w-xs">
          <div className="text-sm font-bold text-orange-600 mb-2">Key Observations:</div>
          <div className="text-xs space-y-1">
            <div>• Most α particles pass through</div>
            <div>• Some deflect at small angles</div>
            <div>• Very few deflect at large angles</div>
            <div className="text-orange-600 font-semibold">→ Atoms have dense nuclei!</div>
          </div>
        </div>

        {/* Fullscreen toggle */}
        {!isFullscreen && (
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="absolute top-4 left-4"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Current Step Display */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
            {currentStep + 1}
          </div>
          <h3 className="font-semibold text-orange-800">Current Step</h3>
        </div>
        <p className="text-orange-700">{steps[currentStep]}</p>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant={isPlaying ? "destructive" : "default"}
          className="flex-1"
        >
          {isPlaying ? "Stop" : "Start"} Experiment
        </Button>
        <Button onClick={resetExperiment} variant="outline">
          Reset
        </Button>
        {!isFullscreen && (
          <Button onClick={toggleFullscreen} variant="outline">
            <Maximize className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        )}
      </div>

      {/* Theory and Results */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
        <h3 className="font-semibold text-orange-800 mb-2">Rutherford's Discovery</h3>
        <p className="text-orange-700 text-sm leading-relaxed">
          {experiment.theory}
        </p>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-orange-500" />
              <div>
                <h2 className="text-xl font-bold">{experiment.name}</h2>
                <p className="text-sm text-gray-600">{experiment.description}</p>
              </div>
            </div>
            <Button onClick={() => setIsFullscreen(false)} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            {experimentContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              {experiment.name}
            </CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {experiment.compound}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {experimentContent}
      </CardContent>
    </Card>
  );
};

export default RutherfordScattering;