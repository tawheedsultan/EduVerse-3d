import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Battery, Zap } from 'lucide-react';

interface CircuitComponent {
  id: string;
  type: 'resistor' | 'battery';
  value: number;
  position: Vector3;
  connection: 'series' | 'parallel';
}

interface CurrentElectricityProps {
  concept: {
    id: string;
    name: string;
    description: string;
    theory: string;
  };
}

interface WirePoint {
  id: string;
  position: Vector3;
  connections: string[];
}

const ElectronFlow = ({ 
  isOn, 
  speed, 
  showConventional,
  current,
  wirePoints
}: { 
  isOn: boolean, 
  speed: number, 
  showConventional: boolean,
  current: number,
  wirePoints: WirePoint[]
}) => {
  const electronsRef = useRef<any>();
  const conventionalRef = useRef<any>();
  
  useFrame((state) => {
    if (isOn && electronsRef.current && wirePoints.length >= 4) {
      const time = state.clock.elapsedTime;
      
      electronsRef.current.children.forEach((electron: any, index: number) => {
        // Calculate progress along the circuit path (0 to 1)
        const baseProgress = (time * speed * 0.4 + index * 0.15) % 1;
        const position = getPositionOnCircuitPath(baseProgress, wirePoints);
        
        electron.position.copy(position);
      });
    }
    
    if (isOn && showConventional && conventionalRef.current && wirePoints.length >= 4) {
      const time = state.clock.elapsedTime;
      
      conventionalRef.current.children.forEach((particle: any, index: number) => {
        // Conventional current moves in opposite direction
        const baseProgress = (-time * speed * 0.4 - index * 0.15) % 1;
        const normalizedProgress = baseProgress < 0 ? 1 + baseProgress : baseProgress;
        const position = getPositionOnCircuitPath(normalizedProgress, wirePoints);
        
        particle.position.copy(position);
      });
    }
  });

  // Get position along the circuit path
  const getPositionOnCircuitPath = (progress: number, points: WirePoint[]): Vector3 => {
    if (points.length < 4) return new Vector3(0, 0, 0);
    
    // Create a closed loop path: top-left -> top-right -> bottom-right -> bottom-left -> back to top-left
    const pathPoints = [
      points[0], // top-left
      points[1], // top-right  
      points[2], // bottom-right
      points[3], // bottom-left
      points[0]  // back to top-left to close the loop
    ];
    
    const totalSegments = pathPoints.length - 1;
    const segmentProgress = progress * totalSegments;
    const currentSegment = Math.floor(segmentProgress) % totalSegments;
    const localProgress = segmentProgress - Math.floor(segmentProgress);
    
    const startPoint = pathPoints[currentSegment];
    const endPoint = pathPoints[(currentSegment + 1) % pathPoints.length];
    
    return startPoint.position.clone().lerp(endPoint.position, localProgress);
  };

  const electronDensity = Math.max(15, Math.min(40, current * 8));
  const electronSize = Math.max(0.04, Math.min(0.1, current * 0.025));

  return (
    <>
      {/* Electron flow (bright red particles along circuit path) */}
      <group ref={electronsRef}>
        {Array.from({ length: Math.floor(electronDensity) }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[electronSize]} />
            <meshPhongMaterial 
              color="#ff0000" 
              emissive="#ff3333" 
              emissiveIntensity={0.8 + current * 0.3} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Additional bright red trail effect for visibility */}
      <group ref={conventionalRef}>
        {Array.from({ length: Math.floor(electronDensity * 0.3) }, (_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[electronSize * 1.5]} />
            <meshPhongMaterial 
              color="#ff6666" 
              emissive="#ff0000" 
              emissiveIntensity={0.6 + current * 0.2}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))}
      </group>
    </>
  );
};

