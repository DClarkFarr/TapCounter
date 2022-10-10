import http from "http";
import app, { useCors } from "./utils/app";
import { getMongoClient } from "./db/connect";

import authRoutes from "./routes/auth";
import storeRoutes from "./routes/store";
import { initSocketIo } from "./utils/socket";

const server = http.createServer(app);

initSocketIo(server);

useCors();

app.use("/auth", authRoutes);
app.use("/store", storeRoutes);

const port = process.env.PORT;

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);

    getMongoClient().then(() => {
        console.log("connected to mongo");
    });
});
