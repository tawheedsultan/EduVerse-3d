import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface Charge {
  position: Vector3;
  magnitude: number;
  color: string;
}

interface ElectrostaticsProps {
  concept: {
    id: string;
    name: string;
    description: string;
    theory: string;
  };
}

const ElectricFieldLines = ({ charges }: { charges: Charge[] }) => {
  const linesRef = useRef<any>();
  
  useFrame(() => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={linesRef}>
      {charges.map((charge, index) => (
        <group key={index}>
          {/* Field lines radiating from each charge */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const direction = charge.magnitude > 0 ? 1 : -1;
            return (
              <group key={i}>
                {Array.from({ length: 20 }, (_, j) => {
                  const distance = 0.2 + j * 0.15;
                  const x = charge.position.x + Math.cos(angle) * distance * direction;
                  const y = charge.position.y + Math.sin(angle) * distance * direction;
                  const intensity = Math.max(0.1, 1 / (distance * distance));
                  
                  return (
                    <mesh key={j} position={[x, y, 0]}>
                      <sphereGeometry args={[0.02]} />
                      <meshBasicMaterial 
                        color={charge.color} 
                        opacity={intensity * 0.6} 
                        transparent 
                      />
                    </mesh>
                  );
                })}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
};

const ChargeVisualization = ({ charges, onChargeMove }: { 
  charges: Charge[], 
  onChargeMove: (index: number, position: Vector3) => void 
}) => {
  return (
    <>
      {charges.map((charge, index) => (
        <group key={index} position={charge.position}>
          <mesh>
            <sphereGeometry args={[0.3]} />
            <meshPhongMaterial 
              color={charge.color} 
              emissive={charge.color} 
              emissiveIntensity={0.2}
            />
          </mesh>
          <Text
            position={[0, 0, 0.4]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {charge.magnitude > 0 ? '+' : '-'}
          </Text>
          <Html>
            <div className="text-xs bg-black/50 text-white px-2 py-1 rounded">
              {Math.abs(charge.magnitude).toFixed(1)}μC
            </div>
          </Html>
        </group>
      ))}
    </>
  );
};

const ElectrostaticsVisualization = ({ concept }: ElectrostaticsProps) => {
  const [charges, setCharges] = useState<Charge[]>([
    { position: new Vector3(-2, 0, 0), magnitude: 1, color: '#ef4444' },
    { position: new Vector3(2, 0, 0), magnitude: -1, color: '#3b82f6' }
  ]);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([0.5]);

  const addCharge = (positive: boolean) => {
    const newCharge: Charge = {
      position: new Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        0
      ),
      magnitude: positive ? 1 : -1,
      color: positive ? '#ef4444' : '#3b82f6'
    };
    setCharges([...charges, newCharge]);
  };

  const clearCharges = () => {
    setCharges([]);
  };

  const resetCharges = () => {
    setCharges([
      { position: new Vector3(-2, 0, 0), magnitude: 1, color: '#ef4444' },
      { position: new Vector3(2, 0, 0), magnitude: -1, color: '#3b82f6' }
    ]);
  };

  const handleChargeMove = (index: number, position: Vector3) => {
    const newCharges = [...charges];
    newCharges[index].position = position;
    setCharges(newCharges);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚡ {concept.name}
        </CardTitle>
        <CardDescription>{concept.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            
            <ChargeVisualization 
              charges={charges} 
              onChargeMove={handleChargeMove}
            />
            
            {showFieldLines && <ElectricFieldLines charges={charges} />}
            
            {/* Grid for reference */}
            <gridHelper args={[10, 10, '#333333', '#333333']} rotation={[Math.PI / 2, 0, 0]} />
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => addCharge(true)} variant="outline" className="text-red-500 border-red-500">
              Add Positive Charge (+)
            </Button>
            <Button onClick={() => addCharge(false)} variant="outline" className="text-blue-500 border-blue-500">
              Add Negative Charge (-)
            </Button>
            <Button onClick={() => setShowFieldLines(!showFieldLines)} variant="outline">
              {showFieldLines ? 'Hide' : 'Show'} Field Lines
            </Button>
            <Button onClick={resetCharges} variant="outline">
              Reset
            </Button>
            <Button onClick={clearCharges} variant="outline">
              Clear All
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Animation Speed</label>
            <Slider
              value={animationSpeed}
              onValueChange={setAnimationSpeed}
              max={2}
              min={0.1}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Theory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Theory</h4>
          <p className="text-sm text-blue-700">{concept.theory}</p>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <li>Add positive (red) and negative (blue) charges using the buttons</li>
            <li>Observe how electric field lines emanate from positive charges and converge on negative charges</li>
            <li>Use mouse to rotate, zoom, and pan around the 3D visualization</li>
            <li>Toggle field lines on/off to better see charge interactions</li>
            <li>Notice how field line density indicates field strength</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectrostaticsVisualization;