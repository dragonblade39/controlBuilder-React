import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Component1.css";

const API_URL = "http://localhost:5257/api/data";

function SystemTime() {
  // eslint-disable-next-line
  const [section1, setSection1] = useState(null);
  // eslint-disable-next-line
  const [section2, setSection2] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        if (response.data && response.data.section1 && response.data.section2) {
          console.log("Setting Section1:", response.data.section1);
          console.log("Setting Section2:", response.data.section2);
          setSection1(response.data.section1);
          setSection2(response.data.section2);
        } else {
          console.error(
            "❌ Missing Section1 or Section2! API Response:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching sections:", error);
      });
  }, []);

  const renderField = (field, index, isFirstInSection = false) => {
    if (isFirstInSection && field.label && Object.keys(field).length === 1) {
      return (
        <h3 key={index} className="section-heading">
          {field.label}
        </h3>
      );
    }

    if (!isFirstInSection && field.label && Object.keys(field).length === 1) {
      return (
        <p key={index} className="inline-label">
          {field.label}
        </p>
      );
    }

    return (
      <div key={index} className="field-box">
        <label>{field.label}</label>
        {field.description && (
          <p className="description-text">{field.description}</p>
        )}
        {field.type === "text" && <input type="text" size={field.size || 20} />}
        {field.type === "select" && (
          <select disabled={field.disabled}>
            {field.options?.map((option, i) => (
              <option key={i} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        )}
        {field.type === "checkbox" && (
          <label>
            <input type="checkbox" disabled={field.disabled} />{" "}
            {field.optionLabel || ""}
          </label>
        )}
        {field.type === "button" && (
          <button className="action-button" disabled={field.disabled}>
            {field.label}
          </button>
        )}
        {"value" in field && <span>{field.value}</span>}
      </div>
    );
  };

  // eslint-disable-next-line
  const renderSection = (sectionData) =>
    Object.keys(sectionData).map((key, index) => {
      const item = sectionData[key];

      if (Array.isArray(item)) {
        return (
          <div key={index} className="section-box">
            {item.map((field, i) => renderField(field, i, i === 0))}
          </div>
        );
      }

      if (typeof item === "object" && item !== null) {
        return (
          <div key={index} className="section-box">
            <h3>{item.label || ""}</h3>
            {item.description && (
              <p className="description-text">{item.description}</p>
            )}
            {Object.keys(item).map((subKey, subIndex) => {
              const subItem = item[subKey];
              if (typeof subItem === "object" && "label" in subItem) {
                return renderField(subItem, subIndex, subIndex === 0);
              }
              return null;
            })}
          </div>
        );
      }

      return null;
    });

  return (
    <div className="container">
      {/* <div className="content-container">
        <div className="left-section">
          {section2 ? renderSection(section2) : <p>Loading Section 2...</p>}
        </div>
        <div className="right-section">
          {section1 ? renderSection(section1) : <p>Loading Section 1...</p>}
        </div>
        <div className="right-section">
          {section1 ? renderSection(section1) : <p>Loading Section 1...</p>}
        </div>
      </div> */}
    </div>
  );
}

export default SystemTime;
