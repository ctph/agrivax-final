import React, { useState, useEffect } from 'react';
import { Card, Typography, Input, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import JSmolViewer from '../feature/JSMolViewer';
import PdbInfo from '../components/PdbInfo';

const { Title } = Typography;

const SimilarityPage = () => {
  const { pdbId: paramPdbId } = useParams();
  const navigate = useNavigate();

  const [pdbId, setPdbId] = useState(paramPdbId || '1a1p_a');

  // Sync pdbId when URL param changes
  useEffect(() => {
    if (paramPdbId && paramPdbId !== pdbId) {
      setPdbId(paramPdbId.toLowerCase());
    }
  }, [paramPdbId]);

  // Compute the viewer ID (force _a if no chain specified)
  const viewerId = pdbId.includes('_') ? pdbId.toLowerCase() : `${pdbId.toLowerCase()}_a`;

  // Handle manual search
  const handleSearch = (val) => {
    const cleanId = val.trim().toLowerCase().replace('.pdb', '');
    const finalId = cleanId.includes('_') ? cleanId : `${cleanId}_a`;
    setPdbId(finalId);
    navigate(`/similarity/${finalId}`);
  };

  // Handle similarity threshold button click
  const handleSetThreshold = (value) => {
    const percentage = value * 100;
    navigate(`/percent/${pdbId}/${percentage}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        Structure Similarity Viewer For {pdbId.toUpperCase()}
      </Title>

      <Space style={{ marginBottom: 24 }}>
        <Button onClick={() => handleSetThreshold(0.5)}>50%</Button>
        <Button onClick={() => handleSetThreshold(0.65)}>65%</Button>
        <Button onClick={() => handleSetThreshold(0.75)}>75%</Button>
      </Space>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          height: '80vh',
        }}
      >
        <Card title="3D Viewer" style={{ height: '100%' }}>
          <JSmolViewer pdbFile={`/filtered_pdbs/${viewerId}.pdb`} />
        </Card>

        <Card title="Metadata Info" style={{ height: '100%', overflowY: 'auto' }}>
          <PdbInfo pdbId={pdbId} />
        </Card>
      </div>
    </div>
  );
};

export default SimilarityPage;
