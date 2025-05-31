import React, { useState } from 'react';
import { Card, Typography, Input } from 'antd';
import { Button, Space } from 'antd';
import JSmolViewer from '../feature/JSMolViewer';
import PdbInfo from '../components/PdbInfo';


const { Title } = Typography;


const SimilarityPage = () => {
 const [pdbId, setPdbId] = useState('1a1p_a');
 const [similarityThreshold, setSimilarityThreshold] = useState(0.5);


 const handleSearch = (val) => {
   const cleanId = val.toLowerCase().replace('.pdb', '');
   setPdbId(cleanId);
 };


 const handleSetThreshold = (value) => {
   setSimilarityThreshold(value);
   console.log(`Set threshold to: ${value * 100}%`);
 };


 return (
   <div style={{ padding: '24px' }}>
     <Title level={2}>
       Structure Similarity Viewer For {pdbId.toUpperCase()}
     </Title>


     {/* 🔘 Buttons under title */}
     <Space style={{ marginBottom: '24px', size: 'large'}}>
       <Button type='primary' style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} onClick={() => handleSetThreshold(0.5)}>50%</Button>
       <Button type='primary' style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} onClick={() => handleSetThreshold(0.65)}>65%</Button>
       <Button type='primary' style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }} onClick={() => handleSetThreshold(0.75)}>75%</Button>
     </Space>


     {/* 🔄 Viewer and Metadata side-by-side */}
     <div
       style={{
         display: 'grid',
         gridTemplateColumns: '1fr 1fr',
         gap: '24px',
         height: '80vh',
       }}
     >
       <Card title="3D Viewer" style={{ height: '100%' }}>
         <JSmolViewer pdbFile={`/clean_pdbs/${pdbId.split('_')[0].toLowerCase()}.pdb`} />
       </Card>


       <Card title="Metadata Info" style={{ height: '100%', overflowY: 'auto' }}>
         <PdbInfo pdbId={pdbId} />
       </Card>
     </div>
   </div>
 );
};

export default SimilarityPage;
