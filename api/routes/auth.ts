import { getStoreCollection } from "../db/storeModel";
import { Router, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { initToken, isAuth, TokenRequest } from "../middleware/jwt";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

router.post("/", async (req, res) => {
    const r = req as TokenRequest;

    if (!r.body.id || !r.body.code) {
        return res.status(400).json({
            message: "ID and code required",
        });
    }
    const collection = await getStoreCollection();
    const found = await collection.findOne({
        _id: new ObjectId(r.body.id),
        code: r.body.code,
    });

    if (!found) {
        return res.status(404).json({
            message: "Store not found",
        });
    }

    try {
        const token = jwt.sign(
            { selectedStore: found._id.toString() },
            process.env.JWT_SECRET as string,
            {
                algorithm: "HS256",
            }
        );

        res.header("x-token", token).json({
            message: "Store selected",
        });
    } catch (err) {
        console.warn("cauth error creating token", err);
        res.status(500).json({
            message: "Error creating token",
        });
    }
});

export default router;
