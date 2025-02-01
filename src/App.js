import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Screen1 from "./Components/TreeView/TreeView";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Screen1 />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;