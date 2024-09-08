const Post = require("../models/post");

exports.fetchPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts = [];

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        totalCount: count,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.fetchPost = (req, res, next) => {
  if (!!req.params.id) {
    Post.findById(req.params.id)
      .then((post) => {
        if (post) {
          res.status(200).json({ message: "Post fetched successfully", post });
        } else {
          res.status(404).json({ message: "Post not found!" });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: "Fetching post failed!",
        });
      });
  } else {
    res
      .status(404)
      .json({ message: `Post with id: ${req.params.id} not found!` });
  }
};

exports.createPost = (req, res, next) => {
  const baseURl = `${req.protocol}://${req.get("host")}`;

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file ? `${baseURl}/images/${req.file.filename}` : null,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((createdPost) => {
      const post = createdPost.toObject();
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...post,
          id: post._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Creating a post failed!",
      });
    });
};

exports.updatePost = (req, res, next) => {
  const baseURl = `${req.protocol}://${req.get("host")}`;

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file
      ? `${baseURl}/images/${req.file.filename}`
      : req.body.imagePath,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res
          .status(403)
          .json({ message: "Only creator of the post can modify it" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Delete successful!" });
      } else {
        res
          .status(403)
          .json({ message: "Only creator of the post can delete it" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Deleting post failed!",
      });
    });
};
