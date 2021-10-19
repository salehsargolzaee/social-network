const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.hashPassword = (plainPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }
      resolve(hash);
    });
  });
};

exports.isPasswordTrue = (plainPassword, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hash, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};
