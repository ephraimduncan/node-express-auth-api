const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.ACCESS_TOKEN_SECRET;
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
