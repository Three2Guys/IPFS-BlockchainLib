import React from "react";
import BookSearch from "./components/BookSearch";
import BookUpload from "./components/BookUpload";
import ErrorBoundary from "./components/ErrorBoundary";
import BlockchainEvents from "./components/BlockchainEvent";

const App = () => {
  // Replace with your deployed contract address
  // const contractAddress = "0x1566481C4b58103AB8f86bFc544FcD034bEa79D4";
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
        {/* <BlockchainEvents contractAddress={contractAddress} /> */}
      </div>
    </ErrorBoundary>
  );
};

export default App;
