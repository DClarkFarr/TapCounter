import { Server } from "socket.io";
import http from "http";
import { BatchDocument, toSafeObject as toSafeBatch } from "../db/batchModel";

let io: Server;

const initSocketIo = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            // credentials: true,
        },
    });
    io.on("connection", (socket) => {
        // console.log("a user connected");

        socket.on("disconnect", (ss) => {
            // console.log("a user disconnected", ss);
        });
    });
};

const emitBatchChanged = (storeId: string, batch: BatchDocument) => {
    io.emit(`${storeId} batch update`, toSafeBatch(batch));
};

const emitBatchCreated = (storeId: string, batch: BatchDocument) => {
    io.emit(`${storeId} batch create`, toSafeBatch(batch));
};

export { io, initSocketIo, emitBatchChanged, emitBatchCreated };
