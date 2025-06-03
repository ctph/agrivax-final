import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Button, Flex, Card, Typography, Tag, Divider, Space } from "antd";
import * as $3Dmol from "3dmol";
import Protein3DMol from "../components/Protein3DMol";
import { InfoCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Grid } from 'antd'; // Ant Design's responsive hook

const { useBreakpoint } = Grid;

const { Title, Text } = Typography;

const ProteinContent = () => {
  const { pdbId: rawParam } = useParams();
  const navigate = useNavigate();
  // const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

  const screens = useBreakpoint();
  const isMobile = !screens.md; 

  const normalizedPdbId = rawParam?.toUpperCase().includes("_")
    ? rawParam.toUpperCase()
    : `${rawParam?.toUpperCase()}_a`;

  const [pdbStructure, setPdbStructure] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

    const handleSimilarityClick = (threshold) => {
    const baseId = rawParam.split('_')[0].toLowerCase(); // Remove chain suffix if present
    navigate(`/percent/${baseId}/${threshold}`);
  };

  useEffect(() => {
    const cleanPdbId = rawParam.split("_")[0].toLowerCase();

    const pdbUrl = `https://two4-cp-backend2.onrender.com/filtered_pdbs/${normalizedPdbId}.pdb`;
    console.log('Fetching PDB from:', pdbUrl);  

    fetch(pdbUrl)
      .then((res) => {
        if (!res.ok) throw new Error("PDB file not found");
        return res.text();
      })
      .then((text) => {
        if (!text || text.trim().length === 0) {
          throw new Error("Empty PDB file content");
        }
        setPdbStructure(text);
      })

      .catch((err) => {
        setError(err.message);
        setPdbStructure(null);
      });

    // Fetch metadata
    fetch(`https://data.rcsb.org/rest/v1/core/entry/${cleanPdbId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch metadata");
        return res.json();
      })
      .then((json) => {
        setMetadata(json);
      })
      .catch((err) => {
        console.error("Error fetching metadata:", err);
        setMetadata(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [normalizedPdbId, rawParam]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" style={{ height: "80vh" }}>
        <Spin size="large" tip="Loading protein structure..." />
      </Flex>
    );
  }

  if (error || !pdbStructure) {
    return (
      <Flex vertical justify="center" align="center" style={{ height: "80vh", gap: 16 }}>
        <Title level={4} type="danger">
          {error || "Protein structure not found"}
        </Title>
        <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Flex>
    );
  }

  
  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        
        {/* TITLE + BUTTONS */}
        {isMobile ? (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <Title level={2}>{rawParam.toUpperCase()} Structure Viewer</Title>
            <div className="threshold-buttons">
              <Button onClick={() => handleSimilarityClick(50)}>50%</Button>
              <Button onClick={() => handleSimilarityClick(65)}>65%</Button>
              <Button onClick={() => handleSimilarityClick(75)}>75%</Button>
              <Button 
                type="primary" 
                href={`https://www.rcsb.org/structure/${rawParam.split('_')[0].toUpperCase()}`}
                target="_blank"
              >
                View on RCSB
              </Button>
            </div>
          </div>
        ) : (
          <Flex justify="space-between" align="center">
            <Title level={2} style={{ margin: 0 }}>
              {rawParam.toUpperCase()} Structure Viewer
            </Title>
            <Space>
              <Button.Group>
                <Button onClick={() => handleSimilarityClick(50)}>50%</Button>
                <Button onClick={() => handleSimilarityClick(65)}>65%</Button>
                <Button onClick={() => handleSimilarityClick(75)}>75%</Button>
              </Button.Group>
              <Button 
                type="primary" 
                href={`https://www.rcsb.org/structure/${rawParam.split('_')[0].toUpperCase()}`}
                target="_blank"
              >
                View on RCSB
              </Button>
            </Space>
          </Flex>
        )}

        <Divider style={{ margin: "16px 0" }} />

        <Flex justify="space-between" gap={24} style={{ flexWrap: "wrap" }}>
          {/* 3D Viewer */}
          <Card
            title={
              <Space>
                <Text strong>3D Structure</Text>
                <Tag color="blue">Interactive</Tag>
              </Space>
            }
            style={{
              flex: isMobile ? "unset" : 1,
              width: isMobile ? "400px" : "auto",
              borderRadius: "12px",
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              border: "1px solid #f0f0f0",
            }}
            bodyStyle={{
              padding: isMobile ? "16px" : 0,
              backgroundColor: "#fafafa",
            }}
          >
            {!isMobile ? (
              <div
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <Protein3DMol
                  pdbIdStructure={pdbStructure}
                  viewStyle={[{}, { cartoon: {} }]}
                  surfaceStyle={null}
                  partialViewStyle={null}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "0 0 12px 12px",
                }}
              >
                <Protein3DMol
                  pdbIdStructure={pdbStructure}
                  viewStyle={[{}, { cartoon: {} }]}
                  surfaceStyle={null}
                  partialViewStyle={null}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </div>
            )}
          </Card>


          {/* Metadata */}
          <Card
            title={
              <Space>
                <Text strong>Structure Information</Text>
                <Tag icon={<InfoCircleOutlined />} color="cyan">
                  Details
                </Tag>
              </Space>
            }
            style={{
              width: "400px",
              borderRadius: "12px",
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
              border: "1px solid #f0f0f0",
            }}
          >
            {metadata ? (
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary">Title</Text>
                  <div style={{ marginTop: 4 }}>
                    {metadata.struct?.title || "Not available"}
                  </div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <Flex justify="space-between">
                  <div>
                    <Text type="secondary">Method</Text>
                    <div style={{ marginTop: 4 }}>
                      {metadata.exptl?.[0]?.method || "N/A"}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">Released</Text>
                    <div style={{ marginTop: 4 }}>
                      {metadata.rcsb_accession_info?.initial_release_date || "N/A"}
                    </div>
                  </div>
                </Flex>

                <Divider style={{ margin: "8px 0" }} />

                <div>
                  <Text type="secondary">Organism</Text>
                  <div style={{ marginTop: 4 }}>
                    {metadata.rcsb_entity_source_organism?.[0]?.organism_scientific_name || "Unknown"}
                  </div>
                </div>

                {metadata.pdbx_database_status?.status && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <div>
                      <Text type="secondary">Status</Text>
                      <div style={{ marginTop: 4 }}>
                        <Tag color={
                          metadata.pdbx_database_status.status === "REL" ? "green" : "orange"
                        }>
                          {metadata.pdbx_database_status.status === "REL" 
                            ? "Released" 
                            : metadata.pdbx_database_status.status}
                        </Tag>
                      </div>
                    </div>
                  </>
                )}
              </Space>
            ) : (
              <Flex justify="center" align="center" style={{ height: "100px" }}>
                <Text type="secondary">No metadata available</Text>
              </Flex>
            )}
          </Card>
        </Flex>

        {/* Additional controls could go here */}
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Button 
            type="default" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/")}
          >
            Back to Search
          </Button>
        </Flex>
      </Space>
    </div>
  );
};

export default ProteinContent;