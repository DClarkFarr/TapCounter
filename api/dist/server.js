"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./utils/app"));
const auth_1 = __importDefault(require("./routes/auth"));
const connect_1 = require("./db/connect");
app_1.default.use("/auth", auth_1.default);
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    (0, connect_1.getMongoClient)().then(() => {
        console.log("connected to mongo");
    });
});