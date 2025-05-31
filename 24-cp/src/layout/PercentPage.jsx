import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Typography, Card, Table, Tag } from 'antd';

const { Title } = Typography;

const PercentPage = () => {
  const { pdbId, threshold } = useParams(); 
  const [similarData, setSimilarData] = useState([]);

  useEffect(() => {
    Papa.parse('/sequence_similarity_output.csv', {
      header: true,
      download: true,
      complete: (result) => {
        const data = result.data;

        const cleanId = pdbId.split('_')[0].toUpperCase(); // strip _a if present
        const target = data.find(row => row.pdb_id?.toUpperCase() === cleanId);

        if (!target) return;

        const simField = `similarity_${threshold}`;
        const similarIds = target[simField]
          ?.replaceAll('"', '')
          .split(',')
          .map(id => id.trim().toUpperCase())
          .filter(Boolean);

        const matchedRows = data
          .filter(row => similarIds.includes(row.pdb_id?.toUpperCase()))
          .map(row => ({
            key: row.pdb_id,
            pdb_id: row.pdb_id,
            sequence: row.sequence,
            classification: row.Classification,
            melting: row['melting point (K)'],
          }));

        setSimilarData(matchedRows);
      },
    });
  }, [pdbId, threshold]);

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'pdb_id',
      key: 'pdb_id',
      render: (id) => (
        <Link to={`/similarity/${id.toLowerCase()}_a`}>
          <Tag color="blue">{id}</Tag>
        </Link>
      ),
    },
    {
      title: 'Sequence',
      dataIndex: 'sequence',
      key: 'sequence',
      render: (seq) => <span style={{ fontFamily: 'monospace' }}>{seq}</span>,
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      key: 'classification',
    },
    {
      title: 'Melting Point (K)',
      dataIndex: 'melting',
      key: 'melting',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>
        Similar Structures to {pdbId?.toUpperCase()} at {threshold}% Similarity
      </Title>

      <Card>
        <Table
          dataSource={similarData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>
    </div>
  );
};

export default PercentPage;
