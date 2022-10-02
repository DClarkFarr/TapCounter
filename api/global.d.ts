import { MongoClient } from "mongodb";

declare module NodeJS {
    interface Global {
        mongoClientPromise: Promise<MongoClient>;
    }
}

declare global {
    var mongoClientPromise: Promise<MongoClient>;
}
declare module globalThis {
    var mongoClientPromise: Promise<MongoClient>;
}

export declare global {
    declare module globalThis {
        var mongoClientPromise: Promise<MongoClient>;
    }
}
