import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());

export default app;
