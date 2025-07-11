import React from 'react';
import './HomePage.css';
import SearchBar from '../components/SearchBar';
import PdbTable from '../components/PdbTable';
import Header from "../components/Header";
import { Space } from 'antd'; 
const HomePage = ({ allOptions }) => {
  const handleSearch = (query) => {
    console.log('User searched for:', query);
  };

  return (
    <div className="home-container">
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Header />
        <SearchBar allOptions={allOptions} />
        <div style={{ marginTop: 32 }}>
          <PdbTable />
        </div>
      </Space>
    </div>
  );
};

export default HomePage;