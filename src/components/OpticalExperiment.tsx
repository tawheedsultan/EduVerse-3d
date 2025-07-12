
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Lightbulb, Eye, Maximize, X } from 'lucide-react';

interface OpticalExperimentProps {
  experiment: {
    id: string;
    name: string;
    description: string;
    type: 'polarimetry' | 'optical_rotation';
    compound: string;
    expectedRotation: number;
  };
}

const OpticalExperiment = ({ experiment }: OpticalExperimentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lightAngle, setLightAngle] = useState(0);
  const [sampleRotation, setSampleRotation] = useState(0);
  const [observedRotation, setObservedRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lightBeamProgress, setLightBeamProgress] = useState(0);
  const [isPolarized, setIsPolarized] = useState(false);

  const steps = [
    "Light source emits unpolarized light",
    "Polarizer filters light to single plane",
    "Polarized light passes through sample tube",
    "Sample rotates light plane due to optical activity",
    "Analyzer measures the rotation angle",
    "Digital display shows the rotation value"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % steps.length;
          
          // Animate different parts based on step
          switch (nextStep) {
            case 0:
              // Reset everything
              setLightBeamProgress(0);
              setIsPolarized(false);
              setLightAngle(0);
              setSampleRotation(0);
              setObservedRotation(0);
              break;
            case 1:
              // Light beam starts
              setLightBeamProgress(25);
              break;
            case 2:
              // Light gets polarized
              setIsPolarized(true);
              setLightAngle(90);
              setLightBeamProgress(50);
              break;
            case 3:
              // Light passes through sample
              setLightBeamProgress(75);
              break;
            case 4:
              // Sample rotates the light
              setSampleRotation(experiment.expectedRotation);
              setLightAngle(90 + experiment.expectedRotation * 0.5);
              setLightBeamProgress(90);
              break;
            case 5:
              // Final measurement
              setObservedRotation(experiment.expectedRotation);
              setLightBeamProgress(100);
              break;
          }
          
          return nextStep;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, experiment.expectedRotation]);

  const resetExperiment = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLightAngle(0);
    setSampleRotation(0);
    setObservedRotation(0);
    setLightBeamProgress(0);
    setIsPolarized(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsPlaying(true);
    }
  };

  const renderLightBeam = () => {
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

  const experimentContent = (
    <div className="space-y-6">
      {/* Apparatus Visualization */}
      <div className={`relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
        isFullscreen ? 'h-96' : 'h-64'
      }`}>
        <div className="flex items-center justify-between h-full relative">
          
          {/* Light Source */}
          <div className="flex flex-col items-center space-y-2 z-10">
            <div className={`w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center transition-all duration-1000 ${
              currentStep >= 0 && isPlaying ? 'animate-pulse shadow-lg shadow-yellow-300' : ''
            }`}>
              <Lightbulb className="w-8 h-8 text-yellow-800" />
            </div>
            <span className="text-sm text-gray-600 font-medium">Light Source</span>
          </div>

          {/* Light Beam Container */}
          <div className="flex-1 relative h-8 mx-4">
            {renderLightBeam()}
          </div>

          {/* Polarizer */}
          <div className="flex flex-col items-center space-y-2 z-10">
            <div className={`w-10 h-16 bg-gray-700 rounded transition-all duration-500 ${
              currentStep >= 1 ? 'opacity-100 shadow-md' : 'opacity-50'
            }`}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1 h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">Polarizer</span>
          </div>

          {/* Sample Tube */}
          <div className="flex flex-col items-center space-y-2 mx-8 z-10">
            <div className={`relative w-24 h-12 bg-blue-200/80 rounded-lg border-2 border-blue-400 transition-all duration-1000 ${
              currentStep >= 2 ? 'bg-blue-300/90 shadow-lg' : ''
            }`}
            style={{ 
              transform: `rotate(${sampleRotation * 0.1}deg)` 
            }}>
              <div className="w-full h-full flex items-center justify-center text-sm text-blue-800 font-semibold">
                {experiment.compound.split(' ')[0]}
              </div>
              {/* Sample liquid visualization */}
              <div className={`absolute inset-1 rounded bg-blue-400/60 transition-all duration-1000 ${
                currentStep >= 3 ? 'animate-pulse' : ''
              }`} />
              {/* Rotation indicator */}
              {sampleRotation !== 0 && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-spin">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600 font-medium">Sample Tube</span>
          </div>

          {/* Analyzer */}
          <div className="flex flex-col items-center space-y-2 z-10">
            <div className={`w-10 h-16 bg-gray-700 rounded transition-all duration-500 ${
              currentStep >= 4 ? 'opacity-100 shadow-md' : 'opacity-50'
            }`}
            style={{ 
              transform: `rotate(${observedRotation * 0.3}deg)` 
            }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-1 h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
            <span className="text-sm text-gray-600 font-medium">Analyzer</span>
          </div>

          {/* Detector */}
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
          </div>

        </div>

        {/* Rotation Display */}
        {observedRotation !== 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg border">
            <div className="text-lg font-bold text-green-600">
              α = {observedRotation.toFixed(1)}°
            </div>
            <div className="text-xs text-gray-500">
              {observedRotation > 0 ? 'Dextrorotatory (+)' : 'Levorotatory (-)'}
            </div>
          </div>
        )}

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

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          variant={isPlaying ? "secondary" : "default"}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Start'} Experiment
        </Button>
        <Button onClick={resetExperiment} variant="outline" className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
        {!isFullscreen && (
          <Button onClick={toggleFullscreen} variant="outline" className="flex items-center gap-2">
            <Maximize className="w-4 h-4" />
            Fullscreen
          </Button>
        )}
      </div>

      {/* Results */}
      {observedRotation !== 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Experimental Results</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Observed Rotation:</span>
              <span className="ml-2 font-medium">{observedRotation.toFixed(1)}°</span>
            </div>
            <div>
              <span className="text-gray-600">Compound:</span>
              <span className="ml-2 font-medium">{experiment.compound}</span>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-2">
            This rotation indicates the compound is {observedRotation > 0 ? 'dextrorotatory (+)' : 'levorotatory (-)'} - 
            it rotates plane-polarized light {observedRotation > 0 ? 'clockwise' : 'counterclockwise'} when viewed towards the light source.
          </p>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl bg-white rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-500" />
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
              <Eye className="w-5 h-5 text-purple-500" />
              {experiment.name}
            </CardTitle>
            <CardDescription>{experiment.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
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

export default OpticalExperiment;
