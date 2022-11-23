const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
const { use } = require("../Routes/Auth.route");

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = "SECRET";
    const options = {
      expiresIn: "1h",
      issuer: "astrosaurus.me",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (error, token) => {
      if (error) return reject(error);

      return resolve(token);
    });
  });
}

module.exports = {
  signAccessToken,
};
