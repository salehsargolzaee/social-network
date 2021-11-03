const express = require("express");

//controllers
const { createPost } = require("../controllers/post");

//middlewares
const { requireSignin } = require("../middlewares");

const router = express.Router();

router.post("/create-post", requireSignin, createPost);

module.exports = router;
