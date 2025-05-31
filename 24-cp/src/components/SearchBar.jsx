import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { useNavigate } from 'react-router-dom';


const SearchBar = () => {
 const [value, setValue] = useState(null);
 const [options, setOptions] = useState([]);
 const navigate = useNavigate();


 useEffect(() => {
   fetch('/filtered_pdbs_list.json')
     .then(res => res.json())
     .then(data => {
       const opt = data.map(filename => ({
         label: filename.replace('.pdb', ''), // display without extension
         value: filename                     // keep full filename
       }));
       setOptions(opt);
     });
 }, []);


 const handleChange = (selectedFilename) => {
   const pdbId = selectedFilename.replace('.pdb', '').toLowerCase();
   setValue(selectedFilename);
   navigate(`/similarity/${pdbId}`); // where pdbId is "1a1p_a", for example
 };


 return (
   <Select
     showSearch
     value={value}
     placeholder="Search PDBs"
     style={{ width: '100%' }}
     options={options}
     onChange={handleChange}
     filterOption={(input, option) =>
       option?.label?.toUpperCase().includes(input.toUpperCase())
     }
   />
 );
};

export default SearchBar;