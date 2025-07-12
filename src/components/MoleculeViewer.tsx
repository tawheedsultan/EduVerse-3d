
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Molecule, SymmetryElement } from '@/data/molecules';

interface MoleculeViewerProps {
  molecule: Molecule;
  showSymmetryElements: {
    planes: boolean;
    center: boolean;
    axes: boolean;
  };
}

const AtomComponent = ({ element, position, id }: { element: string, position: [number, number, number], id: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const getAtomColor = (element: string) => {
    const colors: { [key: string]: string } = {
      'C': '#404040',
      'H': '#FFFFFF',
      'O': '#FF0000',
      'N': '#0000FF',
      'S': '#FFFF00',
      'P': '#FFA500',
    };
    return colors[element] || '#FF00FF';
  };

  const getAtomRadius = (element: string) => {
    const radii: { [key: string]: number } = {
      'C': 0.35,
      'H': 0.25,
      'O': 0.30,
      'N': 0.30,
      'S': 0.40,
      'P': 0.40,
    };
    return radii[element] || 0.3;
  };

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[getAtomRadius(element), 32, 32]} />
        <meshPhongMaterial color={getAtomColor(element)} />
      </mesh>
      <Text
        position={[0, getAtomRadius(element) + 0.3, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {element}
      </Text>
    </group>
  );
};

const BondComponent = ({ start, end, type }: { start: [number, number, number], end: [number, number, number], type: string }) => {
  const direction = new THREE.Vector3(end[0] - start[0], end[1] - start[1], end[2] - start[2]);
  const length = direction.length();
  const midpoint: [number, number, number] = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2
  ];

  direction.normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  if (type === 'double') {
    return (
      <group position={midpoint} quaternion={quaternion}>
        <mesh position={[0.05, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, length, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.05, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, length, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
      </group>
    );
  } else if (type === 'triple') {
    return (
      <group position={midpoint} quaternion={quaternion}>
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, length, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        <mesh position={[0.08, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, length, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.08, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, length, 8]} />
          <meshPhongMaterial color="#333333" />
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.03, 0.03, length, 8]} />
      <meshPhongMaterial color="#333333" />
    </mesh>
  );
};

const SymmetryPlane = ({ element }: { element: SymmetryElement }) => {
  if (!element.position || !element.normal) return null;
  
  const normal = new THREE.Vector3(element.normal[0], element.normal[1], element.normal[2]);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

  return (
    <mesh position={element.position} quaternion={quaternion}>
      <planeGeometry args={[4, 4]} />
      <meshPhongMaterial 
        color="#00FFFF" 
        transparent 
        opacity={0.3} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const SymmetryAxis = ({ element }: { element: SymmetryElement }) => {
  if (!element.position || !element.normal) return null;
  
  const direction = new THREE.Vector3(element.normal[0], element.normal[1], element.normal[2]);
  direction.normalize();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <group position={element.position} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 6, 8]} />
        <meshPhongMaterial color="#FF00FF" transparent opacity={0.7} />
      </mesh>
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.15}
        color="#FF00FF"
        anchorX="center"
        anchorY="middle"
      >
        C{element.order}
      </Text>
    </group>
  );
};

const CenterOfSymmetry = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.2]} />
      <meshPhongMaterial color="#FFFF00" transparent opacity={0.8} />
    </mesh>
  );
};

const MoleculeViewer = ({ molecule, showSymmetryElements }: MoleculeViewerProps) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Render atoms */}
      {molecule.atoms.map((atom) => (
        <AtomComponent
          key={atom.id}
          element={atom.element}
          position={atom.position}
          id={atom.id}
        />
      ))}
      
      {/* Render bonds */}
      {molecule.bonds.map((bond, index) => {
        const atom1 = molecule.atoms.find(a => a.id === bond.atom1);
        const atom2 = molecule.atoms.find(a => a.id === bond.atom2);
        if (!atom1 || !atom2) return null;
        
        return (
          <BondComponent
            key={index}
            start={atom1.position}
            end={atom2.position}
            type={bond.type}
          />
        );
      })}
      
      {/* Render symmetry elements */}
      {showSymmetryElements.planes && molecule.symmetryElements.planes.map((plane, index) => (
        <SymmetryPlane key={`plane-${index}`} element={plane} />
      ))}
      
      {showSymmetryElements.axes && molecule.symmetryElements.axes.map((axis, index) => (
        <SymmetryAxis key={`axis-${index}`} element={axis} />
      ))}
      
      {showSymmetryElements.center && molecule.symmetryElements.center && (
        <CenterOfSymmetry />
      )}
    </group>
  );
};

export default MoleculeViewer;
