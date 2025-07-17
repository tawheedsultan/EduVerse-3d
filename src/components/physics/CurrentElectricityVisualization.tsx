import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { Vector3 } from 'three';
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

const ElectronFlow = ({ 
  isOn, 
  speed, 
  showConventional,
  current,
  circuitLength
}: { 
  isOn: boolean, 
  speed: number, 
  showConventional: boolean,
  current: number,
  circuitLength: number
}) => {
  const electronsRef = useRef<any>();
  const conventionalRef = useRef<any>();
  
  useFrame((state) => {
    if (isOn && electronsRef.current) {
      electronsRef.current.children.forEach((electron: any, index: number) => {
        electron.position.x += speed * 0.02 * current;
        if (electron.position.x > circuitLength / 2) {
          electron.position.x = -circuitLength / 2;
        }
      });
    }
    
    if (isOn && showConventional && conventionalRef.current) {
      conventionalRef.current.children.forEach((particle: any, index: number) => {
        particle.position.x -= speed * 0.02 * current;
        if (particle.position.x < -circuitLength / 2) {
          particle.position.x = circuitLength / 2;
        }
      });
    }
  });

  const electronDensity = Math.max(10, Math.min(50, current * 8));
  const electronSize = Math.max(0.02, Math.min(0.06, current * 0.015));

  return (
    <>
      {/* Electrons (blue, moving right) */}
      <group ref={electronsRef}>
        {Array.from({ length: Math.floor(electronDensity) }, (_, i) => (
          <mesh key={i} position={[-circuitLength / 2 + i * (circuitLength / electronDensity), 0.1, 0]}>
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
            <mesh key={i} position={[circuitLength / 2 - i * (circuitLength / (electronDensity * 0.7)), -0.1, 0]}>
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

const CircuitVisualization = ({ 
  components, 
  isOn, 
  totalVoltage, 
  totalCurrent, 
  equivalentResistance 
}: { 
  components: CircuitComponent[], 
  isOn: boolean, 
  totalVoltage: number,
  totalCurrent: number,
  equivalentResistance: number
}) => {
  const batteries = components.filter(c => c.type === 'battery');
  const resistors = components.filter(c => c.type === 'resistor');
  const seriesComponents = components.filter(c => c.connection === 'series');
  const parallelComponents = components.filter(c => c.connection === 'parallel');

  const circuitWidth = Math.max(8, components.length * 1.5);
  const wireYOffset = 0.5;

  return (
    <>
      {/* Main circuit wire */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, circuitWidth]} />
        <meshPhongMaterial color="#ffd700" />
      </mesh>

      {/* Parallel circuit wire (if parallel components exist) */}
      {parallelComponents.length > 0 && (
        <>
          <mesh position={[0, wireYOffset, 0]}>
            <cylinderGeometry args={[0.06, 0.06, circuitWidth * 0.8]} />
            <meshPhongMaterial color="#ffaa00" />
          </mesh>
          <mesh position={[0, -wireYOffset, 0]}>
            <cylinderGeometry args={[0.06, 0.06, circuitWidth * 0.8]} />
            <meshPhongMaterial color="#ffaa00" />
          </mesh>
        </>
      )}

      {/* Render components */}
      {components.map((component, index) => {
        const xPosition = -circuitWidth / 2 + (index + 1) * (circuitWidth / (components.length + 1));
        const yPosition = component.connection === 'parallel' ? 
          (index % 2 === 0 ? wireYOffset : -wireYOffset) : 0;

        return (
          <group key={component.id} position={[xPosition, yPosition, 0]}>
            {component.type === 'battery' ? (
              <>
                <mesh>
                  <cylinderGeometry args={[0.25, 0.25, 0.6]} />
                  <meshPhongMaterial color="#2c3e50" />
                </mesh>
                <mesh position={[0, 0, 0.35]}>
                  <cylinderGeometry args={[0.15, 0.15, 0.1]} />
                  <meshPhongMaterial color="#e74c3c" />
                </mesh>
                <Html>
                  <div className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                    {component.value}V
                  </div>
                </Html>
              </>
            ) : (
              <>
                <mesh>
                  <boxGeometry args={[0.8, 0.4, 0.4]} />
                  <meshPhongMaterial color="#8b4513" />
                </mesh>
                <mesh position={[0, 0, 0.25]}>
                  <torusGeometry args={[0.2, 0.05, 8, 16]} />
                  <meshPhongMaterial color="#cd853f" />
                </mesh>
                <Html>
                  <div className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                    {component.value}Ω
                  </div>
                </Html>
              </>
            )}
          </group>
        );
      })}

      {/* Current and voltage indicators */}
      {isOn && (
        <>
          <Html position={[0, 1.5, 0]}>
            <div className="text-lg font-bold text-green-500 bg-black/70 px-3 py-2 rounded">
              I = {totalCurrent.toFixed(2)}A
            </div>
          </Html>
          <Html position={[circuitWidth / 2 - 1, -1.5, 0]}>
            <div className="text-sm text-red-500 bg-black/70 px-2 py-1 rounded">
              V = {totalVoltage}V
            </div>
          </Html>
          <Html position={[-circuitWidth / 2 + 1, -1.5, 0]}>
            <div className="text-sm text-blue-500 bg-black/70 px-2 py-1 rounded">
              R = {equivalentResistance.toFixed(2)}Ω
            </div>
          </Html>
        </>
      )}

      {/* Connection indicators */}
      {seriesComponents.length > 0 && (
        <Html position={[0, -2, 0]}>
          <div className="text-xs bg-blue-500/80 text-white px-2 py-1 rounded">
            Series: {seriesComponents.length} components
          </div>
        </Html>
      )}
      {parallelComponents.length > 0 && (
        <Html position={[0, -2.5, 0]}>
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
            color="#00ff00"
            lineWidth={2}
            opacity={0.4 + (current * 0.1)}
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

        {/* 3D Canvas */}
        <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 3, 10], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, 10, 10]} intensity={0.5} />
            
            {circuitMode === 'simple' ? (
              <>
                {/* Simple circuit wire */}
                <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.1, 0.1, 8]} />
                  <meshPhongMaterial color="#ffd700" />
                </mesh>
                
                {/* Simple battery */}
                <group position={[-3.5, 0, 0]}>
                  <mesh>
                    <cylinderGeometry args={[0.2, 0.2, 0.5]} />
                    <meshPhongMaterial color="#000000" />
                  </mesh>
                  <Html>
                    <div className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {simpleVoltage[0]}V
                    </div>
                  </Html>
                </group>
                
                {/* Simple resistor */}
                <group position={[3.5, 0, 0]}>
                  <mesh>
                    <boxGeometry args={[0.6, 0.3, 0.3]} />
                    <meshPhongMaterial color="#8b4513" />
                  </mesh>
                  <Html>
                    <div className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {simpleResistance[0]}Ω
                    </div>
                  </Html>
                </group>
              </>
            ) : (
              <CircuitVisualization 
                components={components}
                isOn={isCircuitOn}
                totalVoltage={totalVoltage}
                totalCurrent={totalCurrent}
                equivalentResistance={equivalentResistance}
              />
            )}
            
            {isCircuitOn && (
              <ElectronFlow 
                isOn={isCircuitOn} 
                speed={currentSpeed[0]} 
                showConventional={showConventional}
                current={totalCurrent}
                circuitLength={circuitMode === 'simple' ? 8 : circuitWidth}
              />
            )}
            
            <MagneticField 
              showMagneticField={showMagneticField} 
              current={isCircuitOn ? totalCurrent : 0}
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