
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Maximize } from 'lucide-react';

interface ExperimentControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
}

const ExperimentControls = ({ 
  isPlaying, 
  isFullscreen, 
  onTogglePlay, 
  onReset, 
  onToggleFullscreen 
}: ExperimentControlsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        onClick={onTogglePlay}
        variant={isPlaying ? "secondary" : "default"}
        className="flex items-center gap-2"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlaying ? 'Pause' : 'Start'} Experiment
      </Button>
      <Button onClick={onReset} variant="outline" className="flex items-center gap-2">
        <RotateCcw className="w-4 h-4" />
        Reset
      </Button>
      {!isFullscreen && (
        <Button onClick={onToggleFullscreen} variant="outline" className="flex items-center gap-2">
          <Maximize className="w-4 h-4" />
          Fullscreen
        </Button>
      )}
    </div>
  );
};

export default ExperimentControls;
