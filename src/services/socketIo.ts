import { io } from "socket.io-client";

console.log(
    "got vite socket endpoint",
    import.meta.env.VITE_SOCKET_ENDPOINT,
    "and",
    import.meta.env.VITE_SOCKET_PATH
);

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
