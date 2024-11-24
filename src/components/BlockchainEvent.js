import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

        const latestBlock = await provider.getBlockNumber();
        console.log(`Latest block number: ${latestBlock}`);

        const fetchedTransactions = [];
        for (let i = latestBlock; i > Math.max(latestBlock - 10, 0); i--) {
          const block = await provider.getBlockWithTransactions(i);

          block.transactions.forEach((tx) => {
            fetchedTransactions.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: ethers.utils.formatEther(tx.value),
              gasLimit: tx.gasLimit.toString(),
              blockNumber: tx.blockNumber,
            });
          });
        }

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
        Recent Blockchain Transactions
      </h2>

      {loading ? (
        <p style={{ marginTop: "1.5rem" }}>Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p style={{ marginTop: "1.5rem" }}>No recent transactions found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {transactions.map((tx, index) => (
            <li
              key={index}
              style={{
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "1rem",
              }}
            >
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Block Number:</strong> {tx.blockNumber}
              </p>
              <p style={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}>
                <strong>Hash:</strong>{" "}
                <span
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    marginLeft: "0.5rem",
                  }}
                >
                  {tx.hash}
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(tx.hash)}
                  style={{
                    marginLeft: "1rem",
                    height: "30px",
                    padding: "0 1rem",
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
              <p style={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}>
                <strong>From:</strong>{" "}
                <span
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    marginLeft: "0.5rem",
                  }}
                >
                  {tx.from}
                </span>
                <a
                  href={`https://etherscan.io/address/${tx.from}`}
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
              <p style={{ margin: "0.5rem 0", display: "flex", alignItems: "center" }}>
                <strong>To:</strong>{" "}
                <span
                  style={{
                    backgroundColor: "#f3f4f6",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontFamily: "monospace",
                    marginLeft: "0.5rem",
                  }}
                >
                  {tx.to}
                </span>
                <a
                  href={`https://etherscan.io/address/${tx.to}`}
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
                <strong>Value:</strong> {tx.value} ETH
              </p>
              <p style={{ margin: "0.5rem 0" }}>
                <strong>Gas Limit:</strong> {tx.gasLimit}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentTransactions;