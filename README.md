<h1>
  <img src="./demo-installation/Logo.png" alt="Logo" style="vertical-align: middle; margin-right: 20px; width: 270px; height: 70px;">
  IPFS-BlockchainLib
</h1>

## Abstract
This project explores the design and implementation of a decentralized storage system leveraging InterPlanetary File System (IPFS), OrbitDB, and blockchain technology, named IPFS Library. While IPFS offers robust decentralized file storage, its usability is limited by the need to know file-specific Content Identifiers (CIDs) for retrieval. To address this, we integrated OrbitDB to store metadata such as file titles and authors, enabling users to search and retrieve files intuitively. Blockchain technology enhances transparency by recording user actions, such as file uploads and deletions, while a virtual currency mechanism based on Ethereum incentivizes responsible behavior and optimizes resource use. Our system demonstrates an accessible, accountable, and decentralized solution for file storage, advancing the principles of Web3. This project is the HKUST COMP4651 Fall2024 course final project.

<p align="center">
  <img src="./demo-installation/frame.png" alt="Abstract Overview" style="width: 800px; height: auto;">
</p>

## Installation
Please refer to [INSTALL.md](./demo-installation/INSTALL.md).

## Start IPFS Library
After successful installation, you could start the IPFS by the following instructions.

Open 4 seperate terminals. 

1. For the first terminal, run 
    ```sh
    ipfs daemon
    ```

2. For the second terminal, run 
    ```sh
    node server.mjs
    ```

3. For the third terminal, run 
    ```sh
    anvil
    ```

4. For the fourth terminal, run 
    ```sh
    npm start
    ```

## Demonstration

**Full demonstration video: (https://www.youtube.com/watch?v=s6HwSukH7oA)**
[![Video Thumbnail](https://img.youtube.com/vi/s6HwSukH7oA/0.jpg)](https://www.youtube.com/watch?v=s6HwSukH7oA)

For demonstration purposes, we have provided a sample book: [Book0](demo-installation/Book0.html). 

You could also refer to the small piece demo in [DEMO.md](./demo-installation/DEMO.md) which provides instructions for key steps for installation and quickstart.

