import React from 'react';
import './HomePage.css';
import SearchBar from '../components/SearchBar';
import UploadButton from '../components/UploadButton';
import PdbTable from '../components/PdbTable';


const HomePage = ({ allOptions }) => {
 const handleSearch = (query) => {
   console.log('User searched for:', query);
 };


 return (
   <div className="home-container">
     <h1 className="home-title">24 Cyclic Peptide</h1>
     <SearchBar allOptions={allOptions} />
     <div style={{ marginTop: '1.5rem' }}>
       <UploadButton />
     </div>
     <div style={{ marginTop: 32 }}>
       <PdbTable />
     </div>
   </div>
 );
};


export default HomePage;
