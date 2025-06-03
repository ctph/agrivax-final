import React from 'react';
import { Card, Button, Typography } from 'antd';
import Protein3DMol from './Protein3DMol'; 
import { useNavigate } from 'react-router-dom';
import './MobileViewer.css';

const { Title } = Typography;

const Mobile3DMolViewer = ({ pdbId, metadata }) => {
  const navigate = useNavigate();

  const handleThresholdClick = (percent) => {
    navigate(`/percent/${pdbId}/${percent}`);
  };

  // Consistent card style
  const cardStyle = {
    marginTop: '1rem',
    borderRadius: '10px',
    width: '100%'
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Title + Buttons */}
      <div className="pdb-header">
        <Title level={3} className="pdb-title">
          Structure Viewer for {pdbId.toUpperCase()}
        </Title>

        <div className="threshold-buttons">
          <Button type="primary" onClick={() => handleThresholdClick(50)}>50% Similarity</Button>
          <Button onClick={() => handleThresholdClick(65)}>65% Similarity</Button>
          <Button onClick={() => handleThresholdClick(75)}>75% Similarity</Button>
        </div>
      </div>

      {/* 3Dmol Viewer inside a Card */}
      <Card
        title="3D Structure"
        style={cardStyle}
        bodyStyle={{ padding: 0, height: '45vh' }}
      >
        <div id="viewer-container">
          <Protein3DMol pdbId={pdbId} />
        </div>
      </Card>

      {/* Metadata */}
      <Card 
        title="Protein Metadata" 
        style={cardStyle}
      >
        <p><strong>Classification:</strong> {metadata.classification}</p>
        <p><strong>Melting Point:</strong> {metadata.melting_point}</p>
        <p><strong>Notes:</strong> {metadata.notes}</p>
      </Card>
    </div>
  );
};

export default Mobile3DMolViewer;