import React from 'react';
import { Card } from 'antd';
import JSmolViewer from './JSMolViewer';
import PdbInfo from './PdbInfo';


const PDBViewer = ({ pdbId }) => {
 return (
   <div style={{
     display: 'grid',
     gridTemplateColumns: '1fr 1fr',
     gap: '20px',
     marginTop: '20px',
     height: '85vh'
   }}>
     <Card title="3D Structure Viewer" bordered={false} style={{ height: '100%' }}>
       <JSmolViewer pdbFile={`/clean_pdbs/${pdbId.toLowerCase()}.pdb`} />
     </Card>


     <Card title={`Metadata for ${pdbId.toUpperCase()}`} bordered={false} style={{ overflowY: 'auto' }}>
       <PdbInfo pdbId={pdbId} />
     </Card>
   </div>
 );
};


export default PDBViewer;
