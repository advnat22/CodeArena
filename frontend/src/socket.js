import { io } from "socket.io-client";

export const socket = io("https://codearena-wkgs.onrender.com", {
  transports: ["polling", "websocket"],
  autoConnect: true,
});
