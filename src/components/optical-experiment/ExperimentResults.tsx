
interface ExperimentResultsProps {
  observedRotation: number;
  compound: string;
}

const ExperimentResults = ({ observedRotation, compound }: ExperimentResultsProps) => {
  if (observedRotation === 0) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h4 className="font-semibold text-green-800 mb-2">Experimental Results</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Observed Rotation:</span>
          <span className="ml-2 font-medium">{observedRotation.toFixed(1)}°</span>
        </div>
        <div>
          <span className="text-gray-600">Compound:</span>
          <span className="ml-2 font-medium">{compound}</span>
        </div>
      </div>
      <p className="text-xs text-green-700 mt-2">
        This rotation indicates the compound is {observedRotation > 0 ? 'dextrorotatory (+)' : 'levorotatory (-)'} - 
        it rotates plane-polarized light {observedRotation > 0 ? 'clockwise' : 'counterclockwise'} when viewed towards the light source.
      </p>
    </div>
  );
};

export default ExperimentResults;
