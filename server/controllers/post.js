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
    console.log("uploaded image result =>", result);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("An error happened. Please try again");
  }
};
