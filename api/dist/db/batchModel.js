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
exports.toSafeObject = exports.getStoreById = exports.getStoreByCode = exports.getBatchCollection = void 0;
const mongodb_1 = require("mongodb");
const connect_1 = require("./connect");
const getBatchCollection = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, connect_1.getMongoDb)();
    return db.collection("batches");
});
exports.getBatchCollection = getBatchCollection;
const getStoreByCode = (code) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, exports.getBatchCollection)();
    return collection.findOne({ code });
});
exports.getStoreByCode = getStoreByCode;
const getStoreById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const collection = yield (0, exports.getBatchCollection)();
    return collection.findOne({ _id: new mongodb_1.ObjectId(id) });
});
exports.getStoreById = getStoreById;
const toSafeObject = (doc) => {
    var _a;
    return {
        id: doc._id.toString(),
        name: doc.name,
        createdAt: doc.createdAt.toISOString(),
        completedAt: ((_a = doc.completedAt) === null || _a === void 0 ? void 0 : _a.toISOString()) || null,
        items: doc.items,
    };
};
exports.toSafeObject = toSafeObject;
