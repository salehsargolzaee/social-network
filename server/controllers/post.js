const Post = require("../models/post");
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

    await post.save().then((posted) => res.json(posted));
  } catch (err) {
    console.log(err);
    res.status(400).send("An error happened. Please try again");
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
    res.status(400).send("An error happened. Please try again");
  }
};

exports.userPosts = async (req, res) => {
  try {
    // await Post.find({ postedBy: req.user._id })
    const posts = await Post.find()
      .populate("postedBy", "_id name photo")
      .sort({ createdAt: -1 })
      .limit(10);
    // console.log("posts => ", posts);
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(400).send("Posts can't be rendered.");
  }
};

exports.getUserPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(400).send("An error happened. Please try again");
  }
};

exports.updatePost = async (req, res) => {
  // console.log("post update controller=>", req.body);
  const { postContent: content, postImage: image } = req.body;
  try {
    const response = await Post.updateOne(
      { _id: req.params.id },
      { content, image }
    );
    console.log("response to update =>", response);
    if (response.modifiedCount !== 1) {
      return res.status(400).send("An error happened. Please try again");
    }
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("An error happened. Please try again");
  }
};
