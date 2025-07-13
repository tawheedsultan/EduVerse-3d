export interface PhysicsConcept {
  id: string;
  name: string;
  description: string;
  category: 'electrostatics' | 'current_electricity';
  theory: string;
  applications: string[];
}

export const physicsConcepts: PhysicsConcept[] = [
  {
    id: 'coulomb-law',
    name: 'Coulomb\'s Law',
    description: 'Visualizing the force between electric charges and how it varies with distance',
    category: 'electrostatics',
    theory: 'The force between two point charges is directly proportional to the product of charges and inversely proportional to the square of distance between them.',
    applications: ['Atomic structure', 'Lightning rods', 'Electrostatic precipitators']
  },
  {
    id: 'electric-field',
    name: 'Electric Field Lines',
    description: 'Interactive visualization of electric field patterns around different charge configurations',
    category: 'electrostatics',
    theory: 'Electric field lines show the direction of electric force on a positive test charge. They originate from positive charges and terminate on negative charges.',
    applications: ['Capacitor design', 'Van de Graaff generators', 'Electrostatic shielding']
  },
  {
    id: 'electric-potential',
    name: 'Electric Potential',
    description: '3D visualization of electric potential and equipotential surfaces around charges',
    category: 'electrostatics',
    theory: 'Electric potential is the work done per unit charge in bringing a test charge from infinity to a point in the electric field.',
    applications: ['Battery design', 'Electron microscopy', 'Particle accelerators']
  },
  {
    id: 'current-flow',
    name: 'Electric Current Flow',
    description: 'Animated visualization of electron flow and conventional current in conductors',
    category: 'current_electricity',
    theory: 'Electric current is the flow of electric charge. Conventional current flows from positive to negative, while electrons flow in the opposite direction.',
    applications: ['Circuit design', 'Power transmission', 'Electronic devices']
  },
  {
    id: 'ohms-law',
    name: 'Ohm\'s Law Demonstration',
    description: 'Interactive circuit showing the relationship between voltage, current, and resistance',
    category: 'current_electricity',
    theory: 'Voltage across a conductor is directly proportional to the current flowing through it, with resistance as the proportionality constant (V = IR).',
    applications: ['Circuit analysis', 'Electrical safety', 'Component design']
  },
  {
    id: 'magnetic-field',
    name: 'Magnetic Field around Current',
    description: 'Visualization of magnetic field lines around current-carrying conductors',
    category: 'current_electricity',
    theory: 'A current-carrying conductor produces a magnetic field around it. The direction follows the right-hand rule.',
    applications: ['Electromagnets', 'Motors', 'Transformers', 'MRI machines']
  }
];