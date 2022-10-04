import { ObjectId, WithId } from "mongodb";
import { getMongoDb } from "./connect";

export interface StoreFields {
    name: string;
    code: string;
    deletedAt: Date | null;
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

export const getStoreById = async (id: string) => {
    const collection = await getStoreCollection();
    return collection.findOne({ _id: new ObjectId(id) });
};

export const toSafeObject = (doc: StoreDocument) => {
    const obj = {
        id: doc._id.toString(),
        name: doc.name,
    };

    return obj;
};
