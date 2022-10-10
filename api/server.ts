import http from "http";
import app, { useCors } from "./utils/app";
import { getMongoClient } from "./db/connect";
import { Server } from "socket.io";

import authRoutes from "./routes/auth";
import storeRoutes from "./routes/store";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        // credentials: true,
    },
});

useCors();

app.use("/auth", authRoutes);
app.use("/store", storeRoutes);

const port = process.env.PORT;

io.on("connection", (socket) => {
    // console.log("a user connected");

    socket.on("disconnect", (ss) => {
        // console.log("a user disconnected", ss);
    });
});

server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);

    getMongoClient().then(() => {
        console.log("connected to mongo");
    });
});
