import React, { useEffect, useRef, useState } from 'react';
import $3Dmol from '3dmol';
import './MolecularViewer.css'; // Component-specific styles

const MoleculeViewer = ({ pdbId, width = '100%', height = '400px' }) => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let viewer;
    let resizeObserver;

    const initViewer = async () => {
      try {
        if (!canvasRef.current || !pdbId) return;

        // 1. Verify WebGL support
        if (!detectWebGL()) {
          throw new Error('WebGL not supported in your browser');
        }

        // 2. Ensure proper canvas dimensions
        const canvas = canvasRef.current;
        const updateDimensions = () => {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        };
        updateDimensions();

        // 3. Initialize viewer with retry logic
        viewer = await initialize3DMol(canvas, updateDimensions);

        // 4. Load molecule data
        await loadMolecule(viewer, pdbId);

        // 5. Set up resize observer
        resizeObserver = new ResizeObserver(() => {
          updateDimensions();
          viewer.resize();
          viewer.render();
        });
        resizeObserver.observe(canvas);

        setStatus('ready');
      } catch (error) {
        console.error('MoleculeViewer error:', error);
        setStatus('error');
        setErrorMsg(error.message);
      }
    };

    initViewer();

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (viewer) viewer.clear();
    };
  }, [pdbId]);

  return (
    <div className="molecule-viewer-container" style={{ width, height }}>
      {status === 'loading' && (
        <div className="status-message loading">Loading {pdbId}...</div>
      )}
      
      {status === 'error' && (
        <div className="status-message error">
          Error: {errorMsg}
          <button onClick={() => setStatus('loading')}>Retry</button>
        </div>
      )}

      <canvas 
        ref={canvasRef} 
        className="molecule-canvas"
        style={{ display: status === 'ready' ? 'block' : 'none' }}
      />
    </div>
  );
};

// Helper functions (could be moved to utils.js)
const detectWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
};

const initialize3DMol = async (canvas, onRetry) => {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      return $3Dmol.createViewer(canvas, {
        defaultcolors: $3Dmol.rasmolElementColors,
        backgroundColor: 'white'
      });
    } catch (error) {
      retries++;
      if (retries >= maxRetries) throw error;
      onRetry();
      await new Promise(resolve => setTimeout(resolve, 300 * retries));
    }
  }
};

const loadMolecule = async (viewer, pdbId) => {
  const response = await fetch(`https://files.rcsb.org/view/${pdbId}.pdb`);
  if (!response.ok) throw new Error(`Failed to fetch ${pdbId}`);
  
  const text = await response.text();
  viewer.addModel(text, "pdb");
  viewer.setStyle({}, { cartoon: {} });
  viewer.zoomTo();
  viewer.render();
};

export default React.memo(MoleculeViewer);