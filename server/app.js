"use strict";

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-type"],
  },
});

// Database connection
mongoose.connect(process.env.DATABASE, (err) => {
  if (err) {
    console.log("Database connection error=>", err);
  } else {
    console.log("Successfully connected to the database.");
  }
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// autoload routes

readdirSync("./routes").map((rt) => app.use("/api", require(`./routes/${rt}`)));

// socketio

io.on("connect", (socket) => {
  // console.log("socket.io =>", socket.id);
  socket.on("new-post", (post) => {
    // console.log("New post =>", post);
    socket.broadcast.emit("new-post", post);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
