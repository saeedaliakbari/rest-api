const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

//save image in server
const fileStoarage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});
//filter type of image for save
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

app.use(bodyParser.json());
// app.use(
//   multer({ storage: fileStoarage, fileFilter: fileFilter }).single("image")
// );
app.use("/images", express.static(path.join(__dirname, "images")));

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
app.use("/auth", authRoutes);

//error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(error.statusCode).json({ message: message });
});

mongoose
  .connect("mongodb://0.0.0.0:27017/blog", { autoIndex: true })
  .then((result) => {
    console.log("Connect to mongoose");
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("client connected");

      socket.on("Test", (msg) => {
        console.log(msg);
        socket.emit("Test", "Send Test " + msg.content);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
