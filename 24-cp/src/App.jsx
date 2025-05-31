import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './layout/HomePage';
import SimilarityPage from './layout/SimilarityPage';
import PercentPage from './layout/PercentPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/similarity/:pdbId" element={<SimilarityPage />} />
      <Route path="/percent/:pdbId/:threshold" element={<PercentPage />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default App;
