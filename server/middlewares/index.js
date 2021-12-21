const expressJwt = require("express-jwt");
const Post = require("../models/post");
const User = require("../models/user");

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

exports.canModifyComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.body.postId);
    const comment = post.comments.filter(
      (comment) => comment._id == req.body.commentId
    );
    if (comment[0].postedBy != req.user._id) {
      return res.json({ err: "This request is not allowed for you." });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.removeFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.body._id, {
      $pull: { followers: req.user._id },
    });
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "Admin") {
      return res.status(400).send("Unauthorized");
    }
    next();
  } catch (err) {
    console.log("Error in isAdmin middleware=>", err);
  }
};
