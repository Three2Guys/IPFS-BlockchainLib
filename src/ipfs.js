import { create } from "ipfs-http-client";

const ipfs = create({ host: "localhost", port: "5001", protocol: "https" });

export const uploadToIPFS = async (content, metadata) => {
  try {
    const data = {
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
      content: content,
    };

    const { cid } = await ipfs.add(JSON.stringify(data));
    console.log("File uploaded to IPFS with CID:", cid.toString());

    // Store CID and metadata in localStorage for search
    const index = JSON.parse(localStorage.getItem("contentIndex") || "{}");
    index[cid.toString()] = metadata;
    localStorage.setItem("contentIndex", JSON.stringify(index));

    return cid.toString();
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
};

export const getFromIPFS = async (cid) => {
  try {
    const stream = await ipfs.cat(cid);
    let data = "";
    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk);
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error getting from IPFS:", error);
    throw error;
  }
};

export const searchContent = (keyword) => {
  const index = JSON.parse(localStorage.getItem("contentIndex") || "{}");
  return Object.entries(index)
    .filter(
      ([_, metadata]) =>
        metadata.keywords.some((k) =>
          k.toLowerCase().includes(keyword.toLowerCase())
        ) || metadata.title.toLowerCase().includes(keyword.toLowerCase())
    )
    .map(([cid, metadata]) => ({
      cid,
      ...metadata,
    }));
};
