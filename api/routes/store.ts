import { getStoreCollection, toSafeObject } from "../db/storeModel";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const collection = await getStoreCollection();

    const stores = await collection
        .find({
            deletedAt: null,
        })
        .toArray();

    res.json({ stores: stores.map((s) => toSafeObject(s)) });
});

export default router;
