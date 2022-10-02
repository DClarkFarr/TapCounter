"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDb = exports.getMongoClient = void 0;
const mongodb_1 = require("mongodb");
let indexesCreated = false;
function createIndexes(client) {
    return __awaiter(this, void 0, void 0, function* () {
        if (indexesCreated)
            return client;
        const db = client.db();
        yield Promise.all([
            db.collection("stores").createIndex({ code: 1 }),
            db.collection("stores").createIndex({ deletedAt: 1 }),
        ]);
        indexesCreated = true;
        return client;
    });
}
function getMongoClient() {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Global is used here to maintain a cached connection across hot reloads
         * in development. This prevents connections growing exponentiatlly
         * during API Route usage.
         * https://github.com/vercel/next.js/pull/17666
         */
        if (!global.mongoClientPromise) {
            const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
            // client.connect() returns an instance of MongoClient when resolved
            global.mongoClientPromise = client
                .connect()
                .then((client) => createIndexes(client));
        }
        return global.mongoClientPromise;
    });
}
exports.getMongoClient = getMongoClient;
const getMongoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const mongoClient = yield getMongoClient();
    return mongoClient.db();
});
exports.getMongoDb = getMongoDb;
