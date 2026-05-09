import { io } from "socket.io-client";

/*
SOCKET URL
*/
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL;

/*
CONNECT SOCKET
*/
export const socket = io(
  SOCKET_URL,
  {
    transports: [
      "websocket",
    ],
  }
);