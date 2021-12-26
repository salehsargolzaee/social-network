const { isPasswordTrue, hashPassword } = require("../helpers/auth");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
var cloudinary = require("cloudinary").v2;

exports.register = async (req, res) => {
  // console.log(req.body);
  const { name, email, password, question, answer } = req.body;

  // Information validation
  if (!name) {
    return res.status(400).send("Name is required.");
  }
  if (!password || password.length < 6 || password.length > 64) {
    return res
      .status(400)
      .send(
        "Password is required and should be between 6 and 64 characters long."
      );
  }
  if (!answer) {
    return res.status(400).send("Answer is required");
  }

  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return res.status(400).send("Email address already exists.");
  }

  if (!email) {
    return res.status(400).send("Email is required");
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Hash answer for changing password
  const hashedAnswer = await hashPassword(answer.trim().toLowerCase());

  // Create new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    question,
    answer: hashedAnswer,
    username: nanoid(6),
  });

  await user.save((err) => {
    if (err) {
      console.log("Registraion Error => ", err);
      return res
        .status(500)
        .send("Something went wrong. Please try again later.");
    }
    return res.json({
      ok: true,
    });
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if our db has user with receiving email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // check password
    const isMatch = await isPasswordTrue(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    // create signed token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // make sure we don't send user's password and answer
    user.password = undefined;
    user.answer = undefined;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error happened. Please try again");
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.sendStatus(401);
    }
    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.findQuestion = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email address");
    }

    res.json({ question: user.question, _id: user._id });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.forgotPassword = async (req, res) => {
  const { answer, newPassword, _id } = req.body;

  if (!answer) {
    return res.status(400).send("Answer is required");
  }

  try {
    const user = await User.findById(_id);

    const isAnswerMatch = await isPasswordTrue(
      answer.trim().toLowerCase(),
      user.answer
    );

    if (!isAnswerMatch) {
      return res.status(400).send("Wrong answer");
    }

    if (!newPassword || newPassword.length < 6 || newPassword.length > 64) {
      return res
        .status(400)
        .send(
          "Password is required and should be between 6 and 64 characters long."
        );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    const response = await User.updateOne(
      { _id },
      { password: hashedPassword }
    );

    // console.log(response.modifiedCount);
    if (response.modifiedCount !== 1) {
      return res.status(400).send("An error happened. Please try again");
    }

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.profileUpdate = async (req, res) => {
  const { name, username, about, password, newPassword, photo } = req.body;
  const updateData = { about };
  try {
    let user = await User.findOne({ _id: req.user._id });
    if (password || newPassword) {
      const isMatch = await isPasswordTrue(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Your password is wrong");
      }
      if (!newPassword || newPassword.length < 6 || newPassword.length > 64) {
        return res
          .status(400)
          .send(
            "New password is required and should be between 6 and 64 characters long."
          );
      }
      const hashedPassword = await hashPassword(newPassword);
      updateData.password = hashedPassword;
    }

    if (user.photo && user.photo.public_id && user.photo.url !== photo.url) {
      await cloudinary.uploader.destroy(user.photo.public_id);
    }
    updateData.photo = photo;

    if (username) {
      user = await User.findOne({ username });
      if (user && user._id != req.user._id) {
        return res.status(400).send("Username is taken");
      }
      updateData.username = username;
    }
    if (name) {
      updateData.name = name;
    }

    user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });

    // make sure we don't send user's password and answer
    user.password = undefined;
    user.answer = undefined;

    res.json(user);
  } catch (err) {
    console.log(err);
    // this code means there is a duplicate (for username)
    if (err.code == 11000) {
      return res.status(400).send("Username is taken");
    }

    res.status(500).send("An error happened. Please try again");
  }
};

exports.findPeople = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id);

    // We want to exclude logged in user and his/her followings from following suggestions
    const followingsAndUser = loggedInUser.following;
    followingsAndUser.push(loggedInUser._id);

    const suggestedUsers = await User.find({
      _id: { $nin: followingsAndUser },
    })
      .select("-password -answer -question")
      .limit(10);
    // console.log(suggestedUsers);
    res.json(suggestedUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.followUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { following: req.body._id },
      },
      { new: true }
    ).select("-password -answer -question");

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body._id },
      },
      { new: true }
    ).select("-password -answer -question");

    // console.log(user);

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.userFollowing = async (req, res) => {
  try {
    const { following } = await User.findById(req.user._id);

    const followingUsers = await User.find({ _id: { $in: following } }).limit(
      150
    );

    res.json(followingUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.userFollowers = async (req, res) => {
  try {
    const { followers } = await User.findById(req.user._id);

    const followersUsers = await User.find({ _id: { $in: followers } }).limit(
      150
    );

    res.json(followersUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.userSearch = async (req, res) => {
  const { query } = req.params;

  if (!query) return;

  try {
    // The "i" in options means we want to perform case-insensitive matching
    const user = await User.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
        {
          username: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }).select("_id name photo about username role");

    res.json(user);
  } catch (err) {
    console.log("Error in finding searched user in database=>", err);
    res.status(500).send("An error happened. Please try again");
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -answer -question -updatedAt -__v"
    );
    res.json(user);
  } catch (err) {
    console.log("Error in finding user public profile => ", err);
    res.status(500).send("An error happened. Please try again");
  }
};
