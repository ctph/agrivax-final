// import React, { useState, useEffect } from 'react';
// import { Select } from 'antd';
// import { useNavigate } from 'react-router-dom';


// const SearchBar = () => {
//  const [value, setValue] = useState(null);
//  const [options, setOptions] = useState([]);
//  const navigate = useNavigate();


//  useEffect(() => {
//    fetch('/filtered_pdbs_list.json')
//      .then(res => res.json())
//      .then(data => {
//        const opt = data.map(filename => ({
//          label: filename.replace('.pdb', ''), // display without extension
//          value: filename                     // keep full filename
//        }));
//        setOptions(opt);
//      });
//  }, []);


//  const handleChange = (selectedFilename) => {
//    const pdbId = selectedFilename.replace('.pdb', '').toLowerCase();
//    setValue(selectedFilename);
//    navigate(`/similarity/${pdbId}`); // where pdbId is "1a1p_a", for example
//  };


//  return (
//    <Select
//      showSearch
//      value={value}
//      placeholder="Search PDBs"
//      style={{ width: '100%' }}
//      options={options}
//      onChange={handleChange}
//      filterOption={(input, option) =>
//        option?.label?.toUpperCase().includes(input.toUpperCase())
//      }
//    />
//  );
// };

// export default SearchBar;


import React, { useState, useEffect, useRef } from 'react';
import { Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import levenshtein from 'fast-levenshtein';

const SearchBar = () => {
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [allPdbIds, setAllPdbIds] = useState([]);
  const navigate = useNavigate();
  const lastSearchedTerm = useRef(null);

  useEffect(() => {
    fetch('/filtered_pdbs_list.json')
      .then(res => res.json())
      .then(data => {
        const pdbIds = data.map(filename => filename.replace('.pdb', '').toLowerCase());
        setAllPdbIds(pdbIds);
        
        const opt = data.map(filename => ({
          label: filename.replace('.pdb', ''),
          value: filename
        }));
        setOptions(opt);
      });
  }, []);

  const findNearestMatches = (searchTerm) => {
    const distances = allPdbIds.map(pdbId => ({
      pdbId,
      distance: levenshtein.get(searchTerm.toLowerCase(), pdbId.toLowerCase())
    }));

    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(item => item.pdbId);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 4) return;
    if (searchTerm === lastSearchedTerm.current) return;

    lastSearchedTerm.current = searchTerm;

    const exactMatch = allPdbIds.find(pdbId => 
      pdbId.toLowerCase() === searchTerm.toLowerCase()
    );

    if (!exactMatch) {
      const nearestMatches = findNearestMatches(searchTerm);
      const key = `search-suggestions-${Date.now()}`;
      
      message.info({
        content: (
          <div>
            <p>No exact match found. Did you mean:</p>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              {nearestMatches.map(match => (
                <li key={match}>
                  <a onClick={() => {
                    message.destroy(key);
                    navigate(`/similarity/${match}`);
                  }}>
                    {match.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ),
        key,
        duration: 5,
      });
    }
  };

  const handleChange = (selectedFilename) => {
    const pdbId = selectedFilename.replace('.pdb', '').toLowerCase();
    setValue(selectedFilename);
    navigate(`/similarity/${pdbId}`);
    lastSearchedTerm.current = null; // Reset on selection
  };

  return (
    <Select
      showSearch
      value={value}
      placeholder="Search PDBs (min 4 chars, e.g. 1A1P)"
      style={{ width: '100%' }}
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      filterOption={(input, option) =>
        option?.label?.toUpperCase().includes(input.toUpperCase())
      }
    />
  );
};

export default SearchBar;