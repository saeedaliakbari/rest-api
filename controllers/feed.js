const { validationResult } = require("express-validator/check");
const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      if (!posts) {
        const err = new Error("any post not created yet");
        err.statusCode = 404;
        throw err;
      } else {
        res.status(200).json({ message: "posts fetched", posts: posts });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
if (!req.file) {
  const err = new Error("No image provided");
  err.statusCode = 422;
  throw err;
}
const imageUrl = req.file.path;

exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = "Validation faild.";
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    id: new Date().toISOString(),
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: { name: "Saeed Aliakbari" },
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "new post created",
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
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("not found post");
        err.statusCode = 404;
        throw err;
      } else {
        res.status(200).json({ message: "post fetched", post: post });
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
