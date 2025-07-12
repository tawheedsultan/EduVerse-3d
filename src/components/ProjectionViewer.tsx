
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Molecule } from '@/data/molecules';

interface ProjectionViewerProps {
  molecule: Molecule;
  projectionType: 'newman' | 'fischer' | 'wedge';
}

const ProjectionViewer = ({ molecule, projectionType }: ProjectionViewerProps) => {
  const getProjectionTitle = () => {
    switch (projectionType) {
      case 'newman':
        return 'Newman Projection';
      case 'fischer':
        return 'Fischer Projection';
      case 'wedge':
        return 'Wedge-Dash Projection';
      default:
        return 'Projection';
    }
  };

  const getProjectionDescription = () => {
    switch (projectionType) {
      case 'newman':
        return 'View along a C-C bond showing rotation around the bond axis';
      case 'fischer':
        return 'Standardized 2D representation showing stereochemistry';
      case 'wedge':
        return '3D representation using wedges and dashes for stereochemistry';
      default:
        return 'Molecular projection';
    }
  };

  // Simple 2D projection rendering
  const renderProjection = () => {
    if (projectionType === 'newman') {
      return (
        <div className="flex items-center justify-center h-full">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Newman projection for ethane-like molecules */}
            <circle cx="150" cy="150" r="80" fill="none" stroke="#333" strokeWidth="3" />
            
            {/* Front carbon bonds */}
            <line x1="150" y1="70" x2="150" y2="130" stroke="#333" strokeWidth="2" />
            <line x1="85" y1="112" x2="145" y2="152" stroke="#333" strokeWidth="2" />
            <line x1="215" y1="112" x2="155" y2="152" stroke="#333" strokeWidth="2" />
            
            {/* Back carbon bonds (staggered) */}
            <line x1="150" y1="170" x2="150" y2="230" stroke="#333" strokeWidth="2" />
            <line x1="105" y1="188" x2="145" y2="148" stroke="#333" strokeWidth="2" />
            <line x1="195" y1="188" x2="155" y2="148" stroke="#333" strokeWidth="2" />
            
            {/* Atom labels */}
            <text x="150" y="60" textAnchor="middle" className="text-sm font-bold">H</text>
            <text x="75" y="110" textAnchor="middle" className="text-sm font-bold">H</text>
            <text x="225" y="110" textAnchor="middle" className="text-sm font-bold">H</text>
            <text x="150" y="245" textAnchor="middle" className="text-sm font-bold">H</text>
            <text x="95" y="185" textAnchor="middle" className="text-sm font-bold">H</text>
            <text x="205" y="185" textAnchor="middle" className="text-sm font-bold">H</text>
            
            <text x="150" y="280" textAnchor="middle" className="text-xs text-gray-600">
              Looking down C-C bond
            </text>
          </svg>
        </div>
      );
    }

    if (projectionType === 'fischer') {
      return (
        <div className="flex items-center justify-center h-full">
          <svg width="300" height="400" viewBox="0 0 300 400">
            {/* Fischer projection */}
            <line x1="150" y1="50" x2="150" y2="350" stroke="#333" strokeWidth="3" />
            <line x1="50" y1="150" x2="250" y2="150" stroke="#333" strokeWidth="3" />
            <line x1="50" y1="250" x2="250" y2="250" stroke="#333" strokeWidth="3" />
            
            {/* Atom labels */}
            <text x="150" y="40" textAnchor="middle" className="text-lg font-bold">CHO</text>
            <text x="40" y="155" textAnchor="middle" className="text-lg font-bold">H</text>
            <text x="260" y="155" textAnchor="middle" className="text-lg font-bold">OH</text>
            <text x="40" y="255" textAnchor="middle" className="text-lg font-bold">OH</text>
            <text x="260" y="255" textAnchor="middle" className="text-lg font-bold">H</text>
            <text x="150" y="370" textAnchor="middle" className="text-lg font-bold">CH₂OH</text>
            
            <text x="150" y="390" textAnchor="middle" className="text-xs text-gray-600">
              Stereochemical representation
            </text>
          </svg>
        </div>
      );
    }

    if (projectionType === 'wedge') {
      return (
        <div className="flex items-center justify-center h-full">
          <svg width="350" height="300" viewBox="0 0 350 300">
            {/* Central carbon */}
            <circle cx="175" cy="150" r="8" fill="#404040" />
            
            {/* Wedge bond (coming out) */}
            <polygon 
              points="175,150 220,100 225,105 180,155" 
              fill="#333" 
              stroke="#333" 
            />
            
            {/* Dash bond (going in) */}
            <g stroke="#333" strokeWidth="3" strokeDasharray="8,4">
              <line x1="175" y1="150" x2="125" y2="200" />
            </g>
            
            {/* Regular bonds */}
            <line x1="175" y1="150" x2="175" y2="100" stroke="#333" strokeWidth="3" />
            <line x1="175" y1="150" x2="175" y2="200" stroke="#333" strokeWidth="3" />
            
            {/* Atom labels */}
            <text x="175" y="90" textAnchor="middle" className="text-lg font-bold">H</text>
            <text x="230" y="100" textAnchor="middle" className="text-lg font-bold">Cl</text>
            <text x="115" y="210" textAnchor="middle" className="text-lg font-bold">Br</text>
            <text x="175" y="220" textAnchor="middle" className="text-lg font-bold">F</text>
            <text x="175" y="160" textAnchor="middle" className="text-sm font-bold">C</text>
            
            {/* Legend */}
            <g transform="translate(20, 20)">
              <polygon points="0,0 30,0 15,8" fill="#333" />
              <text x="35" y="6" className="text-xs">Wedge (out of page)</text>
              
              <g transform="translate(0, 20)" stroke="#333" strokeWidth="2" strokeDasharray="4,2">
                <line x1="0" y1="0" x2="30" y2="0" />
              </g>
              <text x="35" y="24" className="text-xs">Dash (into page)</text>
            </g>
          </svg>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Projection view not implemented</p>
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-b from-slate-50 to-slate-100 rounded-lg overflow-hidden">
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{getProjectionTitle()}</h3>
            <p className="text-sm text-gray-600">{getProjectionDescription()}</p>
          </div>
          <Badge variant="secondary">{molecule.formula}</Badge>
        </div>
      </div>
      
      <div className="h-full p-4">
        {renderProjection()}
      </div>
    </div>
  );
};

export default ProjectionViewer;
