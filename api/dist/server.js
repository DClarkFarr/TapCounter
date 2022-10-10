"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importStar(require("./utils/app"));
const connect_1 = require("./db/connect");
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const store_1 = __importDefault(require("./routes/store"));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        // credentials: true,
    },
});
(0, app_1.useCors)();
app_1.default.use("/auth", auth_1.default);
app_1.default.use("/store", store_1.default);
const port = process.env.PORT;
io.on("connection", (socket) => {
    // console.log("a user connected");
    socket.on("disconnect", (ss) => {
        // console.log("a user disconnected", ss);
    });
});
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    (0, connect_1.getMongoClient)().then(() => {
        console.log("connected to mongo");
    });
});