const BatterySymbol = ({ value, position }: { value: number, position: Vector3 }) => {
  return (
    <group position={position}>
      {/* 3D Battery body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8]} />
        <meshPhongMaterial color="#1a1a1a" emissive="#333333" emissiveIntensity={0.2} />
      </mesh>
      {/* Positive terminal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2]} />
        <meshPhongMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.4} />
      </mesh>
      {/* Negative terminal */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.15]} />
        <meshPhongMaterial color="#4444ff" emissive="#4444ff" emissiveIntensity={0.4} />
      </mesh>
      {/* + symbol */}
      <Html position={[0.3, 0.5, 0]}>
        <div className="text-lg text-red-400 font-bold">+</div>
      </Html>
      {/* - symbol */}
      <Html position={[0.3, -0.5, 0]}>
        <div className="text-lg text-blue-400 font-bold">-</div>
      </Html>
      {/* Value label */}
      <Html position={[0, -1, 0]}>
        <div className="text-sm bg-black/80 text-green-400 px-3 py-1 rounded font-bold">
          {value}V
        </div>
      </Html>
    </group>
  );
};

const ResistorSymbol = ({ value, position }: { value: number, position: Vector3 }) => {
  return (
    <group position={position}>
      {/* 3D Resistor body - cylindrical */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.6]} />
        <meshPhongMaterial color="#8B4513" emissive="#CD853F" emissiveIntensity={0.3} />
      </mesh>
      {/* Resistor bands (color coding) */}
      <mesh position={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05]} />
        <meshPhongMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05]} />
        <meshPhongMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05]} />
        <meshPhongMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.13, 0.13, 0.05]} />
        <meshPhongMaterial color="#0088ff" emissive="#0088ff" emissiveIntensity={0.4} />
      </mesh>
      {/* Wire leads */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshPhongMaterial color="#c0c0c0" emissive="#c0c0c0" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.2]} />
        <meshPhongMaterial color="#c0c0c0" emissive="#c0c0c0" emissiveIntensity={0.3} />
      </mesh>
      {/* Value label */}
      <Html position={[0, -0.8, 0]}>
        <div className="text-sm bg-black/80 text-orange-400 px-3 py-1 rounded font-bold">
          {value}Ω
        </div>
      </Html>
    </group>
  );
};

const WireSegment = ({ start, end, color = "#ffcc00", isActive = false }: { start: Vector3, end: Vector3, color?: string, isActive?: boolean }) => {
  const direction = end.clone().sub(start);
  const length = direction.length();
  const center = start.clone().add(end).divideScalar(2);
  
  // Calculate rotation to align cylinder with wire direction
  const quaternion = new THREE.Quaternion();
  const up = new Vector3(0, 1, 0);
  quaternion.setFromUnitVectors(up, direction.clone().normalize());
  
  return (
    <mesh position={center} quaternion={quaternion}>
      <cylinderGeometry args={[0.06, 0.06, length]} />
      <meshPhongMaterial 
        color={color} 
        emissive={isActive ? color : "#444444"} 
        emissiveIntensity={isActive ? 0.6 : 0.15} 
        shininess={120}
      />
    </mesh>
  );
};

const InteractiveWirePoint = ({ 
  point, 
  onDrag, 
  isSelected, 
  onSelect,
  onAdjustStart,
  onAdjustEnd
}: { 
  point: WirePoint, 
  onDrag: (id: string, newPosition: Vector3) => void,
  isSelected: boolean,
  onSelect: (id: string) => void,
  onAdjustStart: () => void,
  onAdjustEnd: () => void
}) => {
  const meshRef = useRef<any>();
  const [isDragging, setIsDragging] = useState(false);

  return (
    <group>
      <mesh 
        ref={meshRef}
        position={point.position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(point.id);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          onAdjustStart();
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            const newPosition = new Vector3(e.point.x, e.point.y, 0);
            onDrag(point.id, newPosition);
          }
        }}
        onPointerUp={() => {
          setIsDragging(false);
          onAdjustEnd();
        }}
      >
        <sphereGeometry args={[0.15]} />
        <meshPhongMaterial 
          color={isSelected ? "#00ff88" : "#ffaa00"} 
          emissive={isSelected ? "#00ff88" : "#ffaa00"} 
          emissiveIntensity={isSelected ? 0.9 : 0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Position indicator when dragging */}
      {isDragging && (
        <Html position={[point.position.x, point.position.y + 0.5, 0]}>
          <div className="text-sm bg-black/90 text-green-400 px-3 py-2 rounded border border-green-400 font-mono">
            X: {point.position.x.toFixed(2)}, Y: {point.position.y.toFixed(2)}
          </div>
        </Html>
      )}
      
      {/* Point label */}
      <Html position={[point.position.x, point.position.y - 0.4, 0]}>
        <div className="text-xs bg-black/80 text-white px-2 py-1 rounded pointer-events-none">
          {point.id.toUpperCase()}
        </div>
      </Html>
    </group>
  );
};

