const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");
const bodyParser = require("body-parser");
const { error } = require("console");

const app = express();

app.use(bodyParser.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

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
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  res.status(status).json({
    message: message,
  });
});
mongoose
  .connect("mongodb://0.0.0.0:27017/shopping", { autoIndex: true })
  .then((result) => {
    console.log("Connect to mongoose");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
