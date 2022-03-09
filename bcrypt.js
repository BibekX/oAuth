const bcrypt = require("bcrypt");

module.exports.hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt((err, salt) => {
      console.log("SALT", salt);
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

module.exports.checkPassword = (password, hashedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, match) => {
      if (err) {
        reject(err);
      }
      resolve(match);
    });
  });
};
