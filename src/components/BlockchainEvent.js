import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Library from '../artifacts/Library.json';

function BlockchainEvents({ contractAddress }) {
  const [events, setEvents] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== "undefined" && contractAddress) {
        try {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(newProvider);

          const contract = new ethers.Contract(contractAddress, Library.abi, newProvider);
          setContract(contract);

          // Listen to BookAdded events
          contract.on("BookAdded", (bookId, title, author, cid, uploader, event) => {
            console.log('New book added:', {
              bookId: bookId.toString(),
              title,
              author,
              cid,
              uploader,
              blockNumber: event.blockNumber,
              transactionHash: event.transactionHash
            });
            setEvents(prevEvents => {
                const isDuplicate = prevEvents.some(e => e.transactionHash === event.transactionHash);
                if (!isDuplicate) {
                  return [{
                    bookId: bookId.toString(),
                    title,
                    author,
                    cid,
                    uploader,
                    blockNumber: event.blockNumber,
                    transactionHash: event.transactionHash
                  }, ...prevEvents];
                }
                return prevEvents; // Return the same list if duplicate
              });
            });

        //     setEvents(prevEvents => [{
        //       bookId: bookId.toString(),
        //       title,
        //       author,
        //       cid,
        //       uploader,
        //       blockNumber: event.blockNumber,
        //       transactionHash: event.transactionHash
        //     }, ...prevEvents]);
        //   });

          // Get past events
          const filter = contract.filters.BookAdded();
          const pastEvents = await contract.queryFilter(filter);
          
          const formattedEvents = pastEvents.map(event => ({
            bookId: event.args.bookId.toString(),
            title: event.args.title,
            author: event.args.author,
            cid: event.args.cid,
            uploader: event.args.uploader,
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash
          }));

        //   setEvents(formattedEvents);
        setEvents(prevEvents => [...formattedEvents.reverse(), ...prevEvents]);
        } catch (error) {
          console.error("Error initializing blockchain events:", error);
        }
      }
    };

    initializeContract();

    return () => {
      if (contract) {
        contract.removeAllListeners();
      }
    };
  }, [contractAddress]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Blockchain Events</h2>
      <div>
        {events.length === 0 ? (
          <p>No books have been added yet.</p>
        ) : (
          <div>
            {events.map((event, index) => (
              <div key={index} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                margin: '10px 0',
                padding: '15px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Uploader: </strong>
                  <span style={{ 
                    backgroundColor: '#e8e8e8',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}>
                    {event.uploader}
                  </span>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>CID: </strong>
                  <a 
                    href={`https://ipfs.io/ipfs/${event.cid}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#e8e8e8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      textDecoration: 'none',
                      color: '#0066cc'
                    }}
                  >
                    {event.cid}
                  </a>
                </div>

                <div>
                  <strong>Title: </strong>{event.title}<br />
                  <strong>Author: </strong>{event.author}<br />
                  <strong>Book ID: </strong>{event.bookId}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockchainEvents;