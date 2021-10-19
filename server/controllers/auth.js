const { isPasswordTrue, hashPassword } = require("../helpers/auth");
const User = require("../models/user");

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

  await user.save((err, savedUser) => {
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
