import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Library from "../artifacts/Library.json";

const BookUpload = ({ contractAddress }) => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [uploaderAddress, setUploaderAddress] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const newProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(newProvider);

          const { chainId } = await newProvider.getNetwork();
          const expectedChainId = 31337;
          if (chainId !== expectedChainId) {
            alert(
              `请切换到正确的网络: Anvil Localhost (Chain ID: ${expectedChainId})`
            );
            console.error(`Connected to wrong network (Chain ID: ${chainId})`);
            return; // 停止执行
          }

          const signer = newProvider.getSigner();
          setSigner(signer);
          const newContract = new ethers.Contract(
            contractAddress,
            Library.abi,
            signer
          );
          setContract(newContract);
        } catch (error) {
          console.error("Error initializing provider or contract:", error);
        }
      } else {
        console.error(
          "MetaMask is not installed. Please install MetaMask to use this feature."
        );
        alert(
          "MetaMask is not detected. Please install MetaMask to use this feature."
        );
      }
    };
    connectWallet();
  }, [contractAddress]);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }
  
    // Extract MIME type of the file
    const mimeType = file.type;
    console.log("File MIME type:", mimeType);
  
    if (!mimeType) {
      alert("Could not determine the file's MIME type. Please try another file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      setLoading(true);
  
      // Step 1: Upload the file to IPFS
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
  
      // Get the uploader address
      const uploader = await signer.getAddress();
      setUploaderAddress(uploader);
      console.log("Uploader address:", uploader);
  
      // Step 2: Call the backend to store metadata in OrbitDB
      const addBookResponse = await fetch("http://localhost:3000/add-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          cid,
          uploaderAddress: uploader,
          mimeType, // Include MIME type in the request body
        }),
      });
  
      console.log("Added book to OrbitDB with info:", {
        title,
        author,
        cid,
        uploader,
        mimeType,
      });
  
      if (!addBookResponse.ok) {
        throw new Error("Failed to save book metadata to OrbitDB");
      }
  
      // Step 3: Add the book to the blockchain
      if (!contract) {
        throw new Error("Contract not initialized");
      }
  
      console.log("Adding book to blockchain...");
      console.log("Contract address:", contractAddress);
      console.log("Book details:", { title, author, cid, uploader, mimeType });
  
      const tx = await contract.addBook(title, author, cid);
      console.log("Transaction sent:", tx.hash);
  
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
  
      alert("File, metadata, and blockchain record successfully created!");
    } catch (error) {
      console.error("Error in upload process:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        textAlign: "left",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        Upload a Book
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            width: "100%",
          }}
        >
          <input
            type="text"
            placeholder="Enter Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
              flex: 1,
            }}
          />

          <input
            type="text"
            placeholder="Enter Author Name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
              flex: 1,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              position: "relative",
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "0.5rem",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                pointerEvents: "none",
              }}
            >
              <span
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                  color: "#374151",
                }}
              >
                Choose File
              </span>
              <span
                style={{
                  color: "#6b7280",
                  fontSize: "16px",
                }}
              >
                {file ? file.name : "No File Chosen"}
              </span>
            </div>
          </div>

          <button
            onClick={uploadFile}
            disabled={loading || !provider}
            style={{
              height: "38px",
              padding: "0 1.5rem",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: loading || !provider ? "not-allowed" : "pointer",
              opacity: loading || !provider ? 0.5 : 1,
            }}
          >
            {loading ? "Uploading..." : "UPLOAD"}
          </button>
        </div>
      </div>

      {cid && (
        <div style={{ marginTop: "1.5rem" }}>
          <p>File uploaded successfully!</p>
          <p>
            CID:{" "}
            <a
              href={`https://ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              {cid}
            </a>
            Link:{" "}
            <a
              href={`https://ipfs.io/ipfs/${cid}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              https://ipfs.io/ipfs/{cid}
            </a>
          </p>
        </div>
      )}

      {uploaderAddress && (
        <p id="uploaderAddress" style={{ marginTop: "1rem" }}>
          Uploader: {uploaderAddress}
        </p>
      )}
    </div>
  );
};

export default BookUpload;