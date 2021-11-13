const express = require("express");

//controllers
const {
  register,
  login,
  currentUser,
  findQuestion,
  forgotPassword,
  profileUpdate,
  findPeople,
} = require("../controllers/auth");

//middlewares
const { requireSignin } = require("../middlewares");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/find-question", findQuestion);
router.post("/forgot-password", forgotPassword);

router.get("/current-user", requireSignin, currentUser);
router.get("/find-people", requireSignin, findPeople);

router.put("/profile-update", requireSignin, profileUpdate);

module.exports = router;
