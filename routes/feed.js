const express = require("express");
const { body } = require("express-validator/check");
const feedController = require("../controllers/feed");

const router = express.Router();
router.get("/posts", feedController.getPosts);
router.post(
  "/posts",
  body("title").trim().isLentgh({ min: 5 }),
  body("content").trim().isLentgh({ min: 5 }),
  feedController.createPosts
);

router.get("/post/:postId", feedController.getPost);
router.put(
  "/post/:postId",
  body("title").trim().isLentgh({ min: 5 }),
  body("content").trim().isLentgh({ min: 5 }),
  feedController.updatePost
);

module.exports = router;
