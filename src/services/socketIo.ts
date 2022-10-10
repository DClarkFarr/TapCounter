import { io } from "socket.io-client";

console.log("got vite socket endpoint", import.meta.env.VITE_SOCKET_ENDPOINT);

var socket = io(import.meta.env.VITE_SOCKET_ENDPOINT, {
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
