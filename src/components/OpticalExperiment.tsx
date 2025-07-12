
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Lightbulb, Eye } from 'lucide-react';

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

  const steps = [
    "Light source emits unpolarized light",
    "Polarizer filters light to single plane",
    "Polarized light passes through sample",
    "Sample rotates light plane",
    "Analyzer measures rotation angle",
    "Digital display shows result"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          const nextStep = (prev + 1) % steps.length;
          
          // Animate different parts based on step
          switch (nextStep) {
            case 1:
              setLightAngle(90);
              break;
            case 2:
              setLightAngle(90);
              break;
            case 3:
              setSampleRotation(experiment.expectedRotation);
              break;
            case 4:
              setObservedRotation(experiment.expectedRotation);
              break;
            case 5:
              // Complete cycle
              break;
            case 0:
              // Reset for next cycle
              setLightAngle(0);
              setSampleRotation(0);
              setObservedRotation(0);
              break;
          }
          
          return nextStep;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, experiment.expectedRotation]);

  const resetExperiment = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setLightAngle(0);
    setSampleRotation(0);
    setObservedRotation(0);
  };

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
        <div className="space-y-6">
          {/* Apparatus Visualization */}
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 h-64">
            <div className="flex items-center justify-between h-full">
              
              {/* Light Source */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center transition-all duration-1000 ${
                  currentStep >= 0 ? 'animate-pulse' : ''
                }`}>
                  <Lightbulb className="w-6 h-6 text-yellow-800" />
                </div>
                <span className="text-xs text-gray-600">Light Source</span>
              </div>

              {/* Light Beam */}
              <div className="flex-1 relative h-2 mx-4">
                <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-blue-300 transition-all duration-1000 ${
                  currentStep >= 1 ? 'w-full' : 'w-0'
                }`} 
                style={{ 
                  transform: `rotate(${lightAngle}deg)`,
                  transformOrigin: 'left center'
                }} />
              </div>

              {/* Polarizer */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-12 bg-gray-600 rounded transition-all duration-500 ${
                  currentStep >= 1 ? 'opacity-100' : 'opacity-50'
                }`} />
                <span className="text-xs text-gray-600">Polarizer</span>
              </div>

              {/* Sample Tube */}
              <div className="flex flex-col items-center space-y-2 mx-6">
                <div className={`w-16 h-8 bg-blue-200 rounded-lg border-2 border-blue-400 transition-all duration-1000 ${
                  currentStep >= 2 ? 'bg-blue-300' : ''
                }`}
                style={{ 
                  transform: `rotate(${sampleRotation * 0.1}deg)` 
                }}>
                  <div className="w-full h-full flex items-center justify-center text-xs text-blue-800">
                    Sample
                  </div>
                </div>
                <span className="text-xs text-gray-600">Sample Tube</span>
              </div>

              {/* Analyzer */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-8 h-12 bg-gray-600 rounded transition-all duration-500 ${
                  currentStep >= 4 ? 'opacity-100' : 'opacity-50'
                }`}
                style={{ 
                  transform: `rotate(${observedRotation * 0.5}deg)` 
                }} />
                <span className="text-xs text-gray-600">Analyzer</span>
              </div>

              {/* Detector */}
              <div className="flex flex-col items-center space-y-2">
                <div className={`w-12 h-12 bg-gray-800 rounded flex items-center justify-center transition-all duration-500 ${
                  currentStep >= 5 ? 'bg-green-600' : ''
                }`}>
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-600">Detector</span>
              </div>

            </div>

            {/* Rotation Display */}
            {observedRotation !== 0 && (
              <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
                <div className="text-sm font-semibold text-green-600">
                  α = {observedRotation.toFixed(1)}°
                </div>
              </div>
            )}
          </div>

          {/* Current Step Display */}
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium">Step {currentStep + 1} of {steps.length}</span>
            </div>
            <p className="text-gray-700">{steps[currentStep]}</p>
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
                This rotation indicates the compound is {observedRotation > 0 ? 'dextrorotatory (+)' : 'levorotatory (-)'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OpticalExperiment;
