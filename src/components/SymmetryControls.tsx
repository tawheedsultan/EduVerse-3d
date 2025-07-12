
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Molecule } from '@/data/molecules';
import { Layers, RotateCw, Target } from 'lucide-react';

interface SymmetryControlsProps {
  showSymmetryElements: {
    planes: boolean;
    center: boolean;
    axes: boolean;
  };
  setShowSymmetryElements: (elements: {
    planes: boolean;
    center: boolean;
    axes: boolean;
  }) => void;
  molecule: Molecule;
}

const SymmetryControls = ({ 
  showSymmetryElements, 
  setShowSymmetryElements, 
  molecule 
}: SymmetryControlsProps) => {
  const handleToggle = (element: 'planes' | 'center' | 'axes') => {
    setShowSymmetryElements({
      ...showSymmetryElements,
      [element]: !showSymmetryElements[element]
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-500" />
          Symmetry Elements
        </CardTitle>
        <CardDescription>
          Toggle visibility of symmetry elements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Planes of Symmetry */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-500" />
              Mirror Planes
            </Label>
            <p className="text-xs text-muted-foreground">
              {molecule.symmetryElements.planes.length} plane(s)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-cyan-600 border-cyan-200">
              σ
            </Badge>
            <Switch
              checked={showSymmetryElements.planes}
              onCheckedChange={() => handleToggle('planes')}
            />
          </div>
        </div>

        {/* Rotation Axes */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-pink-500" />
              Rotation Axes
            </Label>
            <p className="text-xs text-muted-foreground">
              {molecule.symmetryElements.axes.length} axis/axes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-pink-600 border-pink-200">
              Cn
            </Badge>
            <Switch
              checked={showSymmetryElements.axes}
              onCheckedChange={() => handleToggle('axes')}
            />
          </div>
        </div>

        {/* Center of Symmetry */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-500" />
              Inversion Center
            </Label>
            <p className="text-xs text-muted-foreground">
              {molecule.symmetryElements.center ? 'Present' : 'Absent'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${molecule.symmetryElements.center 
                ? 'text-yellow-600 border-yellow-200' 
                : 'text-gray-400 border-gray-200'
              }`}
            >
              i
            </Badge>
            <Switch
              checked={showSymmetryElements.center}
              onCheckedChange={() => handleToggle('center')}
              disabled={!molecule.symmetryElements.center}
            />
          </div>
        </div>

        {/* Point Group Information */}
        <div className="pt-4 border-t">
          <div className="text-center">
            <Label className="text-sm font-medium">Point Group</Label>
            <div className="mt-2">
              <Badge variant="default" className="text-lg px-3 py-1">
                {molecule.pointGroup}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {molecule.description}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 border-t space-y-2">
          <Label className="text-sm font-medium">Color Legend</Label>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-300 rounded"></div>
              <span>Mirror Planes (σ)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-400 rounded"></div>
              <span>Rotation Axes (Cn)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span>Inversion Center (i)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymmetryControls;
