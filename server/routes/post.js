const express = require("express");
const formidable = require("express-formidable");

//controllers
const {
  createPost,
  uploadImage,
  userPosts,
  getUserPostById,
  updatePost,
  deletePost,
  newsFeed,
} = require("../controllers/post");

//middlewares
const { requireSignin, canModifyPost } = require("../middlewares");

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/upload-image",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

router.get("/user-posts", requireSignin, userPosts);
router.get("/news-feed", requireSignin, newsFeed);
router.get("/user-post/:id", requireSignin, getUserPostById);

// canModifyPost is a middleware which makes sure
// user is trying to edit or delete his/her own post not others

router.put("/update-post/:id", requireSignin, canModifyPost, updatePost);

router.delete("/delete-post/:id", requireSignin, canModifyPost, deletePost);

module.exports = router;
