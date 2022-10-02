import { ObjectId, WithId } from "mongodb";
import { getMongoDb } from "./connect";
export interface StoreFields {
    name: string;
    code: string;
    deletedAt?: string;
}

export type StoreDocument = WithId<StoreFields>;

export const getStoreCollection = async () => {
    const db = await getMongoDb();
    return db.collection<StoreFields>("stores");
};

export const getStoreByCode = async (code: string) => {
    const collection = await getStoreCollection();
    return collection.findOne({ code });
};
