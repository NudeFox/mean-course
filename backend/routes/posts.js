const express = require("express");

const PostsController = require("../controllers/posts");

const extractFile = require("../middleware/extract-file");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("", PostsController.fetchPosts);

router.get("/:id", PostsController.fetchPost);

router.post("", checkAuth, extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
