import React, { useState } from "react";

const BookUpload = () => {
  const [file, setFile] = useState(null);

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("File uploaded to IPFS with CID:", data.Hash);
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default BookUpload;
