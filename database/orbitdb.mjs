import * as IPFS from 'ipfs-core';
import OrbitDB from 'orbit-db';

async function initializeIPFS() {
    // Create a local IPFS instance using ipfs-core
    const ipfs = await IPFS.create();
    console.log("IPFS instance created");
    return ipfs;
}

async function initializeOrbitDB(ipfs) {
    const orbitdb = await OrbitDB.createInstance(ipfs);
    console.log("OrbitDB instance initialized");
    return orbitdb;
}

export async function setupDatabase() {
    const ipfs = await initializeIPFS();
    const orbitdb = await initializeOrbitDB(ipfs);
    console.log("Database setup complete");
    return { ipfs, orbitdb };
}