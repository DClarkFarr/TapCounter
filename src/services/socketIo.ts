import { io } from "socket.io-client";

var socket = io(import.meta.env.VITE_SOCKET_ENDPOINT, {
    path: import.meta.env.VITE_SOCKET_PATH,
    // withCredentials: true,
});

const initSocket = () => {
    socket.on("connect", () => {
        // console.log("a user connected");
    });
    socket.on("disconnect", () => {
        // console.log("user disconnected");
    });
};
export { socket, initSocket };
