import React, { useState } from 'react';
import { ethers } from 'ethers';
// import Library from '../artifacts/contracts/Library.sol/Library.json';
import Library from '../artifacts/Library.json';


const BookSearch = ({ contractAddress }) => {
    console.log('BookSearch component rendered');
    const [bookId, setBookId] = useState('');
    const [book, setBook] = useState(null);

    const fetchBook = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, Library.abi, provider);
        const bookData = await contract.getBook(bookId);
        setBook({
            title: bookData[0],
            author: bookData[1],
            cid: bookData[2],
            uploader: bookData[3],
        });
    };
    //

    return (
        <div>
            <input
                type="number"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="Enter Book ID"
            />
            <button onClick={fetchBook}>Search</button>
            {book && (
                <div>
                    <h3>Book Details:</h3>
                    <p>Title: {book.title}</p>
                    <p>Author: {book.author}</p>
                    <p>CID: {book.cid}</p>
                    <p>Uploaded by: {book.uploader}</p>
                </div>
            )}
        </div>
    );
};

export default BookSearch;
