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
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const storeModel_1 = require("../db/storeModel");
const batchModel_1 = require("../db/batchModel");
const jwt_1 = require("../middleware/jwt");
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, storeModel_1.getStoreCollection)();
    const stores = yield collection
        .find({
        deletedAt: null,
    })
        .toArray();
    res.json({ stores: stores.map((s) => (0, storeModel_1.toSafeObject)(s)) });
}));
router.get("/batch", jwt_1.initToken, jwt_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const r = req;
    const collection = yield (0, batchModel_1.getBatchCollection)();
    const batches = yield collection
        .find({
        storeId: new mongodb_1.ObjectId(r.auth.selectedStore),
    }, {
        sort: {
            createdAt: -1,
        },
    })
        .toArray();
    res.json({ batches: batches.map((b) => (0, batchModel_1.toSafeObject)(b)) });
}));
router.post("/batch", jwt_1.initToken, jwt_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const r = req;
    const toCreate = {
        storeId: new mongodb_1.ObjectId(r.auth.selectedStore),
        name: req.body.name,
        createdAt: new Date(),
        completedAt: null,
        items: [],
    };
    const collection = yield (0, batchModel_1.getBatchCollection)();
    const { acknowledged, insertedId } = yield collection.insertOne(toCreate);
    if (!acknowledged) {
        res.status(500).json({ error: "Batch creation failed" });
        return;
    }
    const found = yield collection.findOne({ _id: insertedId });
    if (!found) {
        res.status(500).json({ error: "Failed to retrieve batch" });
        return;
    }
    collection.updateMany({
        _id: {
            $ne: found._id,
        },
        completedAt: null,
    }, {
        $set: {
            completedAt: new Date(),
        },
    });
    res.json({ batch: (0, batchModel_1.toSafeObject)(found) });
}));
router.get("/batch/:id", jwt_1.initToken, jwt_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const r = req;
    const collection = yield (0, batchModel_1.getBatchCollection)();
    const found = yield collection.findOne({
        _id: new mongodb_1.ObjectId(req.params.id),
        storeId: new mongodb_1.ObjectId(r.auth.selectedStore),
    });
    if (!found) {
        res.status(404).json({ error: "Batch not found" });
        return;
    }
    res.json({ batch: (0, batchModel_1.toSafeObject)(found) });
}));
exports.default = router;
