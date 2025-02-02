import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Component1.css";
import MainContent from "./MainContent";
import SystemTime from "./SystemTime";

const API_URL = "http://localhost:5257/api/data";

function Component1() {
  const [options, setOptions] = useState([]);
  const [isOptionsVisible, setIsOptionsVisible] = useState(true);
  const [hoveredOption, setHoveredOption] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Main");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(API_URL);
        setOptions(response.data.options || []);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      }
    };
    fetchOptions();
  }, []);

  // Listen to window resize and restore navbar if screen size is large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOptionsVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="container">
      <button className="toggle-button" onClick={toggleOptions}>
        {isOptionsVisible ? "▲" : "▼"}
      </button>

      <div
        className={`options-container ${isOptionsVisible ? "show" : "hide"}`}
      >
        {options.length > 0 ? (
          options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${
                selectedOption === option ? "selected" : ""
              } ${hoveredOption === option ? "hovered" : ""}`}
              onMouseEnter={() => setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))
        ) : (
          <p>No options available.</p>
        )}
      </div>

      {selectedOption === "Main" && (
        <div className="content-container">
          <MainContent />
        </div>
      )}
      {selectedOption === "System Time" && (
        <div className="content-container">
          <SystemTime />
        </div>
      )}
    </div>
  );
}

export default Component1;
