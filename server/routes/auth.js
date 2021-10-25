const express = require("express");

//controllers
const { register, login, currentUser } = require("../controllers/auth");

//middlewares
const { tokenSignin } = require("../middlewares");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current-user", tokenSignin, currentUser);

module.exports = router;
