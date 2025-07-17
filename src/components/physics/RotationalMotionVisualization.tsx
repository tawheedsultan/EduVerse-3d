import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Vector3, Euler } from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface RotationalMotionProps {
  concept: {
    id: string;
    name: string;
    description: string;
    theory: string;
  };
}

const RotatingDisk = ({ 
  angularVelocity, 
  momentOfInertia, 
  isPlaying, 
  showAngularMomentum 
}: { 
  angularVelocity: number, 
  momentOfInertia: number, 
  isPlaying: boolean,
  showAngularMomentum: boolean 
}) => {
  const diskRef = useRef<any>();
  const [rotation, setRotation] = useState(0);
  
  useFrame((state, delta) => {
    if (isPlaying && diskRef.current) {
      const newRotation = rotation + angularVelocity * delta;
      setRotation(newRotation);
      diskRef.current.rotation.z = newRotation;
    }
  });

  const angularMomentum = momentOfInertia * angularVelocity;
  const diskRadius = Math.sqrt(momentOfInertia / 2); // Simplified relationship

  return (
    <group>
      {/* Rotating disk */}
      <mesh ref={diskRef}>
        <cylinderGeometry args={[diskRadius, diskRadius, 0.2, 32]} />
        <meshPhongMaterial 
          color="#3b82f6" 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      
      {/* Rotation axis */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 4]} />
        <meshPhongMaterial color="#64748b" />
      </mesh>
      
      {/* Angular velocity indicator */}
      {isPlaying && (
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1]} />
          <meshPhongMaterial color="#ef4444" />
        </mesh>
      )}
      
      {/* Angular momentum vector */}
      {showAngularMomentum && (
        <group position={[0, 0, 2]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, Math.abs(angularMomentum) * 0.5]} />
            <meshPhongMaterial color="#10b981" />
          </mesh>
          <Html>
            <div className="text-xs bg-green-500/80 text-white px-2 py-1 rounded">
              L = {angularMomentum.toFixed(2)}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
};

