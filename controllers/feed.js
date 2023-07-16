const { validationResult, Result } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");
const { Schema } = require("mongoose");
const post = require("../models/post");

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
  if (!errors.isEmpty()) {
    const error = new Error("validation faild,entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.body.imageUrl;
  const title = req.body.title;
  const content = req.body.content;
  const userId = req.body.userId;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post added",
        post: post,
        creator: { _id: creator._id, name: creator.name },
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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const content = req.body.content;
  const userId = req.body.userId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("not found post");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "update post successful", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  const userId = req.body.userId;
  Post.findById(postId)
    .then((post) => {
      //check user create this post
      if (!post) {
        const error = new Error("not found post");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 403;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Delete post success" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
