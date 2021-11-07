const expressJwt = require("express-jwt");
const Post = require("../models/post");

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.canModifyPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    // I used != because i didn't want to change both to string
    if (req.user._id != post.postedBy) {
      return res.json({ err: "This request is not allowed for you." });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
