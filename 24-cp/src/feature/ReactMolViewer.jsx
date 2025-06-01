import React from 'react';
import MolViewer from 'react-molviewer';

const ReactMolViewer = ({ url }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '70vh',
        minHeight: '500px',
        backgroundColor: '#f5f7fa',
        border: '2px solid #3a7bd5',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}
    >
      <MolViewer
        url={url}
        style={{ width: '100%', height: '100%' }}
        backgroundColor="#ffffff"
        zoom={1.2}
        cameraDistance={10}
      />
    </div>
  );
};

export default ReactMolViewer;
