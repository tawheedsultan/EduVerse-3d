import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, X, Maximize } from 'lucide-react';
import ElectrostaticsVisualization from './physics/ElectrostaticsVisualization';
import CurrentElectricityVisualization from './physics/CurrentElectricityVisualization';

interface PhysicsVisualizationProps {
  concept: {
    id: string;
    name: string;
    description: string;
    category: 'electrostatics' | 'current_electricity';
    theory: string;
    applications: string[];
  };
}

const PhysicsVisualization = ({ concept }: PhysicsVisualizationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const renderVisualization = () => {
    if (concept.category === 'electrostatics') {
      return <ElectrostaticsVisualization concept={concept} />;
    } else {
      return <CurrentElectricityVisualization concept={concept} />;
    }
  };

  const content = (
    <div className="space-y-6">
      {renderVisualization()}
      
      {/* Applications */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h4 className="font-semibold text-purple-800 mb-3">Real-World Applications</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {concept.applications.map((app, index) => (
            <Badge key={index} variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
              {app}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl bg-white rounded-lg max-h-[95vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl font-bold">{concept.name}</h2>
                <p className="text-sm text-gray-600">{concept.description}</p>
              </div>
            </div>
            <Button onClick={() => setIsFullscreen(false)} variant="outline" size="sm">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6">
            {content}
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
              <Zap className="w-5 h-5 text-blue-500" />
              {concept.name}
            </CardTitle>
            <CardDescription>{concept.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {concept.category.replace('_', ' ')}
            </Badge>
            <Button onClick={toggleFullscreen} variant="outline" size="sm">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default PhysicsVisualization;