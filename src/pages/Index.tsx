
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MoleculeViewer from '@/components/MoleculeViewer';
import SymmetryControls from '@/components/SymmetryControls';
import ProjectionViewer from '@/components/ProjectionViewer';
import { molecules } from '@/data/molecules';
import { Atom, Eye, RotateCcw, Zap } from 'lucide-react';

const Index = () => {
  const [selectedMolecule, setSelectedMolecule] = useState(molecules[0]);
  const [showSymmetryElements, setShowSymmetryElements] = useState({
    planes: false,
    center: false,
    axes: false
  });
  const [currentProjection, setCurrentProjection] = useState('3d');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Organic Chemistry 3D</h1>
                <p className="text-sm text-gray-600">Interactive Molecular Symmetry & Projections</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Educational Tool
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Molecule Selection Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Molecules
                </CardTitle>
                <CardDescription>
                  Select a molecule to explore its symmetry elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {molecules.map((molecule) => (
                  <Button
                    key={molecule.id}
                    variant={selectedMolecule.id === molecule.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedMolecule(molecule)}
                  >
                    <span className="text-lg mr-2">{molecule.formula}</span>
                    {molecule.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Symmetry Controls */}
            <SymmetryControls 
              showSymmetryElements={showSymmetryElements}
              setShowSymmetryElements={setShowSymmetryElements}
              molecule={selectedMolecule}
            />
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-green-500" />
                      {selectedMolecule.name} - {selectedMolecule.formula}
                    </CardTitle>
                    <CardDescription>
                      Point Group: <Badge variant="secondary">{selectedMolecule.pointGroup}</Badge>
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset View
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-full p-0">
                <Tabs value={currentProjection} onValueChange={setCurrentProjection} className="h-full">
                  <TabsList className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm">
                    <TabsTrigger value="3d">3D View</TabsTrigger>
                    <TabsTrigger value="newman">Newman</TabsTrigger>
                    <TabsTrigger value="fischer">Fischer</TabsTrigger>
                    <TabsTrigger value="wedge">Wedge-Dash</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="3d" className="h-full mt-0">
                    <div className="h-full bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg overflow-hidden">
                      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[10, 10, 5]} intensity={1} />
                        <MoleculeViewer 
                          molecule={selectedMolecule} 
                          showSymmetryElements={showSymmetryElements}
                        />
                        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                      </Canvas>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="newman" className="h-full mt-0">
                    <ProjectionViewer 
                      molecule={selectedMolecule} 
                      projectionType="newman"
                    />
                  </TabsContent>
                  
                  <TabsContent value="fischer" className="h-full mt-0">
                    <ProjectionViewer 
                      molecule={selectedMolecule} 
                      projectionType="fischer"
                    />
                  </TabsContent>
                  
                  <TabsContent value="wedge" className="h-full mt-0">
                    <ProjectionViewer 
                      molecule={selectedMolecule} 
                      projectionType="wedge"
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Information */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Symmetry Elements in {selectedMolecule.name}</CardTitle>
              <CardDescription>
                Understanding the symmetry properties of this molecule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Planes of Symmetry</h4>
                  <p className="text-sm text-blue-700">
                    {selectedMolecule.symmetryElements.planes.length} plane(s) found
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Mirror planes that divide the molecule into identical halves
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Rotation Axes</h4>
                  <p className="text-sm text-green-700">
                    {selectedMolecule.symmetryElements.axes.length} axis/axes found
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Rotational symmetry around specific axes
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Center of Symmetry</h4>
                  <p className="text-sm text-purple-700">
                    {selectedMolecule.symmetryElements.center ? 'Present' : 'Absent'}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    Point through which inversion produces identical structure
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
