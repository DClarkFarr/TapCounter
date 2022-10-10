import { Router } from "express";
import { Batch, ObjectId } from "mongodb";
import { pick } from "lodash";
import {
    getStoreCollection,
    toSafeObject as toSafeStore,
} from "../db/storeModel";
import {
    BatchDocument,
    BatchFields,
    getBatchCollection,
    toSafeObject as toSafeBatch,
} from "../db/batchModel";
import { initToken, isAuth, StoreRequest } from "../middleware/jwt";
import { emitBatchChanged, emitBatchCreated } from "../utils/socket";

const router = Router();

/**
 * Get Stores list
 */
router.get("/", async (req, res) => {
    const collection = await getStoreCollection();

    const stores = await collection
        .find({
            deletedAt: null,
        })
        .toArray();

    res.json({ stores: stores.map((s) => toSafeStore(s)) });
});

/**
 * Get active store batches
 */
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

/**
 * Create a new batch for authenticated store
 */
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

    collection.updateMany(
        {
            _id: {
                $ne: found._id,
            },
            completedAt: null,
        },
        {
            $set: {
                completedAt: new Date(),
            },
        }
    );

    emitBatchCreated(r.auth.selectedStore, found);

    res.json({ batch: toSafeBatch(found) });
});

/**
 * Get batch of active store
 */
router.get("/batch/:id", initToken, isAuth, async (req, res) => {
    const r = req as StoreRequest;

    const collection = await getBatchCollection();

    const found = await collection.findOne({
        _id: new ObjectId(req.params.id),
        storeId: new ObjectId(r.auth.selectedStore),
    });

    if (!found) {
        res.status(404).json({ error: "Batch not found" });
        return;
    }

    res.json({ batch: toSafeBatch(found) });
});

/**
 * Update batch of active store
 */
router.put("/batch/:id", initToken, isAuth, async (req, res) => {
    const r = req as StoreRequest;

    const collection = await getBatchCollection();

    const found = await collection.findOne({
        _id: new ObjectId(req.params.id),
        storeId: new ObjectId(r.auth.selectedStore),
    });

    if (!found) {
        res.status(404).json({ error: "Batch not found" });
        return;
    }

    const toUpdate: Partial<BatchFields> = {
        ...pick(req.body, ["items", "completedAt"]),
    };

    const { value: batch } = await collection.findOneAndUpdate(
        {
            _id: found._id,
        },
        {
            $set: toUpdate,
        },
        {
            returnDocument: "after",
        }
    );

    if (batch) {
        emitBatchChanged(r.auth.selectedStore, batch);
    }

    res.json({
        updated: true,
    });
});

router.post("/batch/:id/complete", initToken, isAuth, async (req, res) => {
    const r = req as StoreRequest;

    const collection = await getBatchCollection();

    const found = await collection.findOne({
        _id: new ObjectId(req.params.id),
        storeId: new ObjectId(r.auth.selectedStore),
    });

    if (!found) {
        res.status(404).json({ error: "Batch not found" });
        return;
    }

    const { value: batch } = await collection.findOneAndUpdate(
        {
            _id: found._id,
        },
        {
            $set: {
                completedAt: new Date(),
            },
        },
        {
            returnDocument: "after",
        }
    );

    if (batch) {
        emitBatchChanged(r.auth.selectedStore, batch);
    }

    res.json({
        updated: true,
        batch: toSafeBatch(batch as BatchDocument),
    });
});

export default router;
