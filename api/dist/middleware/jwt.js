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
exports.isAuth = exports.hasToken = exports.initToken = void 0;
const express_jwt_1 = require("express-jwt");
const storeModel_1 = require("../db/storeModel");
exports.initToken = (0, express_jwt_1.expressjwt)({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken(req) {
        if (req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer") {
            return req.headers.authorization.split(" ")[1];
        }
        else if (req.query && req.query.token) {
            return req.query.token;
        }
        return;
    },
});
/**
 * Token in some form exists
 */
const hasToken = (req, res, next) => {
    if (!req.auth) {
        return res.status(401).send("Token required");
    }
    next();
};
exports.hasToken = hasToken;
/**
 * Token must contain a valid store code
 */
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const r = req;
    console.log("got auth", r.auth);
    if (!((_a = r.auth) === null || _a === void 0 ? void 0 : _a.selectedStore)) {
        res.status(401).send("Store code required");
        return;
    }
    const store = yield (0, storeModel_1.getStoreById)(r.auth.selectedStore);
    if (!store) {
        res.status(401).send("Invalid store id");
        return;
    }
    r.store = store;
    next();
});
exports.isAuth = isAuth;
