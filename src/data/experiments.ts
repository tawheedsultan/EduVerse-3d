
export interface Experiment {
  id: string;
  name: string;
  description: string;
  type: 'polarimetry' | 'optical_rotation';
  compound: string;
  expectedRotation: number;
  theory: string;
  applications: string[];
}

export const experiments: Experiment[] = [
  {
    id: 'polarimetry-glucose',
    name: 'Polarimetry of D-Glucose',
    description: 'Measuring the optical rotation of D-glucose solution to determine its concentration',
    type: 'polarimetry',
    compound: 'D-Glucose',
    expectedRotation: +52.7,
    theory: 'D-glucose is dextrorotatory, rotating plane-polarized light clockwise. The specific rotation is +52.7° at 20°C.',
    applications: ['Sugar analysis', 'Pharmaceutical quality control', 'Food industry']
  },
  {
    id: 'optical-rotation-fructose',
    name: 'Optical Rotation of D-Fructose',
    description: 'Observing the levorotatory nature of D-fructose through polarimetry',
    type: 'optical_rotation',
    compound: 'D-Fructose',
    expectedRotation: -92.4,
    theory: 'Despite being a D-sugar, fructose is levorotatory with a specific rotation of -92.4°.',
    applications: ['Sweetener analysis', 'Biochemical research', 'Food science']
  },
  {
    id: 'polarimetry-sucrose',
    name: 'Sucrose Hydrolysis Monitoring',
    description: 'Tracking the inversion of sucrose to glucose and fructose through optical rotation changes',
    type: 'polarimetry',
    compound: 'Sucrose',
    expectedRotation: +66.5,
    theory: 'Sucrose (+66.5°) hydrolyzes to glucose (+52.7°) and fructose (-92.4°), resulting in inversion.',
    applications: ['Sugar processing', 'Enzyme kinetics', 'Food chemistry']
  },
  {
    id: 'optical-rotation-tartaric',
    name: 'Tartaric Acid Stereoisomers',
    description: 'Comparing optical activities of different tartaric acid stereoisomers',
    type: 'optical_rotation',
    compound: 'L-(+)-Tartaric Acid',
    expectedRotation: +12.0,
    theory: 'Different stereoisomers of tartaric acid show different optical rotations due to their chirality.',
    applications: ['Stereochemistry studies', 'Wine chemistry', 'Pharmaceutical analysis']
  }
];
