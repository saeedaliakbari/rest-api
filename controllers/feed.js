const { validationResult, Result } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find().then((posts) => {
    res
      .status(200)
      .json({ message: "Posts feteche", posts: posts })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};
exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  // res.json({ error: errors.array() });
  if (!errors.isEmpty()) {
    const error = new Error("validation faild,entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const name = req.body.name;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: name },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post added",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.body.postId;
  // const postId = "64ae659ef96f6199c2986f9c";
  Post.findById(postId).then((post) => {
    if (!post) {
      const error = new Error("not found post");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({
        message: "Post fetched",
        posts: post,
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};
