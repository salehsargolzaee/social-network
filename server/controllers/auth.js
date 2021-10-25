const { isPasswordTrue, hashPassword } = require("../helpers/auth");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // console.log(req.body);
  const { name, email, password, answer } = req.body;

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

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = new User({
    name,
    email,
    password: hashedPassword,
    answer,
  });

  await user.save((err) => {
    if (err) {
      console.log("Registraion Error => ", err);
      return res
        .status(400)
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

    // make sure we dons't sednn user's password and answer
    user.password = undefined;
    user.answer = undefined;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("An error happened. Please try again");
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // res.json(user);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
