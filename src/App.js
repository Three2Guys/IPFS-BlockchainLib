import React from "react";
import BookSearch from "./components/BookSearch";
import BookUpload from "./components/BookUpload";

const App = () => {
  const contractAddress = "0x1566481C4b58103AB8f86bFc544FcD034bEa79D4"; // Replace with your deployed contract address

  return (
    <div>
      <h1>IPFS Library</h1>
      <BookUpload />
      <BookSearch contractAddress={contractAddress} />
    </div>
  );
};

export default App;
