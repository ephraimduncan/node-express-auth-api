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
      if (error) {
        console.error(error);

        return reject(createHttpError.InternalServerError());
      }

      return resolve(token);
    });
  });
}

module.exports = {
  signAccessToken,
};
