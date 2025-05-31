// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import HomePage from './layout/HomePage';
// import SimilarityPage from './layout/SimilarityPage';
// import PercentPage from './layout/PercentPage';

// const App = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/similarity/:pdbId" element={<SimilarityPage />} />
//       <Route path="/percent/:pdbId/:threshold" element={<PercentPage />} />
//     </Routes>
//   );
// };

// export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './layout/HomePage';
import SimilarityPage from './layout/SimilarityPage';
import PercentPage from './layout/PercentPage';

const App = () => {
  return (
    <Routes>
      {/* Base route */}
      <Route path="/" element={<HomePage />} />
      
      {/* Similarity route with parameter validation */}
      <Route 
        path="/similarity/:pdbId" 
        element={<SimilarityPage />} 
      />
      
      {/* Percentage route with strict parameter requirements */}
      <Route 
        path="/percent/:pdbId/:threshold" 
        element={<PercentPage />}
      />
      
      {/* Redirect legacy routes or malformed URLs */}
      <Route path="/similarity" element={<Navigate to="/" replace />} />
      <Route path="/percent" element={<Navigate to="/" replace />} />
      
      {/* Catch-all route for 404s */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;