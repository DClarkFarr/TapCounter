import app from "./utils/app";
import { getMongoClient } from "./db/connect";

import authRoutes from "./routes/auth";
import storeRoutes from "./routes/store";

app.use("/auth", authRoutes);
app.use("/store", storeRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);

    getMongoClient().then(() => {
        console.log("connected to mongo");
    });
});