const CircuitVisualization = ({ 
  components, 
  isOn, 
  totalVoltage, 
  totalCurrent, 
  equivalentResistance,
  wirePoints,
  onWirePointDrag,
  selectedWirePoint,
  onWirePointSelect,
  onAdjustStart,
  onAdjustEnd
}: { 
  components: CircuitComponent[], 
  isOn: boolean, 
  totalVoltage: number,
  totalCurrent: number,
  equivalentResistance: number,
  wirePoints: WirePoint[],
  onWirePointDrag: (id: string, newPosition: Vector3) => void,
  selectedWirePoint: string | null,
  onWirePointSelect: (id: string) => void,
  onAdjustStart: () => void,
  onAdjustEnd: () => void
}) => {
  const batteries = components.filter(c => c.type === 'battery');
  const resistors = components.filter(c => c.type === 'resistor');
  const seriesComponents = components.filter(c => c.connection === 'series');
  const parallelComponents = components.filter(c => c.connection === 'parallel');

  const circuitWidth = Math.max(6, components.length * 2);
  const wireYOffset = 1.5;

  // Create circuit layout
  const seriesSpacing = circuitWidth / (seriesComponents.length + 1);
  const parallelSpacing = circuitWidth * 0.6 / (parallelComponents.length + 1);

  // Get wire points for drawing segments
  const topLeft = wirePoints.find(p => p.id === 'tl')?.position || new Vector3(-circuitWidth/2, wireYOffset, 0);
  const topRight = wirePoints.find(p => p.id === 'tr')?.position || new Vector3(circuitWidth/2, wireYOffset, 0);
  const bottomRight = wirePoints.find(p => p.id === 'br')?.position || new Vector3(circuitWidth/2, -wireYOffset, 0);
  const bottomLeft = wirePoints.find(p => p.id === 'bl')?.position || new Vector3(-circuitWidth/2, -wireYOffset, 0);

  // Local UI state for constrained handle dragging
  const [draggingHandle, setDraggingHandle] = useState<'left' | 'right' | null>(null);
  return (
    <>
      {/* Interactive wire segments forming the circuit loop */}
      <WireSegment 
        start={topLeft} 
        end={topRight} 
        color="#ffdd00"
        isActive={isOn}
      />
      <WireSegment 
        start={topRight} 
        end={bottomRight} 
        color="#ffdd00"
        isActive={isOn}
      />
      <WireSegment 
        start={bottomRight} 
        end={bottomLeft} 
        color="#ffdd00"
        isActive={isOn}
      />
      <WireSegment 
        start={bottomLeft} 
        end={topLeft} 
        color="#ffdd00"
        isActive={isOn}
      />

      {/* Interactive wire points */}
      {wirePoints.map(point => (
        <InteractiveWirePoint
          key={point.id}
          point={point}
          onDrag={onWirePointDrag}
          isSelected={selectedWirePoint === point.id}
          onSelect={onWirePointSelect}
          onAdjustStart={onAdjustStart}
          onAdjustEnd={onAdjustEnd}
        />
      ))}

      {/* Length control handles on top wire (constrained horizontally) */}
      <group>
        {/* Left handle (controls TL.x) */}
        <mesh
          position={[topLeft.x, topLeft.y, 0]}
          onPointerDown={(e) => { e.stopPropagation(); onAdjustStart(); }}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              const newX = Math.min(e.point.x, topRight.x - 0.2);
              onWirePointDrag('tl', new Vector3(newX, topLeft.y, 0));
            }
          }}
          onPointerUp={(e) => { e.stopPropagation(); onAdjustEnd(); }}
        >
          <sphereGeometry args={[0.18]} />
          <meshPhongMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.7} />
        </mesh>
        {/* Right handle (controls TR.x) */}
        <mesh
          position={[topRight.x, topRight.y, 0]}
          onPointerDown={(e) => { e.stopPropagation(); onAdjustStart(); }}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              const newX = Math.max(e.point.x, topLeft.x + 0.2);
              onWirePointDrag('tr', new Vector3(newX, topRight.y, 0));
            }
          }}
          onPointerUp={(e) => { e.stopPropagation(); onAdjustEnd(); }}
        >
          <sphereGeometry args={[0.18]} />
          <meshPhongMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.7} />
        </mesh>

        {/* Top wire length display */}
        <Html position={[(topLeft.x + topRight.x) / 2, topLeft.y + 0.6, 0]}>
          <div className="text-xs bg-black/80 text-cyan-300 px-2 py-1 rounded font-mono">
            Length: {(topRight.x - topLeft.x).toFixed(2)}
          </div>
        </Html>
      </group>

      {seriesComponents.map((component, index) => {
        const xPosition = -circuitWidth/2 + (index + 1) * seriesSpacing;
        const yPosition = wireYOffset;
        
        return (
          <group key={component.id}>
            {component.type === 'battery' ? (
              <BatterySymbol 
                value={component.value} 
                position={new Vector3(xPosition, yPosition, 0)} 
              />
            ) : (
              <ResistorSymbol 
                value={component.value} 
                position={new Vector3(xPosition, yPosition, 0)} 
              />
            )}
          </group>
        );
      })}

      {/* Render parallel components */}
      {parallelComponents.map((component, index) => {
        const xPosition = -circuitWidth/2 + (index + 1) * parallelSpacing;
        const yPosition = 0;
        
        return (
          <group key={component.id}>
            {/* Vertical connection wires for parallel components */}
            <WireSegment 
              start={new Vector3(xPosition, wireYOffset, 0)} 
              end={new Vector3(xPosition, yPosition + 0.5, 0)} 
              color="#ffdd00"
              isActive={isOn}
            />
            <WireSegment 
              start={new Vector3(xPosition, yPosition - 0.5, 0)} 
              end={new Vector3(xPosition, -wireYOffset, 0)} 
              color="#ffdd00"
              isActive={isOn}
            />
            
            {component.type === 'battery' ? (
              <BatterySymbol 
                value={component.value} 
                position={new Vector3(xPosition, yPosition, 0)} 
              />
            ) : (
              <ResistorSymbol 
                value={component.value} 
                position={new Vector3(xPosition, yPosition, 0)} 
              />
            )}
          </group>
        );
      })}

      {/* Current flow visualization */}
      {isOn && (
        <ElectronFlow 
          isOn={isOn}
          speed={1}
          showConventional={true}
          current={totalCurrent}
          wirePoints={wirePoints}
        />
      )}

      {/* Circuit measurements */}
      {isOn && (
        <>
          <Html position={[0, 3, 0]}>
            <div className="text-lg font-bold text-green-400 bg-black/80 px-3 py-2 rounded">
              Current: {totalCurrent.toFixed(2)}A
            </div>
          </Html>
          <Html position={[circuitWidth/2 - 1, -3, 0]}>
            <div className="text-sm text-red-400 bg-black/80 px-2 py-1 rounded">
              Voltage: {totalVoltage}V
            </div>
          </Html>
          <Html position={[-circuitWidth/2 + 1, -3, 0]}>
            <div className="text-sm text-blue-400 bg-black/80 px-2 py-1 rounded">
              Resistance: {equivalentResistance.toFixed(2)}Ω
            </div>
          </Html>
        </>
      )}

      {/* Connection type indicators */}
      {seriesComponents.length > 0 && (
        <Html position={[0, -3.5, 0]}>
          <div className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded">
            Series: {seriesComponents.length} components
          </div>
        </Html>
      )}
      {parallelComponents.length > 0 && (
        <Html position={[0, -4, 0]}>
          <div className="text-xs bg-green-500/80 text-white px-2 py-1 rounded">
            Parallel: {parallelComponents.length} components
          </div>
        </Html>
      )}
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
      {Array.from({ length: 6 }, (_, i) => {
        const radius = 0.8 + i * 0.4;
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
            color="#00ff88"
            lineWidth={3}
            opacity={0.5 + (current * 0.15)}
            transparent
          />
        );
      })}
    </>
  );
};

