import { ObjectId, WithId } from "mongodb";
import { getMongoDb } from "./connect";

export type BatchItem = {
    name: string;
    quantity: number;
};
export interface BatchFields {
    storeId: ObjectId;
    name: string;
    createdAt: Date;
    completedAt: Date | null;
    items: BatchItem[];
}

export type BatchDocument = WithId<BatchFields>;

export const getBatchCollection = async () => {
    const db = await getMongoDb();
    return db.collection<BatchFields>("batches");
};

export const getStoreByCode = async (code: string) => {
    const collection = await getBatchCollection();
    return collection.findOne({ code });
};

export const getStoreById = async (id: string) => {
    const collection = await getBatchCollection();
    return collection.findOne({ _id: new ObjectId(id) });
};

export const toSafeObject = (doc: BatchDocument) => {
    return {
        id: doc._id.toString(),
        name: doc.name,
        createdAt: doc.createdAt.toISOString(),
        completedAt: doc.completedAt?.toISOString() || null,
        items: doc.items,
    };
};
