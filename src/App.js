import React, { useState } from "react";
import BookSearch from "./components/BookSearch";
import BookUpload from "./components/BookUpload";
import BlockchainEvents from "./components/BlockchainEvent";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  // Replace with your deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // States for managing the active tab and dropdown visibility
  const [activeTab, setActiveTab] = useState("Library");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDropdownVisible(false); // Close dropdown when a tab is selected
  };

  // Function to toggle the dropdown menu
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
        {/* Header */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "1rem",
            fontStyle: "italic",
          }}
        >
          IPFS Library
        </h1>
        <BookUpload contractAddress={contractAddress} />
        <BookSearch contractAddress={contractAddress} />
        <BlockchainEvents contractAddress={contractAddress} />
      </div>
    </ErrorBoundary>
  );
};

export default App;