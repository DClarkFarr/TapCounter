import { NextFunction, Request, Response } from "express";
import { expressjwt } from "express-jwt";
import { getStoreByCode, StoreDocument } from "../db/storeModel";

export type TokenBody = {
    storeCode: string;
};

export interface TokenRequest extends Request {
    auth: TokenBody;
}

export interface TokenMaybeStoreRequest extends TokenRequest {
    store?: StoreDocument;
}

export interface StoreRequest extends TokenRequest {
    store: StoreDocument;
}

export const initToken = expressjwt({
    secret: process.env.JWT_SECRET as string,
    algorithms: ["HS256"],
    credentialsRequired: false,
    getToken(req) {
        if (
            req.headers.authorization &&
            req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
            return req.headers.authorization.split(" ")[1];
        } else if (req.query && req.query.token) {
            return req.query.token as string;
        }
        return;
    },
});

/**
 * Token in some form exists
 */
export const hasToken = (
    req: TokenRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.auth) {
        return res.status(401).send("Token required");
    }
    next();
};

/**
 * Token must contain a valid store code
 */
export const isAuth = async (
    req: TokenMaybeStoreRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.auth?.storeCode) {
        res.status(401).send("Store code required");
        return;
    }

    const store = await getStoreByCode(req.auth.storeCode);
    if (!store) {
        res.status(401).send("Invalid store code");
        return;
    }

    req.store = store;

    next();
};