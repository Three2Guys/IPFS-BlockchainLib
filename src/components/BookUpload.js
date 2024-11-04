import React, { useState } from "react";

const uploadFile = async (file) => {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5001/api/v0/add", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("File uploaded to IPFS with CID:", data.Hash);
  } else {
    console.log("No file selected");
  }
};

const BookUpload = () => {
  const [file, setFile] = useState(null);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => uploadFile(file)}>Upload</button>
    </div>
  );
};

export default BookUpload;
