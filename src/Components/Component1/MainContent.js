// MainContent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Component1.css";

const API_URL = "http://localhost:5257/api/data";

function MainContent() {
  const [section1, setSection1] = useState(null);
  const [section2, setSection2] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("API Response:", response.data);
        // Use the proper property names as returned by the API
        if (response.data?.section1 && response.data?.section2) {
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

  // Update the formData state based on the unique field name
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Render an individual field, using a fallback unique key if no name is provided
  const renderField = (field, index, isFirstInSection = false) => {
    if (!field || typeof field !== "object") return null;

    // Use the provided name or generate one (remove spaces to keep it simple)
    const fieldName = field.name
      ? field.name
      : `${field.label ? field.label.replace(/\s+/g, "") : "field"}-${index}`;

    // If the field is a label-only object, show it as a header or inline label
    if (field.label && Object.keys(field).length === 1) {
      return isFirstInSection ? (
        <h3 key={index} className="section-heading">
          {field.label}
        </h3>
      ) : (
        <p key={index} className="inline-label">
          {field.label}
        </p>
      );
    }

    return (
      <div key={index} className="field-box">
        {field.type === "checkbox" ? (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData[fieldName] || false}
              disabled={field.disabled}
              onChange={(e) => handleInputChange(fieldName, e.target.checked)}
            />{" "}
            {field.optionLabel || field.label}
          </label>
        ) : (
          <>
            {field.label && <label>{field.label}</label>}
            {field.description && (
              <p className="description-text">{field.description}</p>
            )}
            {field.type === "text" && (
              <input
                type="text"
                size={field.size || 20}
                value={formData[fieldName] || ""}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
              />
            )}
            {field.type === "select" && (
              <select
                disabled={field.disabled}
                value={formData[fieldName] || ""}
                onChange={(e) => handleInputChange(fieldName, e.target.value)}
              >
                {field.options?.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            )}
            {field.type === "button" && (
              <button className="action-button" disabled={field.disabled}>
                {field.label}
              </button>
            )}
            {"value" in field && <span>{field.value}</span>}
          </>
        )}
      </div>
    );
  };

  // Render a section that contains multiple fields (either as an array or an object)
  const renderSection = (sectionData) => {
    if (!sectionData) return <p>No data available</p>;

    return Object.keys(sectionData).map((key, index) => {
      const item = sectionData[key];

      if (Array.isArray(item)) {
        return (
          <div key={index} className="section-box">
            {item.length > 0 ? (
              item.map((field, i) => renderField(field, i, i === 0))
            ) : (
              <p>No fields available</p>
            )}
          </div>
        );
      }

      if (typeof item === "object" && item !== null) {
        return (
          <div key={index} className="section-box">
            {item.label && <h3>{item.label}</h3>}
            {item.description && (
              <p className="description-text">{item.description}</p>
            )}
            {Object.keys(item).map((subKey, subIndex) => {
              const subItem = item[subKey];
              return typeof subItem === "object" && "label" in subItem
                ? renderField(subItem, subIndex, subIndex === 0)
                : null;
            })}
          </div>
        );
      }

      return null;
    });
  };

  const handleSubmit = () => {
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="container">
      <div className="content-container">
        <div className="left-section">
          {section1 ? renderSection(section1) : <p>Loading Section 1...</p>}
        </div>
        <div className="right-section">
          {section2 ? renderSection(section2) : <p>Loading Section 2...</p>}
        </div>
      </div>

      {/* Sticky Footer with Buttons */}
      <div className="sticky-footer">
        <button className="footer-button" onClick={handleSubmit}>
          OK
        </button>
        <button className="footer-button">Cancel</button>
        <button className="footer-button">Help</button>
      </div>
    </div>
  );
}

export default MainContent;
