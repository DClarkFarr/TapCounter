import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

export const useCors = () => {
    const whitelist = [process.env.CORS_ORIGIN];
    app.use(
        cors({
            origin(origin, callback) {
                if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            // origin: true,
            credentials: true,
            exposedHeaders: ["x-token"],
        })
    );
};

export default app;
