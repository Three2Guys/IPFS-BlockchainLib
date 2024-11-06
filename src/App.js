import React from "react";
import BookSearch from "./components/BookSearch";
import BookUpload from "./components/BookUpload";
import ErrorBoundary from "./components/ErrorBoundary"; // Importing the error boundary

const App = () => {
  // Replace with your deployed contract address
  // const contractAddress = "0x1566481C4b58103AB8f86bFc544FcD034bEa79D4"; 
  const contractAddress = "0xfc093904d5Af380b8d439b05ae5932a58C76A428"; 

  return (
    <ErrorBoundary>
      <div>
        <h1>IPFS Library</h1>
        {/* Using the contract address for both components */}
        <BookUpload contractAddress={contractAddress} />
        <BookSearch contractAddress={contractAddress} />
      </div>
    </ErrorBoundary>
  );
};

export default App;