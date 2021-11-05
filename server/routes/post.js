const express = require("express");
const formidable = require("express-formidable");

//controllers
const { createPost, uploadImage } = require("../controllers/post");

//middlewares
const { requireSignin } = require("../middlewares");

const router = express.Router();

router.post("/create-post", requireSignin, createPost);
router.post(
  "/upload-image",
  requireSignin,
  formidable({ maxFileSize: 5 * 1024 * 1024 }),
  uploadImage
);

module.exports = router;
