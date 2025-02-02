import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./TreeView.css";
import "bootstrap-icons/font/bootstrap-icons.css";
/* eslint-disable react/jsx-pascal-case */
import Component1 from "../Component1/Component1";
import Component2 from "../Component2/Component2";
import Component3 from "../Component3/Component3";
import Component4 from "../Component4/Component4";
/* eslint-enable react/jsx-pascal-case */

const API_URL = "http://localhost:5257/api/data"; // Ensure correct backend URL

const TreeView = () => {
  const [treeData, setTreeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNavbarOpen, setIsNavbarOpen] = useState(window.innerWidth > 425);
  const navbarRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => {
        if (response.data && response.data.tree) {
          setTreeData(response.data.tree);
        } else {
          console.error("Invalid API response:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Auto-open navbar when resizing to large screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsNavbarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle expand/collapse of nodes
  const handleToggle = (label) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleDoubleClick = (label) => {
    setSelectedNode(label);
  };

  // Recursive function to render the tree
  const renderTree = (nodes, level = 0) => (
    <div key={nodes.label} className={`tree-node level-${level}`}>
      <div className="node-header node-label">
        {nodes.children && (
          <span className="arrow" onClick={() => handleToggle(nodes.label)}>
            {expandedNodes[nodes.label] ? (
              <i className="bi bi-arrow-down-circle-fill"></i>
            ) : (
              <i className="bi bi-arrow-right-circle"></i>
            )}
          </span>
        )}
        <span
          className={`${expandedNodes[nodes.label] ? "bold" : ""}`}
          onDoubleClick={() => handleDoubleClick(nodes.label)}
        >
          {nodes.label}
        </span>
      </div>
      {nodes.children && expandedNodes[nodes.label] && (
        <div className="node-children">
          {nodes.children.map((child) => renderTree(child, level + 1))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Toggle Button */}
      <button
        className="navbar-toggle"
        onClick={() => setIsNavbarOpen(!isNavbarOpen)}
      >
        {isNavbarOpen ? (
          <i className="bi bi-arrow-left-circle"></i>
        ) : (
          <i className="bi bi-arrow-right-circle"></i>
        )}
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`left-navbar ${isNavbarOpen ? "open" : "closed"}`}
        ref={navbarRef}
      >
        {treeData.length > 0 ? (
          treeData.map((node) => renderTree(node))
        ) : (
          <p>Loading data...</p>
        )}
      </div>

      {/* Main Content */}
      <div className="content">
        {selectedNode === "C300_262" && (
          <Component1 content="Content for C300_262" />
        )}
        {selectedNode === "C300_sim" && <Component2 />}
        {selectedNode === "FIM4_299" && <Component3 />}
        {selectedNode === "Unassigned" && <Component4 />}
      </div>
    </div>
  );
};

export default TreeView;
