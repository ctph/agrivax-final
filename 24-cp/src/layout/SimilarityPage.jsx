import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Button,
  Flex,
  Card,
  Typography,
  Tag,
  Divider,
  Space,
} from "antd";
import Protein3DMol from "../components/Protein3DMol";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Grid } from "antd";
import "./SimilarityPage.css";
import Header from "../components/Header";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const ProteinContent = () => {
  const { pdbId: rawParam } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const normalizedPdbId = rawParam?.toUpperCase().includes("_")
    ? rawParam.toUpperCase()
    : `${rawParam?.toUpperCase()}_A`;

  const [pdbStructure, setPdbStructure] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [organism, setOrganism] = useState("Unknown");
  const [classification, setClassification] = useState("Unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderMode, setRenderMode] = useState("cartoon");

  const getViewStyle = () => {
    if (renderMode === "cartoon") {
      return [{}, { cartoon: { color: "spectrum" } }];
    } else if (renderMode === "stick") {
      return [{}, { stick: { radius: 0.2 } }];
    }
    return [{}];
  };

  const handleSimilarityClick = (threshold) => {
    const baseId = rawParam.split("_")[0].toLowerCase();
    navigate(`/percent/${baseId}/${threshold}`);
  };

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      setError(null);

      const cleanPdbId = rawParam.split("_")[0].toLowerCase();
      const pdbUrl = `https://two4-cp-backend2.onrender.com/filtered_pdbs/${normalizedPdbId}.pdb`;

      try {
        // Fetch PDB and entry metadata in parallel
        const [pdbRes, entryRes] = await Promise.all([
          fetch(pdbUrl),
          fetch(`https://data.rcsb.org/rest/v1/core/entry/${cleanPdbId}`),
        ]);

        if (!pdbRes.ok) throw new Error("PDB file not found");
        if (!entryRes.ok) throw new Error("Failed to fetch metadata");

        const pdbText = await pdbRes.text();
        if (!pdbText || pdbText.trim().length === 0) {
          throw new Error("Empty PDB file content");
        }
        setPdbStructure(pdbText);

        const entryJson = await entryRes.json();
        setMetadata(entryJson);
        console.log("RCSB entry JSON", cleanPdbId, entryJson);

        // Classification
        const cls =
          entryJson.struct_keywords?.pdbx_keywords ||
          entryJson.struct_keywords?.text ||
          "Unknown";
        setClassification(cls);

        // Organism
        // 1) Try entry-level organism list
        let org =
          entryJson.rcsb_entry_info?.deposited_organism_list?.[0] || null;

        // 2) If still missing, loop over all polymer entities for this entry
        if (!org) {
          const entityIds =
            entryJson.rcsb_entry_container_identifiers?.polymer_entity_ids ||
            [];
          console.log("polymer_entity_ids for", cleanPdbId, entityIds);

          for (const entityId of entityIds) {
            try {
              const entityRes = await fetch(
                `https://data.rcsb.org/rest/v1/core/polymer_entity/${cleanPdbId}/${entityId}`
              );
              if (!entityRes.ok) continue;

              const entityJson = await entityRes.json();
              console.log(
                `polymer_entity ${cleanPdbId}_${entityId}`,
                entityJson
              );

              const candidate =
                entityJson.rcsb_entity_source_organism?.[0]
                  ?.organism_scientific_name ||
                entityJson.entity_src_nat?.[0]?.pdbx_organism_scientific ||
                entityJson.entity_src_gen?.[0]?.pdbx_gene_src_scientific_name ||
                null;

              if (candidate) {
                org = candidate;
                break;
              }
            } catch (err) {
              console.warn(
                "Error fetching polymer_entity metadata:",
                cleanPdbId,
                entityId,
                err
              );
            }
          }
        }

        setOrganism(org || "Unknown");
      } catch (e) {
        console.error(e);
        setError(e.message);
        setPdbStructure(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
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
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ height: "80vh", gap: 16 }}
      >
        <Title level={4} type="danger">
          {error || "Protein structure not found"}
        </Title>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Flex>
    );
  }

  return (
    <div className="percent-page-container">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Header />

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
                href={`https://www.rcsb.org/structure/${rawParam
                  .split("_")[0]
                  .toUpperCase()}`}
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
              <Text strong>Cluster of similarity:</Text>
              <Button.Group>
                <Button onClick={() => handleSimilarityClick(50)}>50%</Button>
                <Button onClick={() => handleSimilarityClick(65)}>65%</Button>
                <Button onClick={() => handleSimilarityClick(75)}>75%</Button>
              </Button.Group>
              <Button
                type="primary"
                href={`https://www.rcsb.org/structure/${rawParam
                  .split("_")[0]
                  .toUpperCase()}`}
                target="_blank"
              >
                View on RCSB
              </Button>
            </Space>
          </Flex>
        )}

        <Flex align="center" gap={12} wrap>
          {/* LEFT: View Mode */}
          <Flex align="center" gap={8}>
            <Text strong>View Mode:</Text>

            <Button
              type={renderMode === "cartoon" ? "primary" : "default"}
              onClick={() => setRenderMode("cartoon")}
            >
              Cartoon
            </Button>

            <Button
              type={renderMode === "stick" ? "primary" : "default"}
              onClick={() => setRenderMode("stick")}
            >
              Stick
            </Button>
          </Flex>

          {/* RIGHT: Cyclization (push right) */}
          <Flex align="center" gap={8} style={{ marginLeft: "auto" }}>
            <Text strong>Cyclization Class:</Text>

            <Button.Group>
              <Button>s2s</Button>
              <Button>s2e</Button>
              <Button>e2e</Button>
              <Button>e2e + s2s</Button>
              <Button>s2e + s2s</Button>
            </Button.Group>
          </Flex>
        </Flex>

        <Flex justify="space-between" gap={24} style={{ flexWrap: "wrap" }}>
          {/* 3D Viewer */}
          <Card
            className="similarity-card"
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
            <div
              style={{
                height: "400px",
                width: "100%",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <Protein3DMol
                pdbIdStructure={pdbStructure}
                viewStyle={getViewStyle()}
                surfaceStyle={null}
                partialViewStyle={null}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </Card>

          {/* Metadata */}
          <Card
            title={
              <Space>
                <Text strong>Structure Information</Text>
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
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
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
                      {metadata.rcsb_accession_info?.initial_release_date ||
                        "N/A"}
                    </div>
                  </div>
                </Flex>

                <Divider style={{ margin: "8px 0" }} />

                <div>
                  <Text type="secondary">Organism</Text>
                  <div style={{ marginTop: 4 }}>{organism}</div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                <div>
                  <Text type="secondary">Classification</Text>
                  <div style={{ marginTop: 4 }}>{classification}</div>
                </div>

                {metadata.pdbx_database_status?.status && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <div>
                      <Text type="secondary">Status</Text>
                      <div style={{ marginTop: 4 }}>
                        <Tag
                          color={
                            metadata.pdbx_database_status.status === "REL"
                              ? "green"
                              : "orange"
                          }
                        >
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
      </Space>
    </div>
  );
};

export default ProteinContent;
