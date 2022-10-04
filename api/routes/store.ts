import { Router } from "express";
import { ObjectId } from "mongodb";
import {
    getStoreCollection,
    toSafeObject as toSafeStore,
} from "../db/storeModel";
import {
    BatchFields,
    getBatchCollection,
    toSafeObject as toSafeBatch,
} from "../db/batchModel";
import { initToken, isAuth, StoreRequest } from "../middleware/jwt";

const router = Router();

router.get("/", async (req, res) => {
    const collection = await getStoreCollection();

    const stores = await collection
        .find({
            deletedAt: null,
        })
        .toArray();

    res.json({ stores: stores.map((s) => toSafeStore(s)) });
});

router.get("/batch", initToken, isAuth, async (req, res) => {
    const r = req as StoreRequest;

    const collection = await getBatchCollection();

    const batches = await collection
        .find(
            {
                storeId: new ObjectId(r.auth.selectedStore),
            },
            {
                sort: {
                    createdAt: -1,
                },
            }
        )
        .toArray();

    res.json({ batches: batches.map((b) => toSafeBatch(b)) });
});

router.post("/batch", initToken, isAuth, async (req, res) => {
    const r = req as StoreRequest;

    const toCreate: BatchFields = {
        storeId: new ObjectId(r.auth.selectedStore),
        name: req.body.name,
        createdAt: new Date(),
        completedAt: null,
        items: [],
    };

    const collection = await getBatchCollection();

    const { acknowledged, insertedId } = await collection.insertOne(toCreate);

    if (!acknowledged) {
        res.status(500).json({ error: "Batch creation failed" });
        return;
    }

    const found = await collection.findOne({ _id: insertedId });

    if (!found) {
        res.status(500).json({ error: "Failed to retrieve batch" });
        return;
    }

    res.json({ batch: toSafeBatch(found) });
});

export default router;
