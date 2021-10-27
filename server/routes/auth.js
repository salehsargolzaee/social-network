const express = require("express");

//controllers
const {
  register,
  login,
  currentUser,
  findQuestion,
  forgotPassword,
} = require("../controllers/auth");

//middlewares
const { tokenSignin } = require("../middlewares");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/find-question", findQuestion);
router.post("/forgot-password", forgotPassword);
router.get("/current-user", tokenSignin, currentUser);

module.exports = router;
