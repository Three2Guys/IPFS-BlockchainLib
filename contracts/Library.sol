// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// contract Library {
//     struct Book {
//         uint256 id;
//         string title;
//         string author;
//         string cid;
//         address uploader;
//     }

//     mapping(uint256 => Book) public books;
//     uint256 public bookCount;

//     event BookAdded(
//         uint256 indexed bookId,
//         string title,
//         string author,
//         string cid,
//         address indexed uploader
//     );

//     function addBook(string memory _title, string memory _author, string memory _cid) public {
//         bookCount++;
//         books[bookCount] = Book(bookCount, _title, _author, _cid, msg.sender);
//         emit BookAdded(bookCount, _title, _author, _cid, msg.sender);
//     }

//     function getBook(uint256 _id) public view returns (
//         uint256 id,
//         string memory title,
//         string memory author,
//         string memory cid,
//         address uploader
//     ) {
//         Book memory book = books[_id];
//         return (book.id, book.title, book.author, book.cid, book.uploader);
//     }
// }



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Library {
    struct Book {
        uint256 id;
        string title;
        string author;
        string cid;
        address uploader;
    }

    mapping(uint256 => Book) public books;
    uint256 public bookCount; // Start from 0

    // Define the event
    event BookAdded(
        uint256 indexed bookId, // Indexed for filtering
        string title,
        string author,
        string cid,
        address indexed uploader
    );

    // Function to add a new book
    function addBook(
        string memory _title,
        string memory _author,
        string memory _cid
    ) public {
        books[bookCount] = Book(bookCount, _title, _author, _cid, msg.sender);
        bookCount++; // Increment after adding
        emit BookAdded(bookCount - 1, _title, _author, _cid, msg.sender);
    }

    // Retrieve a book by ID
    error BookDoesNotExist();

    function getBook(uint256 _id)
        public
        view
        returns (
            uint256 id,
            string memory title,
            string memory author,
            string memory cid,
            address uploader
        )
    {
        if (_id >= bookCount) revert BookDoesNotExist();
        Book memory book = books[_id];
        return (book.id, book.title, book.author, book.cid, book.uploader);
    }
}