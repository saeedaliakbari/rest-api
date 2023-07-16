const User = require("../models/user");
const { validationResult, Result } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation faild,entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  bcrypt
    .hash(password, 10)
    .then((hashPw) => {
      console.log(hashPw);
      const user = new User({
        email: email,
        password: hashPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "user created ", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      console.log("pass: " + password);
      console.log("user pass: " + user.password);
      return bcrypt.compare(user.password, password);
    })
    .then((isEqual) => {
      console.log(isEqual);
       if (!isEqual) {
        const error = new Error("password is wrong");
        error.statusCode = 500;
        throw error;
      }
      const token = jwt.sign(
        { email: email, userId: loadedUser._id.toString() },
        "privatekeysaeedaliakabri",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
