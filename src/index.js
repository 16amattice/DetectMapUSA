import React, { useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./styles.css";

import MapChart from "./MapChart";
import WisconsinMap from "./WisconsinMap";

function App() {
  const [selectedState, setSelectedState] = useState(null);
  const navigate = useNavigate();
  const handleStateClick = (geo) => {
    if (geo.id === "55") {
      navigate("/WI");
    } else {
      setSelectedState(null);
    }
  };

  return (
    <Routes>
      <Route path="/" element={<MapChart onStateClick={handleStateClick} />} />
      <Route path="/WI" element={<WisconsinMap />} />
    </Routes>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Router basename="/DetectMapUSA">
    <App />
  </Router>,
  rootElement
);
