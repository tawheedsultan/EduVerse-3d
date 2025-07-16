import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { Vector3, Raycaster, Vector2 } from 'three';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface Charge {
  id: string;
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

const DraggableCharge = ({ 
  charge, 
  index, 
  onChargeMove, 
  onChargeMagnitudeChange 
}: { 
  charge: Charge, 
  index: number, 
  onChargeMove: (index: number, position: Vector3) => void,
  onChargeMagnitudeChange: (index: number, magnitude: number) => void
}) => {
  const meshRef = useRef<any>();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { camera, gl } = useThree();

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    gl.domElement.style.cursor = 'grabbing';
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging) return;
    e.stopPropagation();
    
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    
    const raycaster = new Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const newPosition = new Vector3();
    raycaster.ray.intersectPlane(plane, newPosition);
    
    if (newPosition) {
      onChargeMove(index, newPosition);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    gl.domElement.style.cursor = 'default';
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging]);

  return (
    <group position={charge.position}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <sphereGeometry args={[0.3]} />
        <meshPhongMaterial 
          color={charge.color} 
          emissive={charge.color} 
          emissiveIntensity={hovered ? 0.4 : 0.2}
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
        <div className="text-xs bg-black/50 text-white px-2 py-1 rounded cursor-pointer">
          {Math.abs(charge.magnitude).toFixed(1)}μC
        </div>
      </Html>
    </group>
  );
};

const ForceVectors = ({ charges }: { charges: Charge[] }) => {
  const k = 8.99e9; // Coulomb's constant (simplified for visualization)
  
  return (
    <>
      {charges.map((charge1, i) => 
        charges.map((charge2, j) => {
          if (i >= j) return null;
          
          const distance = charge1.position.distanceTo(charge2.position);
          if (distance < 0.1) return null;
          
          const force = (k * Math.abs(charge1.magnitude * charge2.magnitude)) / (distance * distance);
          const direction = new Vector3().subVectors(charge1.position, charge2.position).normalize();
          
          // Force on charge1 from charge2
          const forceDirection1 = charge1.magnitude * charge2.magnitude < 0 ? 
            direction.clone().multiplyScalar(-1) : direction.clone();
          
          // Force on charge2 from charge1  
          const forceDirection2 = charge1.magnitude * charge2.magnitude < 0 ? 
            direction.clone() : direction.clone().multiplyScalar(-1);
          
          const forceScale = Math.min(force / 10, 2); // Scale for visualization
          
          return (
            <group key={`${i}-${j}`}>
              {/* Force vector on charge1 */}
              <Line
                points={[
                  charge1.position,
                  new Vector3().addVectors(charge1.position, forceDirection1.multiplyScalar(forceScale))
                ]}
                color={charge1.magnitude * charge2.magnitude < 0 ? "#00ff00" : "#ff0000"}
                lineWidth={3}
              />
              
              {/* Force vector on charge2 */}
              <Line
                points={[
                  charge2.position,
                  new Vector3().addVectors(charge2.position, forceDirection2.multiplyScalar(forceScale))
                ]}
                color={charge1.magnitude * charge2.magnitude < 0 ? "#00ff00" : "#ff0000"}
                lineWidth={3}
              />
            </group>
          );
        })
      )}
    </>
  );
};

const ElectricFieldLines = ({ charges, showFieldLines }: { charges: Charge[], showFieldLines: boolean }) => {
  if (!showFieldLines) return null;
  
  const fieldLines = [];
  
  // Generate field lines from positive charges
  charges.forEach((charge, chargeIndex) => {
    if (charge.magnitude <= 0) return;
    
    const numLines = Math.abs(charge.magnitude) * 8;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const points = [];
      
      let currentPos = new Vector3(
        charge.position.x + Math.cos(angle) * 0.4,
        charge.position.y + Math.sin(angle) * 0.4,
        charge.position.z
      );
      
      points.push(currentPos.clone());
      
      // Trace field line
      for (let step = 0; step < 30; step++) {
        const field = new Vector3(0, 0, 0);
        
        charges.forEach((otherCharge) => {
          const dist = currentPos.distanceTo(otherCharge.position);
          if (dist < 0.1) return;
          
          const direction = new Vector3().subVectors(currentPos, otherCharge.position).normalize();
          const fieldStrength = otherCharge.magnitude / (dist * dist);
          field.add(direction.multiplyScalar(fieldStrength));
        });
        
        if (field.length() < 0.001) break;
        
        currentPos.add(field.normalize().multiplyScalar(0.1));
        points.push(currentPos.clone());
        
        if (currentPos.length() > 6) break;
      }
      
      if (points.length > 1) {
        fieldLines.push(
          <Line
            key={`field-${chargeIndex}-${i}`}
            points={points}
            color="#ffff00"
            lineWidth={1}
            opacity={0.7}
            transparent
          />
        );
      }
    }
  });
  
  return <group>{fieldLines}</group>;
};

