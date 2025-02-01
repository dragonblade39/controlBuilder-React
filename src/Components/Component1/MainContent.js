import React from "react";
import jsonData from "../MainViewContent.json";
import "./Component1.css";

function MainContent() {
  const renderField = (field, index, isFirstInSection = false) => {
    if (isFirstInSection && field.label && Object.keys(field).length === 1) {
      // If first field in a section is a single label, render as heading
      return (
        <h3 key={index} className="section-heading">
          {field.label}
        </h3>
      );
    }

    if (!isFirstInSection && field.label && Object.keys(field).length === 1) {
      // If it's not the first item but has only a label, display as normal text without a container
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
            <input type="checkbox" /> {field.optionLabel || ""}
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
      <div className="content-container">
        <div className="left-section">
          {jsonData.Section1 && renderSection(jsonData.Section1)}
        </div>

        <div className="right-section">
          {jsonData.Section2 && renderSection(jsonData.Section2)}
        </div>
      </div>
    </div>
  );
}

export default MainContent;
