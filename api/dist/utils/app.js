"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCors = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const useCors = () => {
    const whitelist = [process.env.CORS_ORIGIN];
    app.use((0, cors_1.default)({
        origin(origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || origin === undefined) {
                callback(null, true);
            }
            else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        // origin: true,
        credentials: true,
        exposedHeaders: ["x-token"],
    }));
};
exports.useCors = useCors;
exports.default = app;
