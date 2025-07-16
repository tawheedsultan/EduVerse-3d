import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface CurrentElectricityProps {
  concept: {
    id: string;
    name: string;
    description: string;
    theory: string;
  };
}

const ElectronFlow = ({ 
  isOn, 
  speed, 
  showConventional,
  current
}: { 
  isOn: boolean, 
  speed: number, 
  showConventional: boolean,
  current: number
}) => {
  const electronsRef = useRef<any>();
  const conventionalRef = useRef<any>();
  
  useFrame((state) => {
    if (isOn && electronsRef.current) {
      // Electrons move from negative to positive (opposite to conventional current)
      electronsRef.current.children.forEach((electron: any, index: number) => {
        electron.position.x += speed * 0.02 * current;
        if (electron.position.x > 4) {
          electron.position.x = -4;
        }
      });
    }
    
    if (isOn && showConventional && conventionalRef.current) {
      // Conventional current flows from positive to negative
      conventionalRef.current.children.forEach((particle: any, index: number) => {
        particle.position.x -= speed * 0.02 * current;
        if (particle.position.x < -4) {
          particle.position.x = 4;
        }
      });
    }
  });

  const electronDensity = Math.max(10, Math.min(30, current * 5));
  const electronSize = Math.max(0.03, Math.min(0.08, current * 0.02));

  return (
    <>
      {/* Electrons (blue, moving right) */}
      <group ref={electronsRef}>
        {Array.from({ length: Math.floor(electronDensity) }, (_, i) => (
          <mesh key={i} position={[-4 + i * (8 / electronDensity), 0.1, 0]}>
            <sphereGeometry args={[electronSize]} />
            <meshPhongMaterial 
              color="#3b82f6" 
              emissive="#3b82f6" 
              emissiveIntensity={0.3 + current * 0.1} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Conventional current (red, moving left) */}
      {showConventional && (
        <group ref={conventionalRef}>
          {Array.from({ length: Math.floor(electronDensity * 0.7) }, (_, i) => (
            <mesh key={i} position={[4 - i * (8 / (electronDensity * 0.7)), -0.1, 0]}>
              <sphereGeometry args={[electronSize * 0.7]} />
              <meshPhongMaterial 
                color="#ef4444" 
                emissive="#ef4444" 
                emissiveIntensity={0.3 + current * 0.1} 
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};

const Circuit = ({ 
  voltage, 
  resistance, 
  isOn 
}: { 
  voltage: number, 
  resistance: number, 
  isOn: boolean 
}) => {
  const current = voltage / resistance;
  
  return (
    <>
      {/* Wire */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 8]} />
        <meshPhongMaterial color="#ffd700" />
      </mesh>
      
      {/* Battery (left side) */}
      <group position={[-3.5, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.5]} />
          <meshPhongMaterial color="#000000" />
        </mesh>
        <Html>
          <div className="text-xs bg-black/50 text-white px-2 py-1 rounded">
            {voltage}V
          </div>
        </Html>
      </group>
      
      {/* Resistor (right side) */}
      <group position={[3.5, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.6, 0.3, 0.3]} />
          <meshPhongMaterial color="#8b4513" />
        </mesh>
        <Html>
          <div className="text-xs bg-black/50 text-white px-2 py-1 rounded">
            {resistance}Ω
          </div>
        </Html>
      </group>
      
      {/* Current indicator */}
      {isOn && (
        <Html position={[0, 1, 0]}>
          <div className="text-lg font-bold text-green-500 bg-black/50 px-3 py-2 rounded">
            I = {current.toFixed(2)}A
          </div>
        </Html>
      )}
      
      {/* Voltage labels */}
      <Html position={[-3.5, -1, 0]}>
        <div className="text-sm text-red-500 font-bold">+</div>
      </Html>
      <Html position={[3.5, -1, 0]}>
        <div className="text-sm text-blue-500 font-bold">-</div>
      </Html>
    </>
  );
};

const MagneticField = ({ 
  showMagneticField, 
  current 
}: { 
  showMagneticField: boolean, 
  current: number 
}) => {
  if (!showMagneticField || current === 0) return null;
  
  return (
    <>
      {/* Magnetic field lines around the conductor */}
      {Array.from({ length: 8 }, (_, i) => {
        const radius = 0.5 + i * 0.3;
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const angle = (j / 64) * Math.PI * 2;
          points.push(new Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0
          ));
        }
        
        return (
          <Line
            key={i}
            points={points}
            color="#00ff00"
            lineWidth={2}
            opacity={0.6}
            transparent
          />
        );
      })}
    </>
  );
};

const CurrentElectricityVisualization = ({ concept }: CurrentElectricityProps) => {
  const [isCircuitOn, setIsCircuitOn] = useState(false);
  const [voltage, setVoltage] = useState([12]);
  const [resistance, setResistance] = useState([4]);
  const [currentSpeed, setCurrentSpeed] = useState([1]);
  const [showConventional, setShowConventional] = useState(true);
  const [showMagneticField, setShowMagneticField] = useState(false);

  const current = voltage[0] / resistance[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔌 {concept.name}
        </CardTitle>
        <CardDescription>{concept.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 3, 8], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, 10, 10]} intensity={0.5} />
            
            <Circuit 
              voltage={voltage[0]} 
              resistance={resistance[0]} 
              isOn={isCircuitOn}
            />
            
            {isCircuitOn && (
              <ElectronFlow 
                isOn={isCircuitOn} 
                speed={currentSpeed[0]} 
                showConventional={showConventional}
                current={current}
              />
            )}
            
            <MagneticField 
              showMagneticField={showMagneticField} 
              current={isCircuitOn ? current : 0}
            />
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center space-x-2">
              <Switch
                id="circuit-power"
                checked={isCircuitOn}
                onCheckedChange={setIsCircuitOn}
              />
              <label htmlFor="circuit-power" className="text-sm font-medium">
                Circuit Power {isCircuitOn ? 'ON' : 'OFF'}
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="conventional-current"
                checked={showConventional}
                onCheckedChange={setShowConventional}
              />
              <label htmlFor="conventional-current" className="text-sm font-medium">
                Show Conventional Current
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="magnetic-field"
                checked={showMagneticField}
                onCheckedChange={setShowMagneticField}
              />
              <label htmlFor="magnetic-field" className="text-sm font-medium">
                Show Magnetic Field
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Voltage: {voltage[0]}V</label>
              <Slider
                value={voltage}
                onValueChange={setVoltage}
                max={24}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Resistance: {resistance[0]}Ω</label>
              <Slider
                value={resistance}
                onValueChange={setResistance}
                max={20}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Animation Speed: {currentSpeed[0]}x</label>
              <Slider
                value={currentSpeed}
                onValueChange={setCurrentSpeed}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Ohm's Law Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Ohm's Law Calculation</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">V = {voltage[0]}V</div>
                <div className="text-sm text-gray-600">Voltage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">I = {current.toFixed(2)}A</div>
                <div className="text-sm text-gray-600">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">R = {resistance[0]}Ω</div>
                <div className="text-sm text-gray-600">Resistance</div>
              </div>
            </div>
            <div className="text-center mt-2 text-lg font-semibold">
              V = I × R → {voltage[0]} = {current.toFixed(2)} × {resistance[0]}
            </div>
          </div>
        </div>

        {/* Theory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Theory</h4>
          <p className="text-sm text-blue-700">{concept.theory}</p>
        </div>

        {/* Legend */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Electrons (actual flow)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Conventional current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-yellow-500"></div>
              <span>Conductor (wire)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-green-500"></div>
              <span>Magnetic field lines</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentElectricityVisualization;