import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const BookSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState([]);
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setCurrentUserAddress(address);
        } catch (error) {
          console.error("Error connecting to wallet:", error);
        }
      }
    };
    connectWallet();
  }, []);

  const fetchBooks = async () => {
    try {
      const query = new URLSearchParams();
      if (title) query.append("title", title);
      if (author) query.append("author", author);
  
      const response = await fetch(
        `http://localhost:3000/search-books?${query.toString()}`
      );
      if (!response.ok) {
        throw new Error("No books found matching the criteria.");
      }
  
      const booksData = await response.json();
      console.log("Fetched books data with MIME type:", booksData); // Updated log
      setResults(booksData);
    } catch (error) {
      console.error("Error fetching book data:", error);
      alert(error.message);
    }
  };

  const downloadBook = async (cid, fileName, mimeType) => {
    try {
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch the file from IPFS.");
      }
  
      const blob = await response.blob();
      const extension = mimeType.split("/")[1]; // Extract file extension from MIME type
      const fullFileName = `${fileName}.${extension}`; // Use the correct file extension
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary <a> element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.download = fullFileName; // Set the dynamic file name
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file:", error);
      alert("Failed to download the file.");
    }
  };

  const deleteBook = async (bookId, bookUploaderAddress) => {
    if (
      bookUploaderAddress.toLowerCase() !== currentUserAddress.toLowerCase()
    ) {
      alert("You don't have permission to delete this book");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/delete-book/${bookId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploaderAddress: currentUserAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete book");
      }

      alert("Book deleted successfully");
      setResults(results.filter((book) => book.bookId !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.message);
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
        Search Books
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

        <button
          onClick={fetchBooks}
          style={{
            height: "38px",
            padding: "0 1.5rem",
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          SEARCH
        </button>
      </div>

      {results.length > 0 && (
  <div style={{ marginTop: "2rem" }}>
    <h3
      style={{
        fontSize: "20px",
        fontWeight: "600",
        marginBottom: "1rem",
      }}
    >
      Search Results:
    </h3>
    <ul style={{ listStyle: "none", padding: 0 }}>
    {results.map((book) => (
      <li
        key={book.bookId}
        style={{
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          marginBottom: "1rem",
        }}
      >
        <p style={{ margin: "0.5rem 0" }}><strong>Book ID:</strong> {book.bookId}</p>
        <p style={{ margin: "0.5rem 0" }}><strong>Title:</strong> {book.title}</p>
        <p style={{ margin: "0.5rem 0" }}><strong>Author:</strong> {book.author}</p>
        <p style={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}>
          <strong>Uploader:</strong> {" "}
          <span
            style={{
              backgroundColor: "#f3f4f6",
              padding: "0.5rem",
              borderRadius: "4px",
              fontFamily: "monospace",
              marginLeft: "0.5rem",
            }}
          >
            {book.uploaderAddress}
          </span>
          <a
            href={`https://etherscan.io/address/${book.uploaderAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: "0.5rem",
              fontSize: "20px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              color: "#2563eb",
            }}
          >
            👤
          </a>
        </p>
        <p style={{ margin: "0.5rem 0" }}>
          <strong>CID:</strong> {" "}
          <span
            style={{
              backgroundColor: "#f3f4f6",
              padding: "0.5rem",
              borderRadius: "4px",
              fontFamily: "monospace",
              display: "inline-block",
              wordBreak: "break-word", // Ensures it wraps correctlyy
            }}
          >
            {book.cid}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(book.cid)}
            style={{
              marginLeft: "1rem",
              height: "30px",
              padding: "1 1rem",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "400",
              cursor: "pointer",
            }}
          >
            COPY
          </button>
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={() => {
              // Extract file extension from MIME type
              const extension = book.mimeType.split("/")[1]; 
              // Pass dynamically generated file name
              downloadBook(book.cid, book.title, book.mimeType);
            }}
            style={{
              height: "38px",
              padding: "0 1.5rem",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            DOWNLOAD
          </button>
          <button
            onClick={() => deleteBook(book.bookId, book.uploaderAddress)}
            disabled={
              book.uploaderAddress.toLowerCase() !==
              currentUserAddress.toLowerCase()
            }
            style={{
              height: "38px",
              padding: "0 1.5rem",
              backgroundColor: "#ccc",
              color: "#000",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              cursor:
                book.uploaderAddress.toLowerCase() !==
                currentUserAddress.toLowerCase()
                  ? "not-allowed"
                  : "pointer",
              opacity:
                book.uploaderAddress.toLowerCase() !==
                currentUserAddress.toLowerCase()
                  ? 0.5
                  : 1,
            }}
          >
            DELETE
          </button>
        </div>
      </li>
    ))}
    </ul>
  </div>
)}

      {results.length === 0 && (
        <p style={{ marginTop: "1.5rem" }}>No results found.</p>
      )}
    </div>
  );
};

export default BookSearch;