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
      const { title, author, cid, uploaderAddress } = req.body; // Add uploaderAddress
      if (!title || !author || !cid || !uploaderAddress) {
        // Check for uploaderAddress
        return res
          .status(400)
          .send("Title, author, CID, and uploaderAddress are required.");
      }

      const db = await app.locals.orbitdb.keyvalue("books"); // created/opened a db named books
      await db.load(); // load the db
      const bookId = db.get("bookCount") || 0; // get current num of books
      await db.put(bookId, { title, author, cid, uploaderAddress }); // Store current books' info into db
      await db.put("bookCount", bookId + 1); // update num of books

      // 移动到更新bookCount之后的数据库内容检查
      console.log("=== Database Content After Addition ===");
      const allData = {};
      for (let i = 0; i < (db.get("bookCount") || 0); i++) {
        allData[i] = db.get(i);
      }
      console.log(
        "Current database content:",
        JSON.stringify(allData, null, 2)
      );
      console.log("Total books count:", db.get("bookCount"));
      console.log("=====================================");

      res.status(200).send("Book metadata added successfully.");
      console.log("Received data:", { title, author, cid, uploaderAddress });
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
      const orbitdb = req.app.locals.orbitdb;
      const db = await orbitdb.keyvalue("books");
      await db.load();

      // Check if the book exists before attempting to delete
      const book = db.get(bookId);
      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      // Remove the book from the database
      await db.del(bookId);
      res.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
      console.error("Error deleting book:", error);
      res.status500().send("Failed to delete book from OrbitDB");
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Error starting server:", error);
});
