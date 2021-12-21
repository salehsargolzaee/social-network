const Post = require("../models/post");
const User = require("../models/user");
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const regex = /(<([^>]+)>)/gi;

exports.createPost = async (req, res) => {
  const { postContent, postImage } = req.body;

  if (!postContent.replace(regex, "").length) {
    return res.status(400).send("Please write something");
  }

  try {
    const post = new Post({
      content: postContent,
      postedBy: req.user._id,
      image: postImage,
    });

    await post.save().then(async (posted) => {
      const postWithPostedBy = await Post.findById(posted._id).populate(
        "postedBy",
        "_id name username photo"
      );
      res.json(postWithPostedBy);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.uploadImage = async (req, res) => {
  // console.log("req files=> ", req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    // console.log("uploaded image result =>", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.getUserPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name photo");
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.updatePost = async (req, res) => {
  // console.log("post update controller=>", req.body);
  const { postContent: content, postImage: image } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      content,
      image,
    });
    console.log("post before update =>", post);
    if (!post) {
      return res.status(400).send("An error happened. Please try again");
    }
    // delete image from cloudinary
    if (post.image && post.image.public_id && post.image.url !== image.url) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    // delete image from cloudinary
    if (post.image && post.image.public_id) {
      await cloudinary.uploader.destroy(post.image.public_id);
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.newsFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;
    following.push(user._id);

    // pagination related work
    const currentPage = req.params.page || 1;
    const showPerPage = 4;

    const posts = await Post.find({ postedBy: { $in: following } })
      .skip((currentPage - 1) * showPerPage)
      .populate("postedBy", "_id name username photo")
      .populate("comments.postedBy", "_id  name photo")
      .sort({ createdAt: -1 })
      .limit(showPerPage);

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Posts can't be rendered.");
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Can't like. Please try again.");
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body._id,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Can't unlike. Please try again.");
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { text: comment, postedBy: req.user._id } },
      },
      { new: true }
    ).populate("comments.postedBy", "_id name photo");
    res.json({ postId: post._id, comments: post.comments });
  } catch (err) {
    res.status(500).send("Unsuccessfull, please try again later.");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      { $pull: { comments: { _id: req.body.commentId } } },
      { new: true }
    ).populate("comments.postedBy", "_id name photo");
    res.json(post.comments);
  } catch (err) {
    console.log(err);
    res.status(500).send("Unsuccessfull, please try again later.");
  }
};

exports.totalPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;
    following.push(user._id);

    const totalPosts = await Post.count({
      postedBy: { $in: following },
    });
    // console.log(totalPosts);
    res.json(totalPosts);
  } catch (err) {
    console.log("Error in getting total posts => ", err);
    res.status(500).send("Error in getting total posts");
  }
};

exports.posts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("postedBy", "_id name username photo")
      .sort({ createdAt: -1 })
      .limit(12);
    res.json(posts);
  } catch (err) {
    console.log("Error in getting posts for index page =>", err);
    res.status(500).send("Error in getting posts for home page");
  }
};

exports.userPosts = async (req, res) => {
  try {
    // await Post.find({ postedBy: req.user._id })
    const posts = await Post.find()
      .populate("postedBy", "_id name username photo")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send("Posts can't be rendered for admin.");
  }
};
