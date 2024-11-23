import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Library from "../artifacts/Library.json";

function BlockchainEvents({ contractAddress }) {
  const [events, setEvents] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (typeof window.ethereum !== "undefined" && contractAddress) {
        try {
          const newProvider = new ethers.providers.Web3Provider(
            window.ethereum
          );
          setProvider(newProvider);

          const contract = new ethers.Contract(
            contractAddress,
            Library.abi,
            newProvider
          );
          setContract(contract);

          // Listen to BookAdded events
          contract.on(
            "BookAdded",
            (bookId, title, author, cid, uploader, event) => {
              console.log("New book added:", {
                bookId: bookId.toString(),
                title,
                author,
                cid,
                uploader,
                blockNumber: event.blockNumber,
                transactionHash: event.transactionHash,
              });
              setEvents((prevEvents) => {
                const isDuplicate = prevEvents.some(
                  (e) => e.transactionHash === event.transactionHash
                );
                if (!isDuplicate) {
                  return [
                    {
                      bookId: bookId.toString(),
                      title,
                      author,
                      cid,
                      uploader,
                      blockNumber: event.blockNumber,
                      transactionHash: event.transactionHash,
                    },
                    ...prevEvents,
                  ];
                }
                return prevEvents; // Return the same list if duplicate
              });
            }
          );

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

          const formattedEvents = pastEvents.map((event) => ({
            bookId: event.args.bookId.toString(),
            title: event.args.title,
            author: event.args.author,
            cid: event.args.cid,
            uploader: event.args.uploader,
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
          }));

          //   setEvents(formattedEvents);
          setEvents((prevEvents) => [
            ...formattedEvents.reverse(),
            ...prevEvents,
          ]);
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
        Blockchain Events
      </h2>
      <div>
        {events.length === 0 ? (
          <p style={{ marginTop: "1.5rem" }}>No books have been added yet.</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {events.map((event, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Uploader: </strong>
                  <span
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                      color: "#374151",
                      fontFamily: "monospace",
                    }}
                  >
                    {event.uploader}
                  </span>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <strong>CID: </strong>
                  <a
                    href={`https://ipfs.io/ipfs/${event.cid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#f3f4f6",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "16px",
                      color: "#2563eb",
                      textDecoration: "none",
                      fontFamily: "monospace",
                      display: "inline-block",
                    }}
                  >
                    {event.cid}
                  </a>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    fontSize: "16px",
                  }}
                >
                  <div>
                    <strong>Title: </strong>
                    {event.title}
                  </div>
                  <div>
                    <strong>Author: </strong>
                    {event.author}
                  </div>
                  <div>
                    <strong>Book ID: </strong>
                    {event.bookId}
                  </div>
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
