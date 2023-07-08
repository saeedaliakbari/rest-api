exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{ title: "fitst titel", content: "this a test for rest api" }],
  });
};

exports.createPosts = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: "new post created",
    post: {
      id: new Date().toISOString(),
      title: title,
      content: content,
    },
  });
};
