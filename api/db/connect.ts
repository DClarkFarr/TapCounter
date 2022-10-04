import { MongoClient } from "mongodb";

let indexesCreated = false;
async function createIndexes(client: MongoClient) {
    if (indexesCreated) return client;
    const db = client.db();
    await Promise.all([
        db.collection("stores").createIndex({ code: 1 }),
        db.collection("stores").createIndex({ deletedAt: 1 }),
        db.collection("batches").createIndex({ storeId: 1 }),
        db.collection("batches").createIndex({ storeId: -1 }),
    ]);
    indexesCreated = true;
    return client;
}

export async function getMongoClient() {
    /**
     * Global is used here to maintain a cached connection across hot reloads
     * in development. This prevents connections growing exponentiatlly
     * during API Route usage.
     * https://github.com/vercel/next.js/pull/17666
     */
    if (!global.mongoClientPromise) {
        const client = new MongoClient(process.env.MONGODB_URI as string);
        // client.connect() returns an instance of MongoClient when resolved
        global.mongoClientPromise = client
            .connect()
            .then((client) => createIndexes(client));
    }
    return global.mongoClientPromise;
}

export const getMongoDb = async () => {
    const mongoClient = await getMongoClient();
    return mongoClient.db();
};
