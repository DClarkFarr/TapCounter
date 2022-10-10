"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitBatchCreated = exports.emitBatchChanged = exports.initSocketIo = exports.io = void 0;
const socket_io_1 = require("socket.io");
const batchModel_1 = require("../db/batchModel");
let io;
exports.io = io;
const initSocketIo = (server) => {
    exports.io = io = new socket_io_1.Server(server, {
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
exports.initSocketIo = initSocketIo;
const emitBatchChanged = (storeId, batch) => {
    io.emit(`${storeId} batch update`, (0, batchModel_1.toSafeObject)(batch));
};
exports.emitBatchChanged = emitBatchChanged;
const emitBatchCreated = (storeId, batch) => {
    io.emit(`${storeId} batch create`, (0, batchModel_1.toSafeObject)(batch));
};
exports.emitBatchCreated = emitBatchCreated;
