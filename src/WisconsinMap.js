import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import wisconsinCounties from "./data/wisconsin.json";
import wisconsinCountyLaws from "./data/wisconsincounties.json";
import "./styles.css";

const WisconsinMap = () => {
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [clickedCounty, setClickedCounty] = useState(null);
  const [clickedCity, setClickedCity] = useState(null);
  const [lawsForCity, setLawsForCity] = useState([]);
  const [cityLaw, setCityLaw] = useState(null);
  const navigate = useNavigate();

  const handleCountyHover = (geo) => {
    setHoveredCounty(geo.properties.NAME);
  };

  const handleCountyLeave = () => {
    setHoveredCounty(null);
  };

  const handleCountyClick = (geo) => {
    setClickedCounty(geo.properties.NAME);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const getLawForCounty = (countyName) => {
    const county = wisconsinCountyLaws.find((c) => c[Object.keys(c)[0]].NAME === countyName);
    const geoid = county ? Object.keys(county)[0] : null;
    const law = geoid ? county[geoid].LAW : "No law found";
    return law;
  };

  const getCitiesForCounty = (countyName) => {
    const county = wisconsinCountyLaws.find(
      (c) => c[Object.keys(c)[0]].NAME === countyName
    );
    const geoid = county ? Object.keys(county)[0] : null;
    const cities = geoid ? Object.values(county[geoid].CITIES).map(city => city.NAME) : [];
    return cities;
  };

  const getLawsForCity = (countyName, cityName) => {
    const county = wisconsinCountyLaws.find((c) => c[Object.keys(c)[0]].NAME === countyName);
    const cities = county[Object.keys(county)[0]].CITIES;
    const city = Object.values(cities).find((c) => c.NAME === cityName);
    const laws = city ? Object.values(city).filter((value) => value !== cityName && typeof value !== "object") : [];
    return laws;
  };
  
  


  const handleCityClick = (countyName, cityName) => {
    setClickedCity(cityName);
    setLawsForCity(getLawsForCity(countyName, cityName));
  };


  return (
    <div className="container">
      <div className="back-button" onClick={handleGoBack}>
        Go back
      </div>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3200,
          center: [-89.6, 44.5],
        }}
        width={800}
        height={600}
      >
        <Geographies geography={wisconsinCounties}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countyName = geo.properties.NAME;
              const isHovered = hoveredCounty === countyName;
              const isClicked = clickedCounty === countyName;
              const color = isHovered || isClicked ? "url(#gradientId)" : "#FFF";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
                  stroke="#000"
                  strokeWidth={0.5}
                  onMouseEnter={() => handleCountyHover(geo)}
                  onMouseLeave={handleCountyLeave}
                  onClick={() => handleCountyClick(geo)}
                />
              );
            })
          }
        </Geographies>
        <defs>
          <linearGradient id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#eef2f3" />
            <stop offset="100%" stopColor="#8e9eab" />
          </linearGradient>
        </defs>
      </ComposableMap>
      <div className="county-label" data-county={hoveredCounty || clickedCounty || "None"}>
        {hoveredCounty || clickedCounty || "None"}
      </div>
      {clickedCounty && (
        <div className="county-law-label">
          County Law: {getLawForCounty(clickedCounty)}
        </div>
      )}
      {clickedCounty && (
        <div className="city-list-label">
          <h3>Cities:</h3>
          <div className="city-name">
            {getCitiesForCounty(clickedCounty).map((cityName) => (
              <div key={cityName} onClick={() => handleCityClick(clickedCounty, cityName)}>
                {cityName}
              </div>
            ))}
          </div>
        </div>
      )}
{clickedCity && (
  <div className="city-law-list-label">
    {clickedCity} Laws:
    {lawsForCity.length > 0 ? (
      <ul>
        {lawsForCity.map((law) => (
          <li key={law}>{law}</li>
        ))}
      </ul>
    ) : (
      <div>No laws found</div>
    )}
  </div>
)}


    </div>
  );
};

export default WisconsinMap;

