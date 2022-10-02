import { Router, Request, Response } from "express";
import { initToken, isAuth } from "../middleware/jwt";

const router = Router();

router.use(initToken);

router.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

export default router;
