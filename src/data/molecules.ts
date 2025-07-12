
export interface Atom {
  element: string;
  position: [number, number, number];
  id: string;
}

export interface Bond {
  atom1: string;
  atom2: string;
  type: 'single' | 'double' | 'triple';
}

export interface SymmetryElement {
  type: 'plane' | 'axis' | 'center';
  position?: [number, number, number];
  normal?: [number, number, number];
  order?: number;
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  pointGroup: string;
  atoms: Atom[];
  bonds: Bond[];
  symmetryElements: {
    planes: SymmetryElement[];
    axes: SymmetryElement[];
    center: boolean;
  };
  description: string;
}

export const molecules: Molecule[] = [
  {
    id: 'methane',
    name: 'Methane',
    formula: 'CH₄',
    pointGroup: 'Td',
    atoms: [
      { element: 'C', position: [0, 0, 0], id: 'c1' },
      { element: 'H', position: [1.1, 1.1, 1.1], id: 'h1' },
      { element: 'H', position: [-1.1, -1.1, 1.1], id: 'h2' },
      { element: 'H', position: [-1.1, 1.1, -1.1], id: 'h3' },
      { element: 'H', position: [1.1, -1.1, -1.1], id: 'h4' },
    ],
    bonds: [
      { atom1: 'c1', atom2: 'h1', type: 'single' },
      { atom1: 'c1', atom2: 'h2', type: 'single' },
      { atom1: 'c1', atom2: 'h3', type: 'single' },
      { atom1: 'c1', atom2: 'h4', type: 'single' },
    ],
    symmetryElements: {
      planes: [
        { type: 'plane', position: [0, 0, 0], normal: [1, 1, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1, -1, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1, 0, 1] },
        { type: 'plane', position: [0, 0, 0], normal: [1, 0, -1] },
        { type: 'plane', position: [0, 0, 0], normal: [0, 1, 1] },
        { type: 'plane', position: [0, 0, 0], normal: [0, 1, -1] },
      ],
      axes: [
        { type: 'axis', position: [0, 0, 0], normal: [1, 1, 1], order: 3 },
        { type: 'axis', position: [0, 0, 0], normal: [1, -1, -1], order: 3 },
        { type: 'axis', position: [0, 0, 0], normal: [-1, 1, -1], order: 3 },
        { type: 'axis', position: [0, 0, 0], normal: [-1, -1, 1], order: 3 },
      ],
      center: false,
    },
    description: 'Tetrahedral molecule with high symmetry'
  },
  {
    id: 'water',
    name: 'Water',
    formula: 'H₂O',
    pointGroup: 'C₂ᵥ',
    atoms: [
      { element: 'O', position: [0, 0, 0], id: 'o1' },
      { element: 'H', position: [0.96, 0, 0.37], id: 'h1' },
      { element: 'H', position: [-0.96, 0, 0.37], id: 'h2' },
    ],
    bonds: [
      { atom1: 'o1', atom2: 'h1', type: 'single' },
      { atom1: 'o1', atom2: 'h2', type: 'single' },
    ],
    symmetryElements: {
      planes: [
        { type: 'plane', position: [0, 0, 0], normal: [0, 1, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [0, 0, 1] },
      ],
      axes: [
        { type: 'axis', position: [0, 0, 0], normal: [0, 1, 0], order: 2 },
      ],
      center: false,
    },
    description: 'Bent molecule with C₂ᵥ symmetry'
  },
  {
    id: 'ethene',
    name: 'Ethene',
    formula: 'C₂H₄',
    pointGroup: 'D₂ₕ',
    atoms: [
      { element: 'C', position: [-0.67, 0, 0], id: 'c1' },
      { element: 'C', position: [0.67, 0, 0], id: 'c2' },
      { element: 'H', position: [-1.23, 0.92, 0], id: 'h1' },
      { element: 'H', position: [-1.23, -0.92, 0], id: 'h2' },
      { element: 'H', position: [1.23, 0.92, 0], id: 'h3' },
      { element: 'H', position: [1.23, -0.92, 0], id: 'h4' },
    ],
    bonds: [
      { atom1: 'c1', atom2: 'c2', type: 'double' },
      { atom1: 'c1', atom2: 'h1', type: 'single' },
      { atom1: 'c1', atom2: 'h2', type: 'single' },
      { atom1: 'c2', atom2: 'h3', type: 'single' },
      { atom1: 'c2', atom2: 'h4', type: 'single' },
    ],
    symmetryElements: {
      planes: [
        { type: 'plane', position: [0, 0, 0], normal: [0, 0, 1] },
        { type: 'plane', position: [0, 0, 0], normal: [1, 0, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [0, 1, 0] },
      ],
      axes: [
        { type: 'axis', position: [0, 0, 0], normal: [1, 0, 0], order: 2 },
        { type: 'axis', position: [0, 0, 0], normal: [0, 1, 0], order: 2 },
        { type: 'axis', position: [0, 0, 0], normal: [0, 0, 1], order: 2 },
      ],
      center: true,
    },
    description: 'Planar molecule with D₂ₕ symmetry'
  },
  {
    id: 'benzene',
    name: 'Benzene',
    formula: 'C₆H₆',
    pointGroup: 'D₆ₕ',
    atoms: [
      { element: 'C', position: [1.4, 0, 0], id: 'c1' },
      { element: 'C', position: [0.7, 1.21, 0], id: 'c2' },
      { element: 'C', position: [-0.7, 1.21, 0], id: 'c3' },
      { element: 'C', position: [-1.4, 0, 0], id: 'c4' },
      { element: 'C', position: [-0.7, -1.21, 0], id: 'c5' },
      { element: 'C', position: [0.7, -1.21, 0], id: 'c6' },
      { element: 'H', position: [2.48, 0, 0], id: 'h1' },
      { element: 'H', position: [1.24, 2.15, 0], id: 'h2' },
      { element: 'H', position: [-1.24, 2.15, 0], id: 'h3' },
      { element: 'H', position: [-2.48, 0, 0], id: 'h4' },
      { element: 'H', position: [-1.24, -2.15, 0], id: 'h5' },
      { element: 'H', position: [1.24, -2.15, 0], id: 'h6' },
    ],
    bonds: [
      { atom1: 'c1', atom2: 'c2', type: 'single' },
      { atom1: 'c2', atom2: 'c3', type: 'double' },
      { atom1: 'c3', atom2: 'c4', type: 'single' },
      { atom1: 'c4', atom2: 'c5', type: 'double' },
      { atom1: 'c5', atom2: 'c6', type: 'single' },
      { atom1: 'c6', atom2: 'c1', type: 'double' },
      { atom1: 'c1', atom2: 'h1', type: 'single' },
      { atom1: 'c2', atom2: 'h2', type: 'single' },
      { atom1: 'c3', atom2: 'h3', type: 'single' },
      { atom1: 'c4', atom2: 'h4', type: 'single' },
      { atom1: 'c5', atom2: 'h5', type: 'single' },
      { atom1: 'c6', atom2: 'h6', type: 'single' },
    ],
    symmetryElements: {
      planes: [
        { type: 'plane', position: [0, 0, 0], normal: [0, 0, 1] },
        { type: 'plane', position: [0, 0, 0], normal: [1, 0, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [0, 1, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1, 1.73, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1, -1.73, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1.73, 1, 0] },
        { type: 'plane', position: [0, 0, 0], normal: [1.73, -1, 0] },
      ],
      axes: [
        { type: 'axis', position: [0, 0, 0], normal: [0, 0, 1], order: 6 },
        { type: 'axis', position: [0, 0, 0], normal: [1, 0, 0], order: 2 },
        { type: 'axis', position: [0, 0, 0], normal: [0, 1, 0], order: 2 },
      ],
      center: true,
    },
    description: 'Highly symmetric aromatic ring with D₆ₕ symmetry'
  }
];
