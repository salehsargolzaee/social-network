const Post = require("../models/post");
const regex = /(<([^>]+)>)/gi;

exports.createPost = async (req, res) => {
  const { postContent } = req.body;

  if (!postContent.replace(regex, "").length) {
    return res.status(400).send("Please write something");
  }

  try {
    const post = new Post({
      content: postContent,
      postedBy: req.user._id,
    });

    await post.save().then((posted) => res.json(posted));
  } catch (err) {
    console.log(err);
    res.status(400).send("An error happened. Please try again");
  }
};
