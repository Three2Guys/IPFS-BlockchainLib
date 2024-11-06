import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Library from "../artifacts/Library.json"; // Import the ABI

const BookUpload = ({ contractAddress }) => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);

          const { chainId } = await newProvider.getNetwork();
          const expectedChainId = 31337;
          if (chainId !== expectedChainId) {
            alert(`请切换到正确的网络: Anvil Localhost (Chain ID: ${expectedChainId})`);
            console.error(`Connected to wrong network (Chain ID: ${chainId})`);
            return; // 停止执行
          }

          const signer = newProvider.getSigner();
          const newContract = new ethers.Contract(contractAddress, Library.abi, signer);
          setContract(newContract);
        } catch (error) {
          console.error("Error initializing provider or contract:", error);
        }
      } else {
        console.error("MetaMask is not installed. Please install MetaMask to use this feature.");
        alert("MetaMask is not detected. Please install MetaMask to use this feature.");
      }
    };
    connectWallet();
  }, [contractAddress]);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!contract) {
      alert("Unable to connect to the smart contract. Please check your MetaMask connection.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      // Replace this with your IPFS endpoint
      const response = await fetch("http://localhost:5001/api/v0/add", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file to IPFS");
      }

      const data = await response.json();
      const cid = data.Hash;
      console.log("File uploaded to IPFS with CID:", cid);
      setCid(cid);

      // Call the smart contract function to add book metadata
      const tx = await contract.addBook(title, author, cid);
      await tx.wait();
      console.log("Metadata stored on blockchain");
      alert("File and metadata successfully uploaded and stored!");

    } catch (error) {
      console.error("Error uploading file or interacting with the blockchain:", error);
      alert("Failed to upload the file or interact with the blockchain. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload a Book</h2>
      <input
        type="text"
        placeholder="Enter Book Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Author Name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile} disabled={loading || !provider}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {cid && (
        <div>
          <p>File uploaded successfully!</p>
          <p>
            CID: <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">{cid}</a>
            Link: <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">https://ipfs.io/ipfs/${cid}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default BookUpload;