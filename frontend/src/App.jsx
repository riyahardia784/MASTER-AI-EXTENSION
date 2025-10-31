import React from "react";
import Learn from "./pages/Learn";
import Create from "./pages/Create";
import Visualize from "./pages/Visualize";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Learn />} />
      <Route path="/create" element={<Create />} />
      <Route path="/visualize" element={<Visualize />} />
      
    </Routes>
      
    
  );
}

export default App;