const RealTimeCalculations = ({ charges }: { charges: Charge[] }) => {
  const k = 8.99e9; // Coulomb's constant (simplified for visualization)
  
  const calculations = [];
  
  for (let i = 0; i < charges.length; i++) {
    for (let j = i + 1; j < charges.length; j++) {
      const charge1 = charges[i];
      const charge2 = charges[j];
      const distance = charge1.position.distanceTo(charge2.position);
      
      if (distance > 0.1) {
        const force = (k * Math.abs(charge1.magnitude * charge2.magnitude)) / (distance * distance);
        const isRepulsive = charge1.magnitude * charge2.magnitude > 0;
        
        calculations.push({
          charges: [charge1, charge2],
          distance: distance.toFixed(2),
          force: force.toFixed(2),
          isRepulsive
        });
      }
    }
  }
  
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-800">Real-time Calculations</h4>
      {calculations.map((calc, index) => (
        <div key={index} className="text-sm bg-gray-100 p-2 rounded">
          <div className="flex justify-between items-center">
            <span>Charges: {calc.charges[0].magnitude > 0 ? '+' : '-'}{Math.abs(calc.charges[0].magnitude)} & {calc.charges[1].magnitude > 0 ? '+' : '-'}{Math.abs(calc.charges[1].magnitude)}</span>
            <span className={calc.isRepulsive ? 'text-red-500' : 'text-green-500'}>
              {calc.isRepulsive ? 'Repulsive' : 'Attractive'}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            Distance: {calc.distance}m | Force: {calc.force}N
          </div>
        </div>
      ))}
    </div>
  );
};

const ElectrostaticsVisualization = ({ concept }: ElectrostaticsProps) => {
  const [charges, setCharges] = useState<Charge[]>([
    { id: '1', position: new Vector3(-2, 0, 0), magnitude: 1, color: '#ef4444' },
    { id: '2', position: new Vector3(2, 0, 0), magnitude: -1, color: '#3b82f6' }
  ]);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [showForceVectors, setShowForceVectors] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState([0.5]);

  const addCharge = (positive: boolean) => {
    const newCharge: Charge = {
      id: `charge-${Date.now()}`,
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
      { id: '1', position: new Vector3(-2, 0, 0), magnitude: 1, color: '#ef4444' },
      { id: '2', position: new Vector3(2, 0, 0), magnitude: -1, color: '#3b82f6' }
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
            
            {/* Draggable Charges */}
            {charges.map((charge, index) => (
              <DraggableCharge
                key={charge.id}
                charge={charge}
                index={index}
                onChargeMove={handleChargeMove}
                onChargeMagnitudeChange={(index, magnitude) => {
                  const newCharges = [...charges];
                  newCharges[index].magnitude = magnitude;
                  newCharges[index].color = magnitude > 0 ? '#ef4444' : '#3b82f6';
                  setCharges(newCharges);
                }}
              />
            ))}
            
            {/* Force Vectors */}
            {showForceVectors && <ForceVectors charges={charges} />}
            
            {/* Electric Field Lines */}
            <ElectricFieldLines charges={charges} showFieldLines={showFieldLines} />
            
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
            <Button onClick={resetCharges} variant="outline">
              Reset
            </Button>
            <Button onClick={clearCharges} variant="outline">
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="field-lines"
                checked={showFieldLines}
                onCheckedChange={setShowFieldLines}
              />
              <label htmlFor="field-lines" className="text-sm font-medium">
                Show Field Lines
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="force-vectors"
                checked={showForceVectors}
                onCheckedChange={setShowForceVectors}
              />
              <label htmlFor="force-vectors" className="text-sm font-medium">
                Show Force Vectors
              </label>
            </div>
          </div>
        </div>

        {/* Real-time Calculations */}
        <RealTimeCalculations charges={charges} />

        {/* Legend */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Positive charge (+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Negative charge (-)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-yellow-500"></div>
              <span>Electric field lines</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-green-500"></div>
              <span>Attractive force</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-red-500"></div>
              <span>Repulsive force</span>
            </div>
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
            <li><strong>Drag charges:</strong> Click and drag any charge to move it around the field</li>
            <li><strong>Add charges:</strong> Use the buttons to add positive (red) and negative (blue) charges</li>
            <li><strong>Observe forces:</strong> Watch how force vectors (arrows) show attraction (green) or repulsion (red)</li>
            <li><strong>Field lines:</strong> Electric field lines show the direction and strength of the electric field</li>
            <li><strong>Real-time calculations:</strong> See live force and distance calculations between charges</li>
            <li><strong>3D navigation:</strong> Use mouse to rotate, zoom, and pan around the visualization</li>
            <li><strong>Interactive controls:</strong> Toggle field lines and force vectors on/off</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElectrostaticsVisualization;