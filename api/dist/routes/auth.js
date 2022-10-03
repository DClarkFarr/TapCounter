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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storeModel_1 = require("../db/storeModel");
const express_1 = require("express");
const mongodb_1 = require("mongodb");
const jwt_1 = require("../middleware/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
router.get("/", jwt_1.initToken, jwt_1.isAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const r = req;
    res.json({
        store: (0, storeModel_1.toSafeObject)(r.store),
    });
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const r = req;
    if (!r.body.id || !r.body.code) {
        return res.status(400).json({
            message: "ID and code required",
        });
    }
    const collection = yield (0, storeModel_1.getStoreCollection)();
    const found = yield collection.findOne({
        _id: new mongodb_1.ObjectId(r.body.id),
        code: r.body.code,
    });
    if (!found) {
        return res.status(404).json({
            message: "Store not found",
        });
    }
    try {
        const token = jsonwebtoken_1.default.sign({ selectedStore: found._id.toString() }, process.env.JWT_SECRET, {
            algorithm: "HS256",
        });
        res.header("x-token", token).json({
            message: "Store selected",
        });
    }
    catch (err) {
        console.warn("cauth error creating token", err);
        res.status(500).json({
            message: "Error creating token",
        });
    }
}));
exports.default = router;
