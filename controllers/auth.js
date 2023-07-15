const User = require("../models/user");
const { validationResult, Result } = require("express-validator");

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
    
    
};
