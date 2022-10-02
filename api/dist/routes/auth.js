"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwt_1 = require("../middleware/jwt");
const router = (0, express_1.Router)();
router.use(jwt_1.initToken);
router.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
exports.default = router;
