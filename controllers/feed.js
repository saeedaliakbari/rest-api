const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Title ",
        content: "First content",
        imageUrl: "images/1.png",
        creator: { name: "Saeed Aliakabri" },
        createAt: new Date(),
      },
    ],
  });
};

exports.createPosts = (req, res, next) => {
  const errors = validationResult(req);
  // res.json({ error: errors.array() });
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "validation faild", errors: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;
  const name = req.body.name;
  res.status(201).json({
    message: "Post added",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: { name: name },
      createAt: new Date(),
    },
  });
};
