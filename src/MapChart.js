import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

import allStates from "./data/allstates.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapChart = ({ onStateClick }) => {
  const [hoveredState, setHoveredState] = useState(null);

  const handleStateHover = (geo) => {
    setHoveredState(geo.properties.name);
  };

  const handleStateLeave = () => {
    setHoveredState(null);
  };

  const handleStateClick = (geo) => {
    onStateClick(geo);
  };

  return (
    <div className="container">
      <ComposableMap
        projection="geoAlbersUsa"
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  stroke="#000"
                  strokeWidth={0.5}
                  geography={geo}
                  fill={
                    geo.properties.name === hoveredState
                      ? "url(#gradientId)"
                      : "#FFF"
                  }
                  onMouseEnter={() => handleStateHover(geo)}
                  onMouseLeave={handleStateLeave}
                  onClick={() => handleStateClick(geo)}
                />
              ))}
              <defs>
                <linearGradient
                  id="gradientId"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#eef2f3" />
                  <stop offset="100%" stopColor="#8e9eab" />
                </linearGradient>
              </defs>
            </>
          )}
        </Geographies>
      </ComposableMap>
      <div
        className="state-label"
        data-state={hoveredState || "None"}
      >
        {hoveredState || "None"}
      </div>
    </div>
  );
};

export default MapChart;
