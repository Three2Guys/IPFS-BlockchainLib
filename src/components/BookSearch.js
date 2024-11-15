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
      setResults(booksData);
    } catch (error) {
      console.error("Error fetching book data:", error);
      alert(error.message);
    }
  };

  const deleteBook = async (bookId, bookUploaderAddress) => {
    // 首先检查是否是当前用户上传的书籍
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
    <div>
      <h2>Search Books</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Book Title"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Enter Author Name"
      />
      <button onClick={fetchBooks}>Search</button>

      {results.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {results.map((book) => (
              <li key={book.bookId}>
                <p>Book ID: {book.bookId}</p>
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p>Uploader: {book.uploaderAddress}</p>
                <p>
                  CID:{" "}
                  <a
                    href={`https://ipfs.io/ipfs/${book.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {book.cid}
                  </a>
                </p>
                <button
                  onClick={() => deleteBook(book.bookId, book.uploaderAddress)}
                  disabled={
                    book.uploaderAddress.toLowerCase() !==
                    currentUserAddress.toLowerCase()
                  }
                >
                  {book.uploaderAddress.toLowerCase() ===
                  currentUserAddress.toLowerCase()
                    ? "Delete Book"
                    : "No Permission to Delete"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && <p>No results found.</p>}
    </div>
  );
};

export default BookSearch;
