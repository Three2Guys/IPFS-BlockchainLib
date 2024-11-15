// import React, { useState } from "react";

// const BookSearch = () => {
//   const [bookId, setBookId] = useState("");
//   const [book, setBook] = useState(null);

//   const fetchBook = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/search-book/${bookId}`);
//       if (!response.ok) {
//         throw new Error("Book not found");
//       }
//       const bookData = await response.json();
//       setBook({
//         title: bookData.title,
//         author: bookData.author,
//         cid: bookData.cid,
//         uploader: bookData.uploader,
//       });
//     } catch (error) {
//       console.error("Error fetching book data:", error);
//       alert("Failed to fetch the book. Please check the book ID and try again.");
//     }
//   };

//   const deleteBook = async () => {
//     try {
//       const response = await fetch(`http://localhost:3000/delete-book/${bookId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to delete book");
//       }
//       alert("Book deleted successfully");
//       setBook(null); // Clear the displayed book
//     } catch (error) {
//       console.error("Error deleting book:", error);
//       alert("Failed to delete the book. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <input
//         type="number"
//         value={bookId}
//         onChange={(e) => setBookId(e.target.value)}
//         placeholder="Enter Book ID"
//       />
//       <button onClick={fetchBook}>Search</button>
//       {book && (
//         <div>
//           <h3>Book Details:</h3>
//           <p>Title: {book.title}</p>
//           <p>Author: {book.author}</p>
//           <p>
//             CID:{" "}
//             <a href={`https://ipfs.io/ipfs/${book.cid}`} target="_blank" rel="noopener noreferrer">
//               {book.cid}
//             </a>
//           </p>
//           <p>Uploaded by: {book.uploader}</p>
//           <button onClick={deleteBook}>Delete Book</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookSearch;

// import React, { useState } from "react";

// const BookSearch = () => {
//     const [title, setTitle] = useState("");
//     const [author, setAuthor] = useState("");
//     const [results, setResults] = useState([]);

//     const fetchBooks = async () => {
//         try {
//             const query = new URLSearchParams();
//             if (title) query.append("title", title);
//             if (author) query.append("author", author);

//             const response = await fetch(`http://localhost:3000/search-books?${query.toString()}`);
//             if (!response.ok) {
//                 throw new Error("No books found matching the criteria.");
//             }

//             const booksData = await response.json();
//             setResults(booksData);
//         } catch (error) {
//             console.error("Error fetching book data:", error);
//             alert(error.message);
//         }
//     };

//     return (
//         <div>
//             <h2>Search Books</h2>
//             <input
//                 type="text"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="Enter Book Title"
//             />
//             <input
//                 type="text"
//                 value={author}
//                 onChange={(e) => setAuthor(e.target.value)}
//                 placeholder="Enter Author Name"
//             />
//             <button onClick={fetchBooks}>Search</button>

//             {results.length > 0 && (
//                 <div>
//                     <h3>Search Results:</h3>
//                     <ul>
//                         {results.map((book) => (
//                             <li key={book.bookId}>
//                                 <p>Book ID: {book.bookId}</p>
//                                 <p>Title: {book.title}</p>
//                                 <p>Author: {book.author}</p>
//                                 <p>
//                                     CID:{" "}
//                                     <a href={`https://ipfs.io/ipfs/${book.cid}`} target="_blank" rel="noopener noreferrer">
//                                         {book.cid}
//                                     </a>
//                                 </p>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {results.length === 0 && <p>No results found.</p>}
//         </div>
//     );
// };

// export default BookSearch;

import React, { useState } from "react";

const BookSearch = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [results, setResults] = useState([]);

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

  const deleteBook = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/delete-book/${bookId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }
      alert("Book deleted successfully");
      setResults(results.filter((book) => book.bookId !== bookId)); // Remove the deleted book from the displayed list
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete the book. Please try again.");
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
                <button onClick={() => deleteBook(book.bookId)}>
                  Delete Book
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
