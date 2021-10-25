const expressJwt = require("express-jwt");

exports.tokenSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