const CurrentElectricityVisualization = ({ concept }: CurrentElectricityProps) => {
  const [isCircuitOn, setIsCircuitOn] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState([1]);
  const [showConventional, setShowConventional] = useState(true);
  const [showMagneticField, setShowMagneticField] = useState(false);
  const [circuitMode, setCircuitMode] = useState<'simple' | 'advanced'>('simple');
  const [isAdjusting, setIsAdjusting] = useState(false);
  
  // Simple circuit states
  const [simpleVoltage, setSimpleVoltage] = useState([12]);
  const [simpleResistance, setSimpleResistance] = useState([4]);
  
  // Advanced circuit states
  const [components, setComponents] = useState<CircuitComponent[]>([
    { id: '1', type: 'battery', value: 12, position: new Vector3(-2, 0, 0), connection: 'series' },
    { id: '2', type: 'resistor', value: 4, position: new Vector3(2, 0, 0), connection: 'series' }
  ]);
  const [nextComponentType, setNextComponentType] = useState<'resistor' | 'battery'>('resistor');
  const [nextComponentValue, setNextComponentValue] = useState([5]);
  const [nextComponentConnection, setNextComponentConnection] = useState<'series' | 'parallel'>('series');
  
  // Wire points for interactive circuit modification
  const [wirePoints, setWirePoints] = useState<WirePoint[]>([
    { id: 'tl', position: new Vector3(-4, 1.5, 0), connections: ['tr', 'bl'] },
    { id: 'tr', position: new Vector3(4, 1.5, 0), connections: ['tl', 'br'] },
    { id: 'br', position: new Vector3(4, -1.5, 0), connections: ['tr', 'bl'] },
    { id: 'bl', position: new Vector3(-4, -1.5, 0), connections: ['br', 'tl'] }
  ]);
  const [selectedWirePoint, setSelectedWirePoint] = useState<string | null>(null);

  // Calculate circuit properties
  const calculateCircuitProperties = () => {
    if (circuitMode === 'simple') {
      return {
        totalVoltage: simpleVoltage[0],
        totalCurrent: simpleVoltage[0] / simpleResistance[0],
        equivalentResistance: simpleResistance[0]
      };
    }

    const batteries = components.filter(c => c.type === 'battery');
    const resistors = components.filter(c => c.type === 'resistor');
    const seriesResistors = resistors.filter(r => r.connection === 'series');
    const parallelResistors = resistors.filter(r => r.connection === 'parallel');

    // Calculate total voltage (series batteries add up)
    const totalVoltage = batteries.reduce((sum, battery) => sum + battery.value, 0);

    // Calculate equivalent resistance
    const seriesResistance = seriesResistors.reduce((sum, r) => sum + r.value, 0);
    const parallelResistance = parallelResistors.length > 0 ? 
      1 / parallelResistors.reduce((sum, r) => sum + (1 / r.value), 0) : 0;

    const equivalentResistance = seriesResistance + parallelResistance;
    const totalCurrent = equivalentResistance > 0 ? totalVoltage / equivalentResistance : 0;

    return { totalVoltage, totalCurrent, equivalentResistance };
  };

  const { totalVoltage, totalCurrent, equivalentResistance } = calculateCircuitProperties();

  const addComponent = () => {
    const newComponent: CircuitComponent = {
      id: `component-${Date.now()}`,
      type: nextComponentType,
      value: nextComponentValue[0],
      position: new Vector3(0, 0, 0),
      connection: nextComponentConnection
    };
    setComponents([...components, newComponent]);
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const updateComponent = (id: string, field: keyof CircuitComponent, value: any) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const resetCircuit = () => {
    setComponents([
      { id: '1', type: 'battery', value: 12, position: new Vector3(-2, 0, 0), connection: 'series' },
      { id: '2', type: 'resistor', value: 4, position: new Vector3(2, 0, 0), connection: 'series' }
    ]);
    setWirePoints([
      { id: 'tl', position: new Vector3(-4, 1.5, 0), connections: ['tr', 'bl'] },
      { id: 'tr', position: new Vector3(4, 1.5, 0), connections: ['tl', 'br'] },
      { id: 'br', position: new Vector3(4, -1.5, 0), connections: ['tr', 'bl'] },
      { id: 'bl', position: new Vector3(-4, -1.5, 0), connections: ['br', 'tl'] }
    ]);
  };

  const handleWirePointDrag = (id: string, newPosition: Vector3) => {
    setWirePoints(prev => prev.map(point => 
      point.id === id ? { ...point, position: newPosition } : point
    ));
  };

  const handleWirePointSelect = (id: string) => {
    setSelectedWirePoint(selectedWirePoint === id ? null : id);
  };

  const extendWire = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!selectedWirePoint) return;
    
    setWirePoints(prev => prev.map(point => {
      if (point.id === selectedWirePoint) {
        const offset = 0.5;
        const newPosition = point.position.clone();
        
        switch (direction) {
          case 'up': newPosition.y += offset; break;
          case 'down': newPosition.y -= offset; break;
          case 'left': newPosition.x -= offset; break;
          case 'right': newPosition.x += offset; break;
        }
        
        return { ...point, position: newPosition };
      }
      return point;
    }));
  };

  const addWirePoint = () => {
    if (!selectedWirePoint) return;
    
    const currentPoint = wirePoints.find(p => p.id === selectedWirePoint);
    if (!currentPoint) return;
    
    const newPoint: WirePoint = {
      id: `wp-${Date.now()}`,
      position: currentPoint.position.clone().add(new Vector3(1, 0, 0)),
      connections: [selectedWirePoint]
    };
    
    setWirePoints(prev => [...prev, newPoint]);
  };

  const deleteSelectedWirePoint = () => {
    if (!selectedWirePoint) return;
    if (['tl', 'tr', 'br', 'bl'].includes(selectedWirePoint)) return;
    setWirePoints(prev => prev.filter(p => p.id !== selectedWirePoint));
    setSelectedWirePoint(null);
  };

  const circuitWidth = Math.max(8, components.length * 1.5);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🔌 {concept.name}
        </CardTitle>
        <CardDescription>{concept.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circuit Mode Toggle */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Circuit Mode:</label>
          <Select value={circuitMode} onValueChange={(value: 'simple' | 'advanced') => setCircuitMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple Circuit</SelectItem>
              <SelectItem value="advanced">Advanced Builder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Enhanced 3D Canvas */}
        <div className="h-[500px] bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700">
          <Canvas camera={{ position: [0, 5, 12], fov: 60 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <pointLight position={[-10, 10, 10]} intensity={0.8} />
            <pointLight position={[0, -10, 5]} intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
            
            {circuitMode === 'simple' ? (
              <>
                {/* Simple circuit layout */}
                <group>
                  {/* Main horizontal wires */}
                  <WireSegment 
                    start={new Vector3(-4, 1, 0)} 
                    end={new Vector3(4, 1, 0)} 
                  />
                  <WireSegment 
                    start={new Vector3(-4, -1, 0)} 
                    end={new Vector3(4, -1, 0)} 
                  />
                  
                  {/* Vertical connecting wires */}
                  <WireSegment 
                    start={new Vector3(-4, 1, 0)} 
                    end={new Vector3(-4, -1, 0)} 
                  />
                  <WireSegment 
                    start={new Vector3(4, 1, 0)} 
                    end={new Vector3(4, -1, 0)} 
                  />
                  
                  {/* Battery symbol */}
                  <BatterySymbol 
                    value={simpleVoltage[0]} 
                    position={new Vector3(-2, 1, 0)} 
                  />
                  
                  {/* Resistor symbol */}
                  <ResistorSymbol 
                    value={simpleResistance[0]} 
                    position={new Vector3(2, 1, 0)} 
                  />
                </group>
              </>
            ) : (
              <CircuitVisualization 
                components={components}
                isOn={isCircuitOn}
                totalVoltage={totalVoltage}
                totalCurrent={totalCurrent}
                equivalentResistance={equivalentResistance}
                wirePoints={wirePoints}
                onWirePointDrag={handleWirePointDrag}
                selectedWirePoint={selectedWirePoint}
                onWirePointSelect={handleWirePointSelect}
                onAdjustStart={() => setIsAdjusting(true)}
                onAdjustEnd={() => setIsAdjusting(false)}
              />
            )}
            
            {isCircuitOn && circuitMode === 'simple' && (
              <ElectronFlow 
                isOn={isCircuitOn} 
                speed={currentSpeed[0]} 
                showConventional={showConventional}
                current={totalCurrent}
                wirePoints={[
                  { id: 'tl', position: new Vector3(-4, 1, 0), connections: [] },
                  { id: 'tr', position: new Vector3(4, 1, 0), connections: [] },
                  { id: 'br', position: new Vector3(4, -1, 0), connections: [] },
                  { id: 'bl', position: new Vector3(-4, -1, 0), connections: [] }
                ]}
              />
            )}
            
            <MagneticField 
              showMagneticField={showMagneticField} 
              current={isCircuitOn ? totalCurrent : 0}
            />
            
            <OrbitControls 
              enabled={!isAdjusting}
              enablePan={!isAdjusting}
              enableZoom={!isAdjusting}
              enableRotate={!isAdjusting}
              minDistance={5}
              maxDistance={20}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Canvas>
        </div>

        {/* Wire Control Panel */}
        {circuitMode === 'advanced' && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-bold text-white mb-3">Interactive Circuit Designer</h3>
            
            {/* Wire Modification Controls */}
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-gray-300">Wire Controls</h4>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={() => extendWire('up')} 
                  disabled={!selectedWirePoint}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  ↑ Extend Up
                </Button>
                <Button 
                  onClick={() => extendWire('down')} 
                  disabled={!selectedWirePoint}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  ↓ Extend Down
                </Button>
                <Button 
                  onClick={() => extendWire('left')} 
                  disabled={!selectedWirePoint}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  ← Extend Left
                </Button>
                <Button 
                  onClick={() => extendWire('right')} 
                  disabled={!selectedWirePoint}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  → Extend Right
                </Button>
                <Button 
                  onClick={addWirePoint} 
                  disabled={!selectedWirePoint}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Point
                </Button>
                <Button
                  onClick={deleteSelectedWirePoint}
                  disabled={!selectedWirePoint || ['tl','tr','br','bl'].includes(selectedWirePoint)}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected Point
                </Button>
              </div>
              {selectedWirePoint && (
                <div className="text-sm text-green-400">
                  Selected: {selectedWirePoint} • Drag points or use buttons to adjust. Orientation locks while adjusting.
                </div>
              )}
            </div>
            
            {/* Add Component Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Component Type</label>
                <Select value={nextComponentType} onValueChange={(value: 'resistor' | 'battery') => setNextComponentType(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resistor">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        Resistor
                      </div>
                    </SelectItem>
                    <SelectItem value="battery">
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-green-400" />
                        Battery
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Value ({nextComponentType === 'battery' ? 'V' : 'Ω'})
                </label>
                <Slider
                  value={nextComponentValue}
                  onValueChange={setNextComponentValue}
                  min={nextComponentType === 'battery' ? 1 : 0.5}
                  max={nextComponentType === 'battery' ? 24 : 100}
                  step={nextComponentType === 'battery' ? 1 : 0.5}
                  className="w-full"
                />
                <div className="text-xs text-gray-400">
                  {nextComponentValue[0]}{nextComponentType === 'battery' ? 'V' : 'Ω'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Connection</label>
                <Select value={nextComponentConnection} onValueChange={(value: 'series' | 'parallel') => setNextComponentConnection(value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="series">Series</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={addComponent} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button 
                  onClick={resetCircuit} 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Component List */}
            <div className="space-y-2">
              <h4 className="text-md font-semibold text-gray-300">Circuit Components</h4>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {components.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {component.type === 'battery' ? (
                        <Battery className="w-5 h-5 text-green-400" />
                      ) : (
                        <Zap className="w-5 h-5 text-orange-400" />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          {component.type === 'battery' ? 'Battery' : 'Resistor'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {component.value}{component.type === 'battery' ? 'V' : 'Ω'} • {component.connection}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={component.connection === 'series' ? 'default' : 'secondary'}>
                        {component.connection}
                      </Badge>
                      <Button
                        onClick={() => removeComponent(component.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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

          {/* Simple Circuit Controls */}
          {circuitMode === 'simple' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Voltage: {simpleVoltage[0]}V</label>
                <Slider
                  value={simpleVoltage}
                  onValueChange={setSimpleVoltage}
                  max={24}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Resistance: {simpleResistance[0]}Ω</label>
                <Slider
                  value={simpleResistance}
                  onValueChange={setSimpleResistance}
                  max={20}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Advanced Circuit Builder */}
          {circuitMode === 'advanced' && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Circuit Builder</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Component Type</label>
                    <Select value={nextComponentType} onValueChange={(value: 'resistor' | 'battery') => setNextComponentType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resistor">Resistor</SelectItem>
                        <SelectItem value="battery">Battery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Value: {nextComponentValue[0]}{nextComponentType === 'battery' ? 'V' : 'Ω'}
                    </label>
                    <Slider
                      value={nextComponentValue}
                      onValueChange={setNextComponentValue}
                      max={nextComponentType === 'battery' ? 24 : 20}
                      min={1}
                      step={nextComponentType === 'battery' ? 1 : 0.5}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Connection</label>
                    <Select value={nextComponentConnection} onValueChange={(value: 'series' | 'parallel') => setNextComponentConnection(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="series">Series</SelectItem>
                        <SelectItem value="parallel">Parallel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={addComponent} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Component
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium">Circuit Components</h5>
                    <Button onClick={resetCircuit} variant="outline" size="sm">
                      Reset Circuit
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {components.map((component) => (
                      <div key={component.id} className="flex items-center justify-between bg-white p-2 rounded border">
                        <div className="flex items-center gap-2">
                          {component.type === 'battery' ? (
                            <Battery className="w-4 h-4 text-green-600" />
                          ) : (
                            <Zap className="w-4 h-4 text-orange-600" />
                          )}
                          <span className="text-sm">
                            {component.value}{component.type === 'battery' ? 'V' : 'Ω'}
                          </span>
                          <Badge variant={component.connection === 'series' ? 'default' : 'secondary'}>
                            {component.connection}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => removeComponent(component.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animation Speed Control */}
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

          {/* Ohm's Law Display */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Circuit Analysis</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">V = {totalVoltage}V</div>
                <div className="text-sm text-gray-600">Total Voltage</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">I = {totalCurrent.toFixed(2)}A</div>
                <div className="text-sm text-gray-600">Current</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">R = {equivalentResistance.toFixed(2)}Ω</div>
                <div className="text-sm text-gray-600">Equivalent Resistance</div>
              </div>
            </div>
            <div className="text-center mt-2 text-lg font-semibold">
              V = I × R → {totalVoltage} = {totalCurrent.toFixed(2)} × {equivalentResistance.toFixed(2)}
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
              <span>Series circuit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-orange-500"></div>
              <span>Parallel circuit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-green-500"></div>
              <span>Magnetic field lines</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <li><strong>Simple Mode:</strong> Use sliders to adjust voltage and resistance in a basic circuit</li>
            <li><strong>Advanced Mode:</strong> Build complex circuits with multiple resistors and batteries</li>
            <li><strong>Series Connection:</strong> Components are connected end-to-end (resistance adds up)</li>
            <li><strong>Parallel Connection:</strong> Components are connected side-by-side (resistance decreases)</li>
            <li><strong>Circuit Analysis:</strong> Watch how current changes with different circuit configurations</li>
            <li><strong>Electron Flow:</strong> Observe how electrons move through different circuit types</li>
            <li><strong>Magnetic Field:</strong> See how current creates magnetic fields around conductors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentElectricityVisualization;