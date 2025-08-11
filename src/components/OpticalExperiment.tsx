
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, X, Maximize } from 'lucide-react';
import LightSource from './optical-experiment/LightSource';
import Polarizer from './optical-experiment/Polarizer';
import SampleTube from './optical-experiment/SampleTube';
import LightBeam from './optical-experiment/LightBeam';
import Detector from './optical-experiment/Detector';
import ExperimentControls from './optical-experiment/ExperimentControls';
import ExperimentStep from './optical-experiment/ExperimentStep';
import ExperimentResults from './optical-experiment/ExperimentResults';
import RutherfordScattering from './RutherfordScattering';

interface OpticalExperimentProps {
  experiment: {
    id: string;
    name: string;
    description: string;
    type: 'polarimetry' | 'optical_rotation' | 'scattering';
    compound: string;
    expectedRotation?: number;
    theory?: string;
  };
}

const OpticalExperiment = ({ experiment }: OpticalExperimentProps) => {
  // If it's a scattering experiment, render the Rutherford component
  if (experiment.type === 'scattering') {
    return <RutherfordScattering experiment={experiment as any} />;
  }
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
              setSampleRotation(experiment.expectedRotation || 0);
              setLightAngle(90 + (experiment.expectedRotation || 0) * 0.5);
              setLightBeamProgress(90);
              break;
            case 5:
              // Final measurement
              setObservedRotation(experiment.expectedRotation || 0);
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

  const experimentContent = (
    <div className="space-y-6">
      {/* Apparatus Visualization */}
      <div className={`relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
        isFullscreen ? 'h-96' : 'h-64'
      }`}>
        <div className="flex items-center justify-between h-full relative">
          
          {/* Light Source */}
          <LightSource isActive={isPlaying} currentStep={currentStep} />

          {/* Light Beam Container */}
          <div className="flex-1 relative h-8 mx-4">
            <LightBeam lightBeamProgress={lightBeamProgress} isPolarized={isPolarized} />
          </div>

          {/* Polarizer */}
          <Polarizer currentStep={currentStep} type="polarizer" />

          {/* Sample Tube */}
          <SampleTube 
            currentStep={currentStep} 
            compound={experiment.compound}
            rotation={sampleRotation}
          />

          {/* Analyzer */}
          <Polarizer 
            currentStep={currentStep} 
            type="analyzer" 
            rotation={observedRotation}
          />

          {/* Detector */}
          <Detector currentStep={currentStep} observedRotation={observedRotation} />

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
      <ExperimentStep currentStep={currentStep} steps={steps} />

      {/* Controls */}
      <ExperimentControls
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onReset={resetExperiment}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Results */}
      <ExperimentResults 
        observedRotation={observedRotation}
        compound={experiment.compound}
      />
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
