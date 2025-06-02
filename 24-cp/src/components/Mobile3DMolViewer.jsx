import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import Protein3DMol from './Protein3DMol'; 
import { useNavigate } from 'react-router-dom';
import './MobileViewer.css';

const { Title } = Typography;

const Mobile3DMolViewer = ({ pdbId, metadata }) => {
  const navigate = useNavigate();

  console.log("pdbId passed to mobile viewer:", pdbId);
  console.log("Type of pdbId:", typeof pdbId); // Should be "string"

  const handleThresholdClick = (percent) => {
    navigate(`/percent/${pdbId}/${percent}`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* [1] Title */}
      <Title level={3} style={{ textAlign: 'center' }}>
        Structure similarity for {pdbId.toUpperCase()}
          🚨 Mobile3DMolViewer is rendering

      </Title>


      {/* [2] Threshold Buttons */}
      <Space align="center" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
        <Button type="primary" onClick={() => handleThresholdClick(50)}>50%</Button>
        <Button onClick={() => handleThresholdClick(65)}>65%</Button>
        <Button onClick={() => handleThresholdClick(75)}>75%</Button>
      </Space>

      {/* [3] 3Dmol Viewer */}
      <div id="viewer-container">
        <Protein3DMol pdbId={pdbId} />
      </div>

      {/* [4] Metadata */}
      <Card title="Protein Metadata" style={{ marginTop: '1rem' }}>
        <p><strong>Classification:</strong> {metadata.classification}</p>
        <p><strong>Melting Point:</strong> {metadata.melting_point}</p>
        <p><strong>Notes:</strong> {metadata.notes}</p>
      </Card>
    </div>
  );
};

export default Mobile3DMolViewer;
