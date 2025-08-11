
export interface Experiment {
  id: string;
  name: string;
  description: string;
  type: 'polarimetry' | 'optical_rotation' | 'scattering';
  compound: string;
  expectedRotation?: number;
  theory: string;
  applications: string[];
}

export const experiments: Experiment[] = [
  {
    id: 'polarimetry-glucose',
    name: 'Polarimetry of D-Glucose',
    description: 'Measuring the optical rotation of D-glucose solution to determine its concentration',
    type: 'polarimetry',
    compound: 'D-Glucose (C₆H₁₂O₆)',
    expectedRotation: +52.7,
    theory: 'D-glucose is dextrorotatory, rotating plane-polarized light clockwise. The specific rotation is +52.7° at 20°C.',
    applications: ['Sugar analysis', 'Pharmaceutical quality control', 'Food industry']
  },
  {
    id: 'optical-rotation-fructose',
    name: 'Optical Rotation of D-Fructose',
    description: 'Observing the levorotatory nature of D-fructose through polarimetry',
    type: 'optical_rotation',
    compound: 'D-Fructose (C₆H₁₂O₆)',
    expectedRotation: -92.4,
    theory: 'Despite being a D-sugar, fructose is levorotatory with a specific rotation of -92.4°.',
    applications: ['Sweetener analysis', 'Biochemical research', 'Food science']
  },
  {
    id: 'polarimetry-sucrose',
    name: 'Sucrose Hydrolysis Monitoring',
    description: 'Tracking the inversion of sucrose to glucose and fructose through optical rotation changes',
    type: 'polarimetry',
    compound: 'Sucrose (C₁₂H₂₂O₁₁)',
    expectedRotation: +66.5,
    theory: 'Sucrose (+66.5°) hydrolyzes to glucose (+52.7°) and fructose (-92.4°), resulting in inversion.',
    applications: ['Sugar processing', 'Enzyme kinetics', 'Food chemistry']
  },
  {
    id: 'optical-rotation-tartaric',
    name: 'Tartaric Acid Stereoisomers',
    description: 'Comparing optical activities of different tartaric acid stereoisomers',
    type: 'optical_rotation',
    compound: 'L-(+)-Tartaric Acid (C₄H₆O₆)',
    expectedRotation: +12.0,
    theory: 'Different stereoisomers of tartaric acid show different optical rotations due to their chirality.',
    applications: ['Stereochemistry studies', 'Wine chemistry', 'Pharmaceutical analysis']
  },
  {
    id: 'polarimetry-lactose',
    name: 'Lactose Mutarotation Study',
    description: 'Studying the optical rotation changes during lactose mutarotation',
    type: 'polarimetry',
    compound: 'Lactose (C₁₂H₂₂O₁₁)',
    expectedRotation: +55.3,
    theory: 'Lactose shows mutarotation in solution, changing from α-form (+89.4°) to β-form (+35.0°).',
    applications: ['Dairy industry', 'Pharmaceutical formulations', 'Biochemical studies']
  },
  {
    id: 'optical-rotation-camphor',
    name: 'Camphor Optical Activity',
    description: 'Measuring the high optical rotation of natural camphor solution',
    type: 'optical_rotation',
    compound: '(+)-Camphor (C₁₀H₁₆O)',
    expectedRotation: +44.3,
    theory: 'Natural camphor exhibits high optical activity due to its rigid bicyclic chiral structure.',
    applications: ['Natural product analysis', 'Pharmaceutical intermediates', 'Perfume industry']
  },
  {
    id: 'polarimetry-menthol',
    name: 'Menthol Enantiomer Analysis',
    description: 'Distinguishing between (+) and (-) menthol using optical rotation',
    type: 'polarimetry',
    compound: '(-)-Menthol (C₁₀H₂₀O)',
    expectedRotation: -50.0,
    theory: '(-)-Menthol is levorotatory while (+)-menthol is dextrorotatory, useful for purity analysis.',
    applications: ['Essential oil analysis', 'Flavor industry', 'Pharmaceutical quality control']
  },
  {
    id: 'optical-rotation-nicotine',
    name: 'Nicotine Optical Activity',
    description: 'Analyzing the optical rotation of natural (-)-nicotine',
    type: 'optical_rotation',
    compound: '(-)-Nicotine (C₁₀H₁₄N₂)',
    expectedRotation: -162.0,
    theory: 'Natural nicotine is strongly levorotatory due to its pyrrolidine chiral center.',
    applications: ['Tobacco analysis', 'Pharmaceutical research', 'Toxicology studies']
  },
  {
    id: 'rutherford-scattering',
    name: 'Rutherford Scattering Experiment',
    description: 'Alpha particle scattering by gold foil revealing atomic structure',
    type: 'scattering',
    compound: 'Gold Foil (Au)',
    theory: 'Rutherford fired alpha particles at thin gold foil. Most passed through, but some deflected at large angles, proving atoms have dense nuclei. Setup: radioactive source (radium/polonium) → collimating slits → gold foil (few atoms thick) → zinc sulfide detector screen → microscope for observation.',
    applications: ['Atomic structure discovery', 'Nuclear physics foundation', 'Particle detection methods']
  }
];
