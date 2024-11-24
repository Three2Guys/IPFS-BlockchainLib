import React, { useState } from "react";
import BookSearch from "./components/BookSearch";
import BookUpload from "./components/BookUpload";
import BlockchainEvents from "./components/BlockchainEvent";
import ErrorBoundary from "./components/ErrorBoundary";
import logo from "./components/Logo.png";

const App = () => {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const [activeTab, setActiveTab] = useState("Library");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <ErrorBoundary>
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: "1rem" }}>
          <img
            src={logo}
            alt="IPFS Library Logo"
            style={{
              width: "360px",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        {/* Dropdown Menu */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ position: "relative" }}>
            <button
              onClick={toggleDropdown}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "16px",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Menu ▼
            </button>
            {isDropdownVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  zIndex: 10,
                }}
              >
                {/* Dropdown Options */}
                <div
                  onClick={() => handleTabChange("Library")}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #ccc",
                    backgroundColor:
                      activeTab === "Library" ? "#f3f4f6" : "transparent",
                  }}
                >
                  Library
                </div>
                <div
                  onClick={() => handleTabChange("Blockchain Events")}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    backgroundColor:
                      activeTab === "Blockchain Events"
                        ? "#f3f4f6"
                        : "transparent",
                  }}
                >
                  Blockchain Events
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Render Components Based on Active Tab */}
        {activeTab === "Library" && (
          <div>
            <BookUpload contractAddress={contractAddress} />
            <BookSearch contractAddress={contractAddress} />
          </div>
        )}
        {activeTab === "Blockchain Events" && (
          <div>
            <BlockchainEvents contractAddress={contractAddress} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;