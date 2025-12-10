// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useMediaQuery } from 'react-responsive';
// import SimilarityPage from '../layout/SimilarityPage';
// import Mobile3DMolViewer from '../components/Mobile3DMolViewer';
// import { Card, Typography } from 'antd';
// import './ResponsiveSimilarViewer.css';

// const { Title } = Typography;

// const ResponsiveSimilarityViewer = () => {
//   const { pdbId } = useParams();
//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   const [metadata, setMetadata] = useState(null);
//   const [error, setError] = useState(null);

//   const coreId = pdbId.split('_')[0].toLowerCase();

//   useEffect(() => {
//     fetch(`https://data.rcsb.org/rest/v1/core/entry/${coreId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("PDB not found");
//         return res.json();
//       })
//       .then((data) => {
//         setMetadata({
//           classification: data.struct_keywords?.pdbx_keywords || "Unknown",
//           melting_point: "N/A",
//           notes: data.struct?.title || "No title available"
//         });
//       })
//       .catch((err) => {
//         setError(err.message);
//         setMetadata({
//           classification: "Unknown",
//           melting_point: "N/A",
//           notes: "Failed to load metadata"
//         });
//       });
//   }, [coreId]);

//   if (!metadata) return <p>Loading metadata for {coreId.toUpperCase()}...</p>;

//   return (
//     <div className="percent-page-container">
//       <Title level={2}>
//         Similar Structures to {pdbId.toUpperCase()}
//       </Title>

//       <Card className="similarity-card">
//         {isMobile ? (
//           <Mobile3DMolViewer pdbId={pdbId} metadata={metadata} />
//         ) : (
//           <SimilarityPage />
//         )}
//       </Card>
//     </div>
//   );
// };

// export default ResponsiveSimilarityViewer;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import SimilarityPage from "../layout/SimilarityPage";
import Mobile3DMolViewer from "../components/Mobile3DMolViewer";
import { Card, Typography, Spin, Alert } from "antd";
import "./ResponsiveSimilarViewer.css";

const { Title, Text } = Typography;

const ResponsiveSimilarityViewer = () => {
  const { pdbId } = useParams();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const coreId = pdbId.split("_")[0].toLowerCase();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://data.rcsb.org/rest/v1/core/entry/${coreId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${coreId}`);
        }

        const data = await response.json();
        setMetadata({
          classification: data.struct_keywords?.pdbx_keywords || "Unknown",
          melting_point: "N/A",
          notes: data.struct?.title || "No title available",
          experimental_method: data.exptl?.[0]?.method || "Unknown method",
        });
      } catch (err) {
        console.error("Error fetching metadata:", err);
        setError(err.message);
        setMetadata({
          classification: "Unknown",
          melting_point: "N/A",
          notes: "Failed to load metadata",
          experimental_method: "Unknown",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [coreId]);

  if (loading) {
    return (
      <div className="percent-page-container">
        <Spin tip={`Loading ${coreId.toUpperCase()}...`} size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="percent-page-container">
        <Alert
          message="Error Loading Data"
          description={`Could not load data for ${coreId.toUpperCase()}: ${error}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="percent-page-container">
      <Title level={2}>Similar Structures to {pdbId.toUpperCase()}</Title>

      <Card
        className="similarity-card"
        title={
          <Text strong>
            {metadata.notes} ({metadata.experimental_method})
          </Text>
        }
        extra={
          <Text type="secondary">
            Classification: {metadata.classification}
          </Text>
        }
      >
        {isMobile ? (
          <Mobile3DMolViewer pdbId={pdbId} metadata={metadata} />
        ) : (
          <SimilarityPage pdbId={pdbId} metadata={metadata} />
        )}
      </Card>
    </div>
  );
};

export default ResponsiveSimilarityViewer;
