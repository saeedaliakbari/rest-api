const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const feedRoutes = require("./routes/feed");
const { query, validationResult } = require("express-validator");
const { check } = require("express-validator");
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace with the appropriate origin
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);
app.listen(8080);
