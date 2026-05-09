const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/*
STORE ROOM USERS
*/
const roomUsers = {};

io.on("connection", (socket) => {

  console.log(
    "User Connected:",
    socket.id
  );

  /*
  JOIN ROOM
  */
  socket.on(
    "join-room",
    ({ roomId, username }) => {

      /*
      PREVENT DUPLICATE JOIN
      */
      if (socket.roomId === roomId) {
        return;
      }

      socket.join(roomId);

      /*
      SAVE ROOM + USERNAME
      */
      socket.roomId = roomId;

      socket.username = username;

      /*
      CREATE ROOM
      */
      if (!roomUsers[roomId]) {
        roomUsers[roomId] = [];
      }

      /*
      CHECK EXISTING USER
      */
      const existingUser =
        roomUsers[roomId].find(
          (user) =>
            user.socketId === socket.id
        );

      /*
      ADD USER
      */
      if (!existingUser) {

        roomUsers[roomId].push({
          socketId: socket.id,
          username,
        });

      }

      /*
      SEND USERS
      */
      io.to(roomId).emit(
        "room-users",
        roomUsers[roomId]
      );

      console.log(
        `User ${username} joined room ${roomId}`
      );

    }
  );

  /*
  CODE SYNC
  */
  socket.on(
    "code-change",
    ({ roomId, code }) => {

      socket.to(roomId).emit(
        "receive-code",
        code
      );

    }
  );

  /*
  NOTES SYNC
  */
  socket.on(
    "notes-change",
    ({ roomId, notes }) => {

      socket.to(roomId).emit(
        "receive-notes",
        notes
      );

    }
  );

  /*
  CURSOR MOVEMENT
  */
  socket.on(
    "cursor-move",
    ({
      roomId,
      username,
      line,
      column,
    }) => {

      socket.to(roomId).emit(
        "user-cursor-move",
        {
          socketId: socket.id,
          username,
          line,
          column,
        }
      );

    }
  );

  /*
  UPDATE USERNAME
  */
  socket.on(
    "update-username",
    ({ roomId, username }) => {

      if (!roomUsers[roomId]) return;

      /*
      UPDATE USER
      */
      roomUsers[roomId] =
        roomUsers[roomId].map((user) => {

          if (
            user.socketId === socket.id
          ) {

            return {
              ...user,
              username,
            };

          }

          return user;

        });

      /*
      UPDATE SOCKET
      */
      socket.username = username;

      /*
      BROADCAST USERS
      */
      io.to(roomId).emit(
        "room-users",
        roomUsers[roomId]
      );

    }
  );

  /*
  DISCONNECT
  */
  socket.on("disconnect", () => {

    const roomId = socket.roomId;

    if (
      roomId &&
      roomUsers[roomId]
    ) {

      /*
      REMOVE USER
      */
      roomUsers[roomId] =
        roomUsers[roomId].filter(
          (user) =>
            user.socketId !== socket.id
        );

      /*
      SEND USERS
      */
      io.to(roomId).emit(
        "room-users",
        roomUsers[roomId]
      );

      /*
      CLEAN EMPTY ROOM
      */
      if (
        roomUsers[roomId].length === 0
      ) {

        delete roomUsers[roomId];

      }

    }

    console.log(
      "User Disconnected:",
      socket.id
    );

  });

});

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});