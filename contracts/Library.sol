// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Library {
    struct Book {
        string title;
        string author;
        string cid;
        address uploader;
    }

    mapping(uint256 => Book) public books;
    uint256 public bookCount;

    event BookAdded(uint256 indexed bookId, string title, string author, string cid, address indexed uploader);

    function addBook(string memory _title, string memory _author, string memory _cid) public {
        bookCount++;
        books[bookCount] = Book(_title, _author, _cid, msg.sender);
        emit BookAdded(bookCount, _title, _author, _cid, msg.sender);
    }

    function getBook(uint256 _bookId) public view returns (string memory, string memory, string memory, address) {
        Book memory book = books[_bookId];
        return (book.title, book.author, book.cid, book.uploader);
    }
}