const RollingObject = ({ 
  velocity, 
  radius, 
  isPlaying,
  showTrail 
}: { 
  velocity: number, 
  radius: number, 
  isPlaying: boolean,
  showTrail: boolean 
}) => {
  const objectRef = useRef<any>();
  const [position, setPosition] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [trail, setTrail] = useState<Vector3[]>([]);
  
  useFrame((state, delta) => {
    if (isPlaying && objectRef.current) {
      const newPosition = position + velocity * delta;
      const newRotation = rotation + (velocity / radius) * delta;
      
      setPosition(newPosition);
      setRotation(newRotation);
      
      objectRef.current.position.x = newPosition;
      objectRef.current.rotation.z = newRotation;
      
      // Add to trail
      if (showTrail) {
        const newPoint = new Vector3(newPosition, -radius - 0.1, 0);
        setTrail(prev => [...prev.slice(-20), newPoint]);
      }
    }
  });

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, -radius - 0.5, 0]}>
        <boxGeometry args={[20, 0.2, 4]} />
        <meshPhongMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Rolling object */}
      <mesh ref={objectRef} position={[position, 0, 0]}>
        <sphereGeometry args={[radius]} />
        <meshPhongMaterial color="#f59e0b" />
      </mesh>
      
      {/* Trail */}
      {showTrail && trail.length > 1 && (
        <group>
          {trail.map((point, index) => (
            <mesh key={index} position={point}>
              <sphereGeometry args={[0.02]} />
              <meshPhongMaterial color="#ef4444" />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Velocity indicator */}
      {isPlaying && (
        <Html position={[position, 1, 0]}>
          <div className="text-xs bg-orange-500/80 text-white px-2 py-1 rounded">
            v = {velocity.toFixed(2)}
          </div>
        </Html>
      )}
    </group>
  );
};

const TorqueVisualization = ({ 
  force, 
  leverArm, 
  angle, 
  isPlaying 
}: { 
  force: number, 
  leverArm: number, 
  angle: number, 
  isPlaying: boolean 
}) => {
  const leverRef = useRef<any>();
  const [leverRotation, setLeverRotation] = useState(0);
  
  useFrame((state, delta) => {
    if (isPlaying && leverRef.current) {
      const torque = force * leverArm * Math.sin(angle * Math.PI / 180);
      const newRotation = leverRotation + torque * delta * 0.1;
      setLeverRotation(newRotation);
      leverRef.current.rotation.z = newRotation;
    }
  });

  const torque = force * leverArm * Math.sin(angle * Math.PI / 180);
  const forceVector = new Vector3(
    Math.cos(angle * Math.PI / 180) * force * 0.5,
    Math.sin(angle * Math.PI / 180) * force * 0.5,
    0
  );

  return (
    <group>
      {/* Pivot point */}
      <mesh>
        <sphereGeometry args={[0.1]} />
        <meshPhongMaterial color="#64748b" />
      </mesh>
      
      {/* Lever arm */}
      <mesh ref={leverRef}>
        <cylinderGeometry args={[0.05, 0.05, leverArm * 2]} />
        <meshPhongMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Force vector */}
      <group position={[leverArm, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, force * 0.5]} />
          <meshPhongMaterial color="#ef4444" />
        </mesh>
        <Html>
          <div className="text-xs bg-red-500/80 text-white px-2 py-1 rounded">
            F = {force.toFixed(1)}N
          </div>
        </Html>
      </group>
      
      {/* Torque indicator */}
      <Html position={[0, 2, 0]}>
        <div className="text-lg bg-purple-500/80 text-white px-3 py-2 rounded">
          τ = {torque.toFixed(2)} N⋅m
        </div>
      </Html>
    </group>
  );
};

const RotationalMotionVisualization = ({ concept }: RotationalMotionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [angularVelocity, setAngularVelocity] = useState([2]);
  const [momentOfInertia, setMomentOfInertia] = useState([1]);
  const [showAngularMomentum, setShowAngularMomentum] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  
  // Rolling motion states
  const [velocity, setVelocity] = useState([3]);
  const [radius, setRadius] = useState([0.5]);
  
  // Torque states
  const [force, setForce] = useState([5]);
  const [leverArm, setLeverArm] = useState([2]);
  const [angle, setAngle] = useState([90]);

  const reset = () => {
    setIsPlaying(false);
  };

  const renderVisualization = () => {
    switch (concept.id) {
      case 'angular-momentum':
      case 'moment-of-inertia':
        return (
          <RotatingDisk 
            angularVelocity={angularVelocity[0]} 
            momentOfInertia={momentOfInertia[0]}
            isPlaying={isPlaying}
            showAngularMomentum={showAngularMomentum}
          />
        );
      case 'rolling-motion':
        return (
          <RollingObject 
            velocity={velocity[0]}
            radius={radius[0]}
            isPlaying={isPlaying}
            showTrail={showTrail}
          />
        );
      case 'torque-rotation':
        return (
          <TorqueVisualization 
            force={force[0]}
            leverArm={leverArm[0]}
            angle={angle[0]}
            isPlaying={isPlaying}
          />
        );
      default:
        return null;
    }
  };

  const renderControls = () => {
    switch (concept.id) {
      case 'angular-momentum':
      case 'moment-of-inertia':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Angular Velocity: {angularVelocity[0]} rad/s</label>
              <Slider
                value={angularVelocity}
                onValueChange={setAngularVelocity}
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Moment of Inertia: {momentOfInertia[0]} kg⋅m²</label>
              <Slider
                value={momentOfInertia}
                onValueChange={setMomentOfInertia}
                max={5}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'rolling-motion':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Velocity: {velocity[0]} m/s</label>
              <Slider
                value={velocity}
                onValueChange={setVelocity}
                max={10}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Radius: {radius[0]} m</label>
              <Slider
                value={radius}
                onValueChange={setRadius}
                max={2}
                min={0.2}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        );
      case 'torque-rotation':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Force: {force[0]} N</label>
              <Slider
                value={force}
                onValueChange={setForce}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lever Arm: {leverArm[0]} m</label>
              <Slider
                value={leverArm}
                onValueChange={setLeverArm}
                max={5}
                min={0.5}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Angle: {angle[0]}°</label>
              <Slider
                value={angle}
                onValueChange={setAngle}
                max={180}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌀 {concept.name}
        </CardTitle>
        <CardDescription>{concept.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D Canvas */}
        <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, 10, 10]} intensity={0.5} />
            
            {renderVisualization()}
            
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex gap-4 items-center flex-wrap">
            <Button 
              onClick={() => setIsPlaying(!isPlaying)}
              variant={isPlaying ? "secondary" : "default"}
              size="sm"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Start'}
            </Button>
            
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            {(concept.id === 'angular-momentum' || concept.id === 'moment-of-inertia') && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="angular-momentum"
                  checked={showAngularMomentum}
                  onCheckedChange={setShowAngularMomentum}
                />
                <label htmlFor="angular-momentum" className="text-sm font-medium">
                  Show Angular Momentum
                </label>
              </div>
            )}
            
            {concept.id === 'rolling-motion' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="trail"
                  checked={showTrail}
                  onCheckedChange={setShowTrail}
                />
                <label htmlFor="trail" className="text-sm font-medium">
                  Show Trail
                </label>
              </div>
            )}
          </div>

          {renderControls()}
        </div>

        {/* Theory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Theory</h4>
          <p className="text-sm text-blue-700">{concept.theory}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RotationalMotionVisualization;