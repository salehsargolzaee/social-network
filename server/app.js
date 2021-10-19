"use strict";

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { readdirSync } = require("fs");

const app = express();

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
    origin: ["http://localhost:3000"],
  })
);

// autoload routes

readdirSync("./routes").map((rt) => app.use("/api", require(`./routes/${rt}`)));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
