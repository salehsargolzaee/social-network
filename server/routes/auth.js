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
  followUser,
  userFollowing,
  unfollowUser,
  userSearch,
  getUser,
  userFollowers,
} = require("../controllers/auth");

//middlewares
const {
  requireSignin,
  addFollower,
  removeFollower,
  isAdmin,
} = require("../middlewares");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/find-question", findQuestion);
router.post("/forgot-password", forgotPassword);

router.get("/current-user", requireSignin, currentUser);
router.get("/find-people", requireSignin, findPeople);
router.get("/user-following", requireSignin, userFollowing);
router.get("/user-followers", requireSignin, userFollowers);
router.get("/user-search/:query", userSearch);
router.get("/user/:username", getUser);

router.put("/profile-update", requireSignin, profileUpdate);
// add follower middleware to add this user to target user's followers
router.put("/follow-user", requireSignin, addFollower, followUser);

router.put("/unfollow-user", requireSignin, removeFollower, unfollowUser);

// admin
router.get("/current-admin", requireSignin, isAdmin, currentUser);

module.exports = router;
