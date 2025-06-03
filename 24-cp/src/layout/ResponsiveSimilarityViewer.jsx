import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import SimilarityPage from '../layout/SimilarityPage';
import Mobile3DMolViewer from '../components/Mobile3DMolViewer';

const ResponsiveSimilarityViewer = () => {
  const { pdbId } = useParams(); 
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  const coreId = pdbId.split('_')[0].toLowerCase(); // Remove chain suffix

  useEffect(() => {
    fetch(`https://data.rcsb.org/rest/v1/core/entry/${coreId}`)
      .then((res) => {
        if (!res.ok) throw new Error("PDB not found");
        return res.json();
      })
      .then((data) => {
        setMetadata({
          classification: data.struct_keywords?.pdbx_keywords || "Unknown",
          melting_point: "N/A", // RCSB doesn't provide this directly
          notes: data.struct?.title || "No title available"
        });
      })
      .catch((err) => {
        setError(err.message);
        setMetadata({
          classification: "Unknown",
          melting_point: "N/A",
          notes: "Failed to load metadata"
        });
      });
  }, [coreId]);

  if (!metadata) return <p>Loading metadata for {coreId.toUpperCase()}...</p>;

  return isMobile ? (
    <Mobile3DMolViewer pdbId={pdbId} metadata={metadata} />
  ) : (
    <SimilarityPage />
  );
};

export default ResponsiveSimilarityViewer;
