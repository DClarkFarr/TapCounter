import { getStoreCollection } from "../db/storeModel";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const collection = await getStoreCollection();

    const stores = await collection.find({}).toArray();

    res.json({ stores });
});

export default router;
