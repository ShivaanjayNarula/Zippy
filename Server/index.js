const dotenv = require("dotenv");
dotenv.config({ silent: process.env.NODE_ENV === "production" });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "*",
  // "http://localhost:3000", 
  // "https://zippy-iota.vercel.app/share",
  // "https://zippy-8ca4mwwba-shivaanjay-narulas-projects.vercel.app/" // Add your frontend URL here
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const httpServer = http.createServer(app);

app.get("/", (req, res) => {
  res.send("hello from server");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// Maps to track users and rooms
const userRoomMap = new Map(); // Maps socket IDs to room numbers
const userIdMap = new Map(); // Maps socket IDs to unique IDs
const uniqueIdMap = new Map(); // Maps unique IDs to socket IDs

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomNumber) => {
    socket.join(Number(roomNumber));
    userRoomMap.set(socket.id, Number(roomNumber));
    socket.emit("ack", `You have joined room ${roomNumber}`);
  });

  socket.on("message", (messageContent) => {
    const roomNum = userRoomMap.get(socket.id);
    io.to(roomNum).emit("roomMsg", messageContent);
  });

  socket.on("details", (userData) => {
    const userSocketId = userData.socketId;
    const uniqueId = userData.uniqueId;

    userIdMap.set(userSocketId, uniqueId);
    uniqueIdMap.set(uniqueId, userSocketId);
    console.log("New User added");
    for (let [key, value] of userIdMap) {
      console.log(`${key} = ${value}`);
    }
  });

  socket.on("send-signal", (signalData) => {
    console.log(signalData);
    const targetUniqueId = signalData.to;
    const partnerSocketId = uniqueIdMap.get(targetUniqueId);
    io.to(partnerSocketId).emit("signaling", {
      from: signalData.from,
      signalData: signalData.signalData,
      to: signalData.to,
    });
  });

  socket.on("accept-signal", (signalData) => {
    console.log(signalData);
    const targetUniqueId = signalData.to;
    const partnerSocketId = uniqueIdMap.get(targetUniqueId);
    console.log(partnerSocketId);
    io.to(partnerSocketId).emit("callAccepted", {
      signalData: signalData.signalData,
      to: signalData.to,
    });
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    const userSocketId = socket.id;
    const associatedUniqueId = userIdMap.get(userSocketId);

    userIdMap.delete(userSocketId);
    uniqueIdMap.delete(associatedUniqueId);

    console.log("Updated userIdMap:");
    for (let [key, value] of userIdMap) {
      console.log(`${key} = ${value}`);
    }

    console.log("Updated uniqueIdMap:");
    for (let [key, value] of uniqueIdMap) {
      console.log(`${key} = ${value}`);
    }
  });
});

httpServer.listen(process.env.PORT || 8000, () => {
  console.log(`Listening on ${process.env.PORT ? process.env.PORT : "8000"}`);
});
