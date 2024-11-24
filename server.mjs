import express from "express";
import cors from "cors"; // Import CORS middleware
import { setupDatabase } from "./database/orbitdb.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

async function startServer() {
  const { ipfs, orbitdb } = await setupDatabase();
  app.locals.ipfs = ipfs;
  app.locals.orbitdb = orbitdb;

  // Define your routes here
  app.post("/add-book", async (req, res) => {
    try {
      const { title, author, cid, uploaderAddress, mimeType } = req.body; // Add mimeType
      if (!title || !author || !cid || !uploaderAddress || !mimeType) {
        // Validate all required fields, including mimeType
        return res
          .status(400)
          .send("Title, author, CID, uploaderAddress, and mimeType are required.");
      }
  
      const db = await app.locals.orbitdb.keyvalue("books"); // Create/open the 'books' database
      await db.load(); // Load the database
      const bookId = db.get("bookCount") || 0; // Get the current number of books
  
      // Store the book's metadata in the database
      await db.put(bookId, { title, author, cid, uploaderAddress, mimeType }); // Include mimeType
      await db.put("bookCount", bookId + 1); // Update the book count
  
      // Debugging: Print the database contents after the addition
      console.log("=== Database Content After Addition ===");
      const allData = {};
      for (let i = 0; i < (db.get("bookCount") || 0); i++) {
        allData[i] = db.get(i);
      }
      console.log("Current database content:", JSON.stringify(allData, null, 2));
      console.log("Total books count:", db.get("bookCount"));
      console.log("=====================================");
  
      res.status(200).send("Book metadata added successfully.");
      console.log("Received data:", { title, author, cid, uploaderAddress, mimeType });
    } catch (error) {
      console.error("Error saving book metadata:", error);
      res.status(500).send("Failed to save book metadata to OrbitDB");
    }
  });

  // Search for a book by title and author
  app.get("/search-books", async (req, res) => {
    try {
      const { title, author } = req.query;

      if (!title && !author) {
        return res
          .status(400)
          .send(
            "Please provide at least one search criteria: title or author."
          );
      }

      // Access the OrbitDB instance
      const db = await app.locals.orbitdb.keyvalue("books");
      await db.load();

      // Initialize an array to store matching books
      const matchingBooks = [];

      // Iterate through all keys in the OrbitDB store
      for (let i = 0; i <= db.get("bookCount"); i++) {
        const book = db.get(i);
        if (book) {
          // Check if the book matches the search criteria
          const titleMatch = title
            ? book.title.toLowerCase().includes(title.toLowerCase())
            : true;
          const authorMatch = author
            ? book.author.toLowerCase().includes(author.toLowerCase())
            : true;

          if (titleMatch && authorMatch) {
            matchingBooks.push({
              bookId: i,
              title: book.title,
              author: book.author,
              cid: book.cid,
              uploaderAddress: book.uploaderAddress, // Include uploaderAddress in search results
              mimeType: book.mimeType,
            });
          }
        }
      }

      // Return the array of matching books
      if (matchingBooks.length === 0) {
        return res.status(404).send("No books found matching the criteria.");
      }

      res.status(200).json(matchingBooks);
    } catch (error) {
      console.error("Error searching books:", error);
      res.status(500).send("Failed to search books in OrbitDB");
    }
  });

  // Delete a book by bookId
  app.delete("/delete-book/:bookId", async (req, res) => {
    try {
      const bookId = req.params.bookId;
      const { uploaderAddress } = req.body; // get uploader addr of the curr user

      const db = await req.app.locals.orbitdb.keyvalue("books");
      await db.load();

      // check if book exists
      const book = db.get(bookId);
      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      // 验证上传者地址 - identity check
      if (
        book.uploaderAddress.toLowerCase() !== uploaderAddress.toLowerCase()
      ) {
        return res.status(403).send({
          message: "You don't have permission to delete this book",
        });
      }

      // delete book
      await db.del(bookId);
      res.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status(500).send("Failed to delete book from OrbitDB");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
