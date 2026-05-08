/**
 * Main App component with routing
 */

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<div>Welcome to E-Commerce</div>} />
      </Routes>
    </div>
  );
}

export default App;
