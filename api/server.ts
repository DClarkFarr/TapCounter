import app from "./utils/app";

import authRoutes from "./routes/auth";
import { getMongoClient } from "./db/connect";

app.use("/auth", authRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);

    getMongoClient().then(() => {
        console.log("connected to mongo");
    });
});
